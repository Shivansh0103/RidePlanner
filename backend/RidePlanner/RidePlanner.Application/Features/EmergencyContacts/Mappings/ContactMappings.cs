using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.EmergencyContacts.Mappings;

public static class ContactMappings
{
    public static EmergencyContactDto ToDto(this EmergencyContact contact)
    {
        return new EmergencyContactDto
        {
            Id = contact.Id,
            TripId = contact.TripId,
            Name = contact.Name,
            Relationship = contact.Relationship,
            Phone = contact.Phone,
            AlternatePhone = contact.AlternatePhone,
            Email = contact.Email,
            IsPrimary = contact.IsPrimary,
            CreatedAt = contact.CreatedAt,
            UpdatedAt = contact.UpdatedAt,
        };
    }
}
