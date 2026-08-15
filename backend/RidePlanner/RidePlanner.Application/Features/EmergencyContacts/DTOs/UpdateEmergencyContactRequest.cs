namespace RidePlanner.Application.Features.EmergencyContacts.DTOs;

public sealed class UpdateEmergencyContactRequest
{
    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? AlternatePhone { get; set; }
    public string? Email { get; set; }
    public bool IsPrimary { get; set; }
}
