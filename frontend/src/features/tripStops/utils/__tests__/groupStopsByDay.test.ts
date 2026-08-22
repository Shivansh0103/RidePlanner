import { describe, expect, it } from "vitest";

import { TripStopCategory } from "../../types/tripStopCategory";
import { groupStopsByDay } from "../groupStopsByDay";

describe("groupStopsByDay", () => {
  it("returns empty array when given no stops", () => {
    expect(groupStopsByDay([])).toEqual([]);
  });

  it("groups stops on the same arrival date into a single day", () => {
    const stops = [
      {
        id: "1",
        tripId: "t1",
        name: "Stop 1",
        placeId: null,
        category: TripStopCategory.Destination,
        arrivalDate: "2026-08-20T08:00:00Z",
        departureDate: "2026-08-20T09:00:00Z",
        displayOrder: 1,
        formattedAddress: "Origin",
        latitude: 12.97,
        longitude: 77.59,
        notes: null,
      },
      {
        id: "2",
        tripId: "t1",
        name: "Stop 2",
        placeId: null,
        category: TripStopCategory.Fuel,
        arrivalDate: "2026-08-20T12:00:00Z",
        departureDate: "2026-08-20T12:30:00Z",
        displayOrder: 2,
        formattedAddress: "Fuel Station",
        latitude: 13.1,
        longitude: 77.6,
        notes: null,
      },
      {
        id: "3",
        tripId: "t1",
        name: "Stop 3",
        placeId: null,
        category: TripStopCategory.Hotel,
        arrivalDate: "2026-08-21T18:00:00Z",
        departureDate: "2026-08-22T08:00:00Z",
        displayOrder: 3,
        formattedAddress: "Hotel Resort",
        latitude: 14.5,
        longitude: 78.2,
        notes: null,
      },
    ];

    const timeline = groupStopsByDay(stops);

    expect(timeline).toHaveLength(2);
    expect(timeline[0].dayNumber).toBe(1);
    expect(timeline[0].stops).toHaveLength(2);
    expect(timeline[1].dayNumber).toBe(2);
    expect(timeline[1].stops).toHaveLength(1);
  });
});
