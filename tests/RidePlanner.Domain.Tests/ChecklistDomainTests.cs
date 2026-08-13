using RidePlanner.Domain.Entities.Checklist;

namespace RidePlanner.Domain.Tests;

public class ChecklistDomainTests
{
    [Fact]
    public void ChecklistItem_Creation_Defaults_To_IsRequired_True()
    {
        var categoryId = Guid.NewGuid();
        var item = new ChecklistItem(categoryId, "Check tyre pressure", 1);

        Assert.True(item.IsRequired);
        Assert.False(item.IsCompleted);
    }

    [Fact]
    public void ChecklistItem_Creation_Allows_Setting_Optional()
    {
        var categoryId = Guid.NewGuid();
        var item = new ChecklistItem(categoryId, "Clean bike", 2, isCompleted: false, isRequired: false);

        Assert.False(item.IsRequired);
    }

    [Fact]
    public void ChecklistItem_Update_Allows_Changing_Required_Status()
    {
        var categoryId = Guid.NewGuid();
        var item = new ChecklistItem(categoryId, "Camera", 3, isRequired: true);

        item.Update("Camera", 3, isRequired: false);

        Assert.False(item.IsRequired);
    }

    [Fact]
    public void ChecklistCategory_AddItem_Defaults_To_Required()
    {
        var tripId = Guid.NewGuid();
        var category = new ChecklistCategory(tripId, "Vehicle", 1);

        var item = category.AddItem("Check engine oil", 1);

        Assert.True(item.IsRequired);
    }
}
