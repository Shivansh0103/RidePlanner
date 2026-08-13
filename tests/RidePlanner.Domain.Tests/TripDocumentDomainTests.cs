using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Tests;

public class TripDocumentDomainTests
{
    [Fact]
    public void TripDocument_Creation_WithValidData_Succeeds()
    {
        var tripId = Guid.NewGuid();
        var doc = new TripDocument(
            tripId,
            "Driving License",
            "Driving License",
            "DL-998877",
            DateTimeOffset.UtcNow.AddYears(5),
            "/uploads/dl.pdf",
            "Primary DL");

        Assert.NotEqual(Guid.Empty, doc.Id);
        Assert.Equal(tripId, doc.TripId);
        Assert.Equal("Driving License", doc.Title);
        Assert.Equal("Driving License", doc.Type);
        Assert.Equal("DL-998877", doc.DocumentNumber);
        Assert.NotNull(doc.ExpiryDate);
        Assert.Equal("/uploads/dl.pdf", doc.FilePath);
        Assert.Equal("Primary DL", doc.Notes);
    }

    [Theory]
    [InlineData("", "Passport")]
    [InlineData("   ", "Passport")]
    [InlineData("Passport", "")]
    [InlineData("Passport", "   ")]
    public void TripDocument_Creation_WithEmptyTitleOrType_ThrowsDomainException(string title, string type)
    {
        var tripId = Guid.NewGuid();
        Assert.Throws<DomainException>(() => new TripDocument(tripId, title, type));
    }

    [Fact]
    public void TripDocument_Update_UpdatesPropertiesAndTimestamp()
    {
        var tripId = Guid.NewGuid();
        var doc = new TripDocument(tripId, "RC", "Registration Certificate");

        doc.Update("Vehicle RC", "Vehicle Registration", "RC-12345", null, "/docs/rc.pdf", "Updated");

        Assert.Equal("Vehicle RC", doc.Title);
        Assert.Equal("Vehicle Registration", doc.Type);
        Assert.Equal("RC-12345", doc.DocumentNumber);
        Assert.Equal("/docs/rc.pdf", doc.FilePath);
        Assert.Equal("Updated", doc.Notes);
    }
}
