using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Tests;

public class EmergencyContactDomainTests
{
    [Fact]
    public void EmergencyContact_Creation_WithValidData_Succeeds()
    {
        var tripId = Guid.NewGuid();
        var contact = new EmergencyContact(
            tripId,
            "John Doe",
            "Brother",
            "+1234567890",
            "+0987654321",
            "john@example.com",
            isPrimary: true);

        Assert.NotEqual(Guid.Empty, contact.Id);
        Assert.Equal(tripId, contact.TripId);
        Assert.Equal("John Doe", contact.Name);
        Assert.Equal("Brother", contact.Relationship);
        Assert.Equal("+1234567890", contact.Phone);
        Assert.Equal("+0987654321", contact.AlternatePhone);
        Assert.Equal("john@example.com", contact.Email);
        Assert.True(contact.IsPrimary);
    }

    [Theory]
    [InlineData("", "Brother", "+1234567890")]
    [InlineData("   ", "Brother", "+1234567890")]
    [InlineData("John Doe", "", "+1234567890")]
    [InlineData("John Doe", "Brother", "")]
    public void EmergencyContact_Creation_WithEmptyRequiredFields_ThrowsDomainException(
        string name, string relationship, string phone)
    {
        var tripId = Guid.NewGuid();
        Assert.Throws<DomainException>(() => new EmergencyContact(tripId, name, relationship, phone));
    }

    [Fact]
    public void EmergencyContact_Update_UpdatesPropertiesAndTimestamp()
    {
        var tripId = Guid.NewGuid();
        var contact = new EmergencyContact(tripId, "Jane", "Sister", "+11111");

        contact.Update("Jane Doe", "Sister", "+22222", null, "jane@example.com", isPrimary: true);

        Assert.Equal("Jane Doe", contact.Name);
        Assert.Equal("+22222", contact.Phone);
        Assert.Equal("jane@example.com", contact.Email);
        Assert.True(contact.IsPrimary);
    }

    [Fact]
    public void EmergencyContact_SetPrimary_ChangesPrimaryStatus()
    {
        var tripId = Guid.NewGuid();
        var contact = new EmergencyContact(tripId, "Jane", "Sister", "+11111", isPrimary: false);

        contact.SetPrimary(true);

        Assert.True(contact.IsPrimary);
    }
}
