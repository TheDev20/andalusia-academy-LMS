using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using AndalusiaAcademy.API.Services.Implementations.Storage;

namespace AndalusiaAcademy.Tests.UnitTests.Storage;

public sealed class LocalFileStorageTests : IDisposable
{
    private readonly string _root = Path.Combine(Path.GetTempPath(), "andalusia-storage-" + Guid.NewGuid().ToString("N"));
    private readonly LocalFileStorage _storage;

    public LocalFileStorageTests()
    {
        _storage = new LocalFileStorage(Options.Create(new FileStorageOptions { RootPath = _root }), new StubEnvironment());
    }

    public void Dispose()
    {
        if (Directory.Exists(_root))
        {
            Directory.Delete(_root, recursive: true);
        }
    }

    [Fact]
    public async Task Saves_and_reads_back_the_same_bytes()
    {
        var key = LocalFileStorage.NewObjectKey(DateTimeOffset.UtcNow);
        var data = new byte[] { 1, 2, 3, 4, 5 };

        await _storage.SaveAsync(key, new MemoryStream(data));
        await using var read = await _storage.OpenReadAsync(key);
        using var copy = new MemoryStream();
        await read.CopyToAsync(copy);

        Assert.Equal(data, copy.ToArray());
        Assert.DoesNotContain(Directory.EnumerateFiles(_root, "*", SearchOption.AllDirectories), f => f.EndsWith(".part"));
    }

    [Fact]
    public async Task Reading_a_missing_object_throws_file_not_found()
    {
        await Assert.ThrowsAsync<FileNotFoundException>(() => _storage.OpenReadAsync(LocalFileStorage.NewObjectKey(DateTimeOffset.UtcNow)));
    }

    [Fact]
    public async Task Delete_removes_the_object_and_is_idempotent()
    {
        var key = LocalFileStorage.NewObjectKey(DateTimeOffset.UtcNow);
        await _storage.SaveAsync(key, new MemoryStream([9]));

        await _storage.DeleteAsync(key);
        await _storage.DeleteAsync(key);

        await Assert.ThrowsAsync<FileNotFoundException>(() => _storage.OpenReadAsync(key));
    }

    [Fact]
    public async Task Saving_the_same_key_twice_fails_instead_of_overwriting()
    {
        var key = LocalFileStorage.NewObjectKey(DateTimeOffset.UtcNow);
        await _storage.SaveAsync(key, new MemoryStream([1]));

        await Assert.ThrowsAnyAsync<IOException>(() => _storage.SaveAsync(key, new MemoryStream([2])));
    }

    [Theory]
    [InlineData("../secret")]
    [InlineData("2026/11/../../../etc/passwd")]
    [InlineData("/etc/passwd")]
    [InlineData("2026/11/NOTHEX0000000000000000000000000000")]
    [InlineData("2026/11/abc")]
    [InlineData("")]
    public async Task Rejects_object_keys_that_could_escape_the_root(string key)
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _storage.SaveAsync(key, new MemoryStream([1])));
        await Assert.ThrowsAsync<ArgumentException>(() => _storage.OpenReadAsync(key));
        await Assert.ThrowsAsync<ArgumentException>(() => _storage.DeleteAsync(key));
    }

    [Fact]
    public void Generated_keys_never_contain_user_supplied_text_and_are_unique()
    {
        var now = DateTimeOffset.UtcNow;
        var keys = Enumerable.Range(0, 100).Select(_ => LocalFileStorage.NewObjectKey(now)).ToList();

        Assert.Equal(100, keys.Distinct().Count());
        Assert.All(keys, k => Assert.Matches(@"^\d{4}/\d{2}/[0-9a-f]{32}$", k));
    }

    private sealed class StubEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = "Testing";
        public string ApplicationName { get; set; } = "Tests";
        public string ContentRootPath { get; set; } = Path.GetTempPath();
        public IFileProvider ContentRootFileProvider { get; set; } = null!;
    }
}
