export interface GooglePlacesResult {
  place_id: string;
  name: string;
  formatted_address: string;
  international_phone_number?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  website?: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

export interface GoogleNearbySearchResponse {
  status: string;
  results: GooglePlacesResult[];
}

export interface GooglePlaceDetailsResponse {
  status: string;
  result: GooglePlacesResult;
}

export interface FieldDetails {
  placeId: string;
  name: string;
  address: string;
  phoneNumber?: string;
  location?: {
    lat: number;
    lng: number;
  };
  website?: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}
