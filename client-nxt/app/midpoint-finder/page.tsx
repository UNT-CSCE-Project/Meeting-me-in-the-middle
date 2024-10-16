//import Error from "../ui/error";
'use client';
import Head from 'next/head';
import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
  throw new Error('Google Maps API key is not defined');
}
function Map(location: google.maps.LatLng) {
    return (
     <LoadScript
       googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.toString() || ''}
       libraries={['places']}
     >
        <GoogleMap
          mapContainerStyle={{ height: '400px', width: '800px' }}
          zoom={12}
          center={location}
        >
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    );
  }

export default  function midpointFinder() {
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<google.maps.LatLng | null>(null);

  
    const handleSearch = () => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results !== null) {
          const latLng = results[0].geometry.location;
          setLocation(latLng);
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    };
  
    return (
      <div>
        <Head>
          <title>Address Search with Google Maps</title>
        </Head>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
        />
        <button onClick={handleSearch}>Search</button>
        {location && (
          Map(location)
        )}
      </div>
    );
}