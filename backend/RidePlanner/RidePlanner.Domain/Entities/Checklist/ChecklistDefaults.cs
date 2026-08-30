namespace RidePlanner.Domain.Entities.Checklist;

public static class ChecklistDefaults
{
    public static List<ChecklistCategory> CreateDefaultCategories(Guid tripId)
    {
        var documents = new ChecklistCategory(tripId, "Documents", 1);
        documents.AddItem("Driving License", 1, true);
        documents.AddItem("Vehicle RC & PUC Certificate", 2, true);
        documents.AddItem("Insurance Policy", 3, true);
        documents.AddItem("Government Photo ID (Aadhar / Passport)", 4, true);

        var vehicle = new ChecklistCategory(tripId, "Vehicle", 2);
        vehicle.AddItem("Check tyre pressure & tread", 1, true);
        vehicle.AddItem("Engine oil & coolant levels", 2, true);
        vehicle.AddItem("Drive chain tension & lube", 3, true);
        vehicle.AddItem("Brake pads & brake fluid", 4, true);
        vehicle.AddItem("Emergency toolkit & tubeless puncture kit", 5, true);

        var packing = new ChecklistCategory(tripId, "Packing", 3);
        packing.AddItem("Riding jacket, gloves & boots", 1, true);
        packing.AddItem("Rain gear & waterproof liners", 2, true);
        packing.AddItem("First-aid kit & personal meds", 3, true);
        packing.AddItem("Thermal layers & quick-dry clothes", 4, true);
        packing.AddItem("Phone mount, chargers & power bank", 5, true);

        return [documents, vehicle, packing];
    }
}
