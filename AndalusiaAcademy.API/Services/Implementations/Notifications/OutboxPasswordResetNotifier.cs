using System.Text.Json;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Models.Reliability;
using AndalusiaAcademy.API.Services.Interfaces.Identity;

namespace AndalusiaAcademy.API.Services.Implementations.Notifications;

/// <summary>
/// Writes a durable outbox message (ADR 005) that the Worker's NotificationDelivery job turns into an e-mail.
/// The message is added to the caller's DbContext and commits with the reset token.
/// </summary>
public sealed class OutboxPasswordResetNotifier : IPasswordResetNotifier
{
    public const string MessageType = "Identity.PasswordResetRequested";

    private readonly ApplicationDbContext _context;

    public OutboxPasswordResetNotifier(ApplicationDbContext context)
    {
        _context = context;
    }

    public void Enqueue(AppUser user, string rawToken, DateTimeOffset expiresAt)
    {
        _context.OutboxMessages.Add(new OutboxMessage
        {
            DeduplicationKey = $"password-reset:{Guid.NewGuid():N}",
            Type = MessageType,
            PayloadJson = JsonSerializer.Serialize(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                Token = rawToken,
                ExpiresAt = expiresAt
            })
        });
    }
}
