namespace RidePlanner.Domain.Entities.Checklist;

public static class ChecklistDefaults
{
    public static List<ChecklistCategory> CreateDefaultCategories(Guid tripId)
    {
        var documents = new ChecklistCategory(tripId, "Documents", 1);
        documents.AddItem("Driving License", 1);
        documents.AddItem("Vehicle RC", 2);
        documents.AddItem("Insurance", 3);

        var vehicle = new ChecklistCategory(tripId, "Vehicle", 2);
        vehicle.AddItem("Check tyre pressure", 1);
        vehicle.AddItem("Check engine oil", 2);
        vehicle.AddItem("Check chain", 3);

        var packing = new ChecklistCategory(tripId, "Packing", 3);
        packing.AddItem("Clothes", 1);
        packing.AddItem("First-aid kit", 2);
        packing.AddItem("Chargers", 3);
        packing.AddItem("Power bank", 4);

        return [documents, vehicle, packing];
    }
}
