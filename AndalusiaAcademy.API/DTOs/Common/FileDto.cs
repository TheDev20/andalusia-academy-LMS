namespace AndalusiaAcademy.API.DTOs.Common;

/// <summary>A stored file as shown to clients. Content is fetched from <c>GET /api/files/{id}</c>.</summary>
public sealed record FileDto(Guid Id, string FileName, string MediaType, long SizeBytes);
