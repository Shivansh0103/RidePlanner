export interface PlaceSuggestion {
  /**
   * Display text shown in the autocomplete dropdown.
   */
  text: string;

  /**
   * Google prediction returned by the Places API (New).
   * This stays inside the maps module.
   */
  prediction: google.maps.places.PlacePrediction;
}