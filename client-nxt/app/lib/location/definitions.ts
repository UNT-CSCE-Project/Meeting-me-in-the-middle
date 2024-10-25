export interface Position {
    coords: {
      latitude: number;
      longitude: number;
    };
  }
export interface AddressComponent {
    long_name: string;
    types: string[];
  }
  
export interface GeocodeResult {
    address_components: AddressComponent[];
  }
  
export interface GeocodeResponse {
    results: GeocodeResult[];
    status: string;
  }
  