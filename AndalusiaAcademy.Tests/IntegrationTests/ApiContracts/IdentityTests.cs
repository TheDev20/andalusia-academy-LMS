using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.ApiContracts;

[Collection(ApiCollection.Name)]
public class IdentityTests
{
    private readonly SqlServerApiFactory _factory;
    private readonly TestScenario _scenario;

    public IdentityTests(SqlServerApiFactory factory)
    {
        _factory = factory;
        _scenario = new TestScenario(factory);
    }

    [Fact]
    public async Task Registration_returns_a_learner_session_and_stores_a_hashed_password()
    {
        var email = $"New.User.{Guid.NewGuid():N}@Tests.Andalusia.Local";
        var response = await _scenario.Anonymous().PostAsJsonAsync("/api/auth/register",
            new RegisterRequest("Nour", "Ali", email, TestScenario.Password, "+201000000000", "eg", "en"));

        await response.EnsureStatusAsync(HttpStatusCode.Created);
        var auth = (await response.Content.ReadFromJsonAsync<AuthResponse>())!;
        Assert.Equal("Bearer", auth.TokenType);
        Assert.Equal([AppRoles.Learner], auth.User.Roles);
        Assert.Contains(PermissionCodes.ApplicationsApply, auth.User.Permissions);
        Assert.Equal(email.ToLowerInvariant(), auth.User.Email);

        var stored = await _factory.WithDbAsync(db => db.AppUsers.SingleAsync(u => u.Id == auth.User.Id));
        Assert.NotEqual(TestScenario.Password, stored.PasswordHash);
        Assert.Equal("EG", stored.CountryCode);
    }

    [Fact]
    public async Task Registration_validates_input_and_rejects_duplicate_email()
    {
        var client = _scenario.Anonymous();

        var invalid = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest("", "X", "bad", "123", null, null, null));
        await invalid.EnsureStatusAsync(HttpStatusCode.BadRequest);

        var learner = await _scenario.RegisterLearnerAsync();
        var duplicate = await client.PostAsJsonAsync("/api/auth/register",
            new RegisterRequest("Dup", "User", learner.Email.ToUpperInvariant(), TestScenario.Password, null, null, null));
        await duplicate.EnsureStatusAsync(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Login_rejects_wrong_password_and_unknown_user_identically()
    {
        var learner = await _scenario.RegisterLearnerAsync();
        var client = _scenario.Anonymous();

        var wrong = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(learner.Email, "Wrong-password-1"));
        var unknown = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest($"ghost.{Guid.NewGuid():N}@x.test", "Wrong-password-1"));

        await wrong.EnsureStatusAsync(HttpStatusCode.Unauthorized);
        await unknown.EnsureStatusAsync(HttpStatusCode.Unauthorized);
        var wrongProblem = await wrong.Content.ReadFromJsonAsync<ProblemDetails>();
        var unknownProblem = await unknown.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.Equal(wrongProblem!.Title, unknownProblem!.Title);
        Assert.Equal(wrongProblem.Detail, unknownProblem.Detail);
    }

    [Fact]
    public async Task Logout_revokes_the_access_token()
    {
        var learner = await _scenario.RegisterLearnerAsync();
        await (await learner.Client.GetAsync("/api/me/profile")).EnsureStatusAsync(HttpStatusCode.OK);

        await (await learner.Client.PostAsync("/api/auth/logout", null)).EnsureStatusAsync(HttpStatusCode.NoContent);

        await (await learner.Client.GetAsync("/api/me/profile")).EnsureStatusAsync(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Profile_can_be_read_and_updated()
    {
        var learner = await _scenario.RegisterLearnerAsync();

        var update = await learner.Client.PutAsJsonAsync("/api/me/profile",
            new UpdateProfileRequest("Updated", "Name", "+20123456789", "ae", "en"));
        await update.EnsureStatusAsync(HttpStatusCode.OK);

        var profile = await learner.Client.GetFromJsonAsync<ProfileDto>("/api/me/profile");
        Assert.Equal("Updated", profile!.FirstName);
        Assert.Equal("AE", profile.CountryCode);
        Assert.Equal(learner.Email, profile.Email);
    }

    [Fact]
    public async Task Change_password_requires_current_password_and_revokes_old_tokens()
    {
        var learner = await _scenario.RegisterLearnerAsync();

        var wrong = await learner.Client.PostAsJsonAsync("/api/me/change-password", new ChangePasswordRequest("nope-nope", "N3w-Password!"));
        await wrong.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);

        var ok = await learner.Client.PostAsJsonAsync("/api/me/change-password", new ChangePasswordRequest(learner.Password, "N3w-Password!"));
        await ok.EnsureStatusAsync(HttpStatusCode.OK);
        var fresh = (await ok.Content.ReadFromJsonAsync<AuthResponse>())!;

        await (await learner.Client.GetAsync("/api/me/profile")).EnsureStatusAsync(HttpStatusCode.Unauthorized);

        var freshClient = _scenario.Anonymous();
        freshClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", fresh.AccessToken);
        await (await freshClient.GetAsync("/api/me/profile")).EnsureStatusAsync(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Password_reset_flow_replaces_password_and_tokens_are_single_use()
    {
        var learner = await _scenario.RegisterLearnerAsync();
        var client = _scenario.Anonymous();

        var forgot = await client.PostAsJsonAsync("/api/auth/forgot-password", new ForgotPasswordRequest(learner.Email));
        await forgot.EnsureStatusAsync(HttpStatusCode.Accepted);
        var token = (await forgot.Content.ReadFromJsonAsync<ForgotPasswordResponse>())!.DevelopmentResetToken;
        Assert.False(string.IsNullOrEmpty(token));

        // The raw token is never stored; a delivery request is queued in the outbox.
        var storedHashes = await _factory.WithDbAsync(db => db.PasswordResetTokens.Where(t => t.UserId == learner.Id).Select(t => t.TokenHash).ToListAsync());
        Assert.DoesNotContain(token, storedHashes);
        Assert.True(await _factory.WithDbAsync(db => db.OutboxMessages.AnyAsync(m => m.Type == "Identity.PasswordResetRequested" && m.PayloadJson.Contains(learner.Id.ToString()))));

        const string newPassword = "Res3t-Password!";
        var reset = await client.PostAsJsonAsync("/api/auth/reset-password", new ResetPasswordRequest(learner.Email, token!, newPassword));
        await reset.EnsureStatusAsync(HttpStatusCode.NoContent);

        await (await learner.Client.GetAsync("/api/me/profile")).EnsureStatusAsync(HttpStatusCode.Unauthorized);
        await (await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(learner.Email, learner.Password)))
            .EnsureStatusAsync(HttpStatusCode.Unauthorized);
        await (await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(learner.Email, newPassword)))
            .EnsureStatusAsync(HttpStatusCode.OK);

        var reuse = await client.PostAsJsonAsync("/api/auth/reset-password", new ResetPasswordRequest(learner.Email, token!, "An0ther-Password!"));
        await reuse.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task Forgot_password_does_not_reveal_unknown_accounts()
    {
        var response = await _scenario.Anonymous().PostAsJsonAsync("/api/auth/forgot-password",
            new ForgotPasswordRequest($"nobody.{Guid.NewGuid():N}@x.test"));

        await response.EnsureStatusAsync(HttpStatusCode.Accepted);
        Assert.Null((await response.Content.ReadFromJsonAsync<ForgotPasswordResponse>())!.DevelopmentResetToken);
    }

    [Fact]
    public async Task Reset_token_for_another_email_is_rejected()
    {
        var victim = await _scenario.RegisterLearnerAsync();
        var attacker = await _scenario.RegisterLearnerAsync();
        var client = _scenario.Anonymous();

        var forgot = await client.PostAsJsonAsync("/api/auth/forgot-password", new ForgotPasswordRequest(attacker.Email));
        var token = (await forgot.Content.ReadFromJsonAsync<ForgotPasswordResponse>())!.DevelopmentResetToken!;

        var response = await client.PostAsJsonAsync("/api/auth/reset-password", new ResetPasswordRequest(victim.Email, token, "Hij4cked-Password"));
        await response.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }
}
