using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Tests;

public class TripMemoryDomainTests
{
    [Fact]
    public void TripMemory_Creation_WithValidData_Succeeds()
    {
        var tripId = Guid.NewGuid();
        var memoryDate = DateTimeOffset.UtcNow.AddDays(-1);

        var memory = new TripMemory(
            tripId,
            "Sunset over Khardung La Pass",
            "Highest motorable road conquered! The cold wind was extreme but sunset view was breathtaking.",
            "https://example.com/khardungla.jpg",
            odometerReadingKm: 18450,
            memoryDate: memoryDate);

        Assert.NotEqual(Guid.Empty, memory.Id);
        Assert.Equal(tripId, memory.TripId);
        Assert.Equal("Sunset over Khardung La Pass", memory.Title);
        Assert.Contains("Khardung La", memory.Title);

        Assert.Equal("https://example.com/khardungla.jpg", memory.ImageUrl);
        Assert.Equal(18450, memory.OdometerReadingKm);
        Assert.Equal(memoryDate, memory.MemoryDate);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void TripMemory_Creation_WithEmptyTitle_ThrowsDomainException(string title)
    {
        var tripId = Guid.NewGuid();
        Assert.Throws<DomainException>(() => new TripMemory(tripId, title));
    }

    [Fact]
    public void TripMemory_Creation_WithNegativeOdometer_ThrowsDomainException()
    {
        var tripId = Guid.NewGuid();
        Assert.Throws<DomainException>(() => new TripMemory(tripId, "Test Pass", odometerReadingKm: -100));
    }

    [Fact]
    public void TripMemory_Update_UpdatesPropertiesCorrectly()
    {
        var tripId = Guid.NewGuid();
        var memory = new TripMemory(tripId, "Original Title");

        memory.Update("Updated Title", "Updated Content", "https://example.com/photo.jpg", 20000);

        Assert.Equal("Updated Title", memory.Title);
        Assert.Equal("Updated Content", memory.Content);
        Assert.Equal(20000, memory.OdometerReadingKm);
    }
}
