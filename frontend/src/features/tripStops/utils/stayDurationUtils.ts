export interface StayDurationInfo {
  nightsCount: number;
  isOvernight: boolean;
  label: string;
}

export function getStayDurationInfo(
  arrivalDateStr: string,
  departureDateStr: string
): StayDurationInfo {
  if (!arrivalDateStr || !departureDateStr) {
    return { nightsCount: 0, isOvernight: false, label: "" };
  }

  const arrival = new Date(arrivalDateStr);
  const departure = new Date(departureDateStr);

  const arrivalUtc = Date.UTC(
    arrival.getFullYear(),
    arrival.getMonth(),
    arrival.getDate()
  );
  const departureUtc = Date.UTC(
    departure.getFullYear(),
    departure.getMonth(),
    departure.getDate()
  );

  const diffTime = departureUtc - arrivalUtc;
  const nightsCount = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const isOvernight = nightsCount > 0;

  let label = "";
  if (nightsCount === 1) {
    label = "1 Night Stay";
  } else if (nightsCount > 1) {
    label = `${nightsCount} Nights Stay`;
  } else {
    label = "Same Day Stop";
  }

  return { nightsCount, isOvernight, label };
}
