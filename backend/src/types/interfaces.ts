import { City } from './enums';

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
  photos?: Array<{
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  }>;
  address?: string;
  rating?: number;
  user_ratings_total?: number;
  icon?: string;
  vicinity?: string;
}

export interface GoogleNearbySearchResponse {
  status: string;
  results: GooglePlacesResult[];
  next_page_token?: string;
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
  photos?: Array<{
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  }>;
  price?: number;
  additionalInfo?: string;
  comments?: Array<{
    id: number;
    text: string;
    createdAt: Date;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  rating?: number;
  userRatingTotal?: number;
  icon?: string;
}

export interface FindNearbyFieldsOptions {
  city?: City;
  radius?: number;
  type?: string;
  pageToken?: string;
}
