import { DirectionsRenderer, Marker } from '@react-google-maps/api';
import { LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { friendInfo } from "@/app/lib/friends/definitions";



// Function to generate a marker icon with the first letter of the name
function createCustomMarkerIcon(firstName: string, lastName: string): any {
    const canvas = document.createElement('canvas');
    const size = 40; // Size of the icon
    canvas.width = size;
    canvas.height = size;
  
    const context = canvas.getContext('2d');
    if (context) {
      // Background color
      context.fillStyle = '#007bff';
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      context.fill();
  
      // Text settings
      context.fillStyle = '#ffffff';
      context.font = '21px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(`${firstName.charAt(0)}${lastName.charAt(0)}`, size / 2, size / 2);
    }
  
    return canvas.toDataURL();
}

function MapWithDirections({ directions, userInfo, friendInfo}: {directions: google.maps.DirectionsResult | null, userInfo: friendInfo | null, friendInfo: friendInfo | null}) {
  const startPoint: LatLngLiteral | undefined = directions?.routes[0].legs[0].start_location?.toJSON();
  const endPoint: LatLngLiteral | undefined = directions?.routes[0].legs[0].end_location?.toJSON();


  return (
    <>
      {directions && (
        <>
          {/* Render the DirectionsRenderer with custom polyline options */}
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
              },
              preserveViewport: true,
              suppressMarkers: true,
            }}
          />

          {/* Render start and end markers with custom icons */}
          {startPoint && (
            <Marker
              position={startPoint}
              icon={{
                url: createCustomMarkerIcon(userInfo?.name.split(" ")[0] || "", userInfo?.name.split(" ")[1] || ""),
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          )}
          {endPoint && (
            <Marker
              position={endPoint}
              icon={{
                url: createCustomMarkerIcon(friendInfo?.name.split(" ")[0] || "", friendInfo?.name.split(" ")[1] || ""),
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          )}
        </>
      )}
    </>
  );
}

export default MapWithDirections;
