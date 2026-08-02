import type { PlacePrediction } from "../types";

export class PlacesService {
  private readonly autocompleteService: google.maps.places.AutocompleteService;

  constructor(
    autocompleteService: google.maps.places.AutocompleteService,
  ) {
    this.autocompleteService = autocompleteService;
  }

  async searchPredictions(
    query: string,
  ): Promise<PlacePrediction[]> {
    if (!query.trim()) {
      return [];
    }

    const { predictions } =
      await this.autocompleteService.getPlacePredictions({
        input: query,
      });

    return predictions.map((prediction) => ({
      placeId: prediction.place_id,
      text: prediction.description,
    }));
  }
}