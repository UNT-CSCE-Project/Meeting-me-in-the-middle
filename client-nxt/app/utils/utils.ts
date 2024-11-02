import { GeocodeResponse } from "../lib/location/definitions";
export const getAddress = async (latitude: number, longitude: number):  Promise<string> => {
    try {
      if(!latitude || !longitude) {
        return "";
      }
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data: GeocodeResponse = await response.json();
      if (data.status === 'OK' && data.results[0]) {
        return data.results[0].formatted_address;
      } 
      return "";
    } catch (error) {
      return "";
    }
  };