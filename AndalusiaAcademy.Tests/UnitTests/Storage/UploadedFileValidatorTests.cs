using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Services.Implementations.Storage;
using AndalusiaAcademy.API.Services.Interfaces.Storage;

namespace AndalusiaAcademy.Tests.UnitTests.Storage;

public class UploadedFileValidatorTests
{
    private static readonly byte[] Pdf = "%PDF-1.7\n%âãÏÓ"u8.ToArray();
    private static readonly byte[] Png = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0];
    private static readonly byte[] Jpeg = [0xFF, 0xD8, 0xFF, 0xE0, 0, 0x10];
    private static readonly byte[] Zip = [0x50, 0x4B, 0x03, 0x04, 0x14, 0];
    private static readonly byte[] Ole = [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1, 0];

    [Theory]
    [InlineData("report.pdf", "application/pdf")]
    [InlineData("REPORT.PDF", "application/pdf")]
    public void Accepts_a_pdf_with_a_pdf_signature(string name, string mediaType)
    {
        var result = UploadedFileValidator.Validate(name, Pdf.Length, Pdf);
        Assert.Equal(mediaType, result.MediaType);
        Assert.Equal(name, result.DisplayName);
    }

    [Theory]
    [MemberData(nameof(ValidFiles))]
    public void Accepts_each_allowed_type_with_a_matching_signature(string name, byte[] header, string mediaType)
    {
        Assert.Equal(mediaType, UploadedFileValidator.Validate(name, header.Length, header).MediaType);
    }

    public static TheoryData<string, byte[], string> ValidFiles() => new()
    {
        { "a.png", Png, "image/png" },
        { "a.jpg", Jpeg, "image/jpeg" },
        { "a.jpeg", Jpeg, "image/jpeg" },
        { "a.docx", Zip, "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        { "a.pptx", Zip, "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
        { "a.xlsx", Zip, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { "a.zip", Zip, "application/zip" },
        { "a.doc", Ole, "application/msword" },
        { "a.xls", Ole, "application/vnd.ms-excel" },
        { "notes.txt", "hello"u8.ToArray(), "text/plain" },
        { "data.csv", "a,b\n1,2"u8.ToArray(), "text/csv" },
        { "readme.md", "# Title"u8.ToArray(), "text/markdown" },
    };

    [Theory]
    [InlineData("setup.exe")]
    [InlineData("script.js")]
    [InlineData("page.html")]
    [InlineData("image.svg")]
    [InlineData("archive.tar.gz")]
    [InlineData("noextension")]
    public void Rejects_extensions_outside_the_allow_list(string name)
    {
        var ex = Assert.Throws<BusinessRuleException>(() => UploadedFileValidator.Validate(name, 10, Pdf));
        Assert.Contains("not allowed", ex.Message);
    }

    [Fact]
    public void Rejects_an_executable_renamed_to_pdf()
    {
        var mzHeader = new byte[] { 0x4D, 0x5A, 0x90, 0x00, 0x03 };
        var ex = Assert.Throws<BusinessRuleException>(() => UploadedFileValidator.Validate("invoice.pdf", mzHeader.Length, mzHeader));
        Assert.Contains("does not match", ex.Message);
    }

    [Fact]
    public void Rejects_binary_content_posing_as_text()
    {
        var binary = new byte[] { 0x41, 0x00, 0x42 };
        Assert.Throws<BusinessRuleException>(() => UploadedFileValidator.Validate("notes.txt", binary.Length, binary));
    }

    [Fact]
    public void Rejects_empty_files()
    {
        Assert.Throws<BusinessRuleException>(() => UploadedFileValidator.Validate("a.pdf", 0, []));
    }

    [Fact]
    public void Rejects_files_over_the_size_limit_and_accepts_exactly_the_limit()
    {
        Assert.Throws<BusinessRuleException>(() => UploadedFileValidator.Validate("a.pdf", UploadLimits.MaxFileBytes + 1, Pdf));
        Assert.Equal("application/pdf", UploadedFileValidator.Validate("a.pdf", UploadLimits.MaxFileBytes, Pdf).MediaType);
    }

    [Theory]
    [InlineData("../../etc/passwd.txt", "passwd.txt")]
    [InlineData(@"C:\Users\x\report.pdf", "report.pdf")]
    [InlineData("a\u0000b\nc.pdf", "abc.pdf")]
    [InlineData("  spaced name.pdf  ", "spaced name.pdf")]
    public void Sanitises_display_names(string raw, string expected)
    {
        Assert.Equal(expected, UploadedFileValidator.SanitiseName(raw));
    }

    [Fact]
    public void Truncates_long_names_but_keeps_the_extension()
    {
        var name = new string('a', 400) + ".pdf";
        var sanitised = UploadedFileValidator.SanitiseName(name);
        Assert.Equal(UploadLimits.MaxDisplayNameLength, sanitised.Length);
        Assert.EndsWith(".pdf", sanitised);
    }

    [Fact]
    public void A_name_that_sanitises_to_nothing_falls_back_to_a_default()
    {
        Assert.Equal("file", UploadedFileValidator.SanitiseName("///"));
        Assert.Equal("file", UploadedFileValidator.SanitiseName(null));
    }
}
