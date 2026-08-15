export interface ReadinessItem {
  key: string;
  title: string;
  isPassed: boolean;
  isRequired: boolean;
  message: string;
}

export interface TripReadiness {
  tripId: string;
  scorePercentage: number;
  isReady: boolean;
  items: ReadinessItem[];
}
