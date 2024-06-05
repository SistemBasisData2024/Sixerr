import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';


function Test() {
  const containerStyle = {
    width: '600px',
    height: '600px'
  };

  const [, setCookies] = useCookies(["logged"]);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({ /* load google maps */
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
  })

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(null);
  const [marker, setMarker] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder();
      const address = "FTUI, Depok";

      geocoder.geocode({ address }, (results, status) => { /* change address to coords */
        if (status === 'OK') {
          const { lat, lng } = results[0].geometry.location;
          const newCenter = { lat: lat(), lng: lng() };
          setCenter(newCenter);

          if (map) {
            map.setCenter(center);
            map.setZoom(15);
          }
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      });
    }
  }, [isLoaded, map]);

  useEffect(() => {
    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: center }, (results, status) => { /* change coords to address */
        if (status === 'OK') {
          if (results[0]) {
            console.log(results[0].formatted_address);
          }
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      });

      if (marker) marker.setMap(null); /* delete old marker */
      const newMarker = new window.google.maps.Marker({ /* new marker when address changes */
        position: center,
        map: map,
      });
      setMarker(newMarker);
    }
  }, [center]);


  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
        <Marker position={center} />
      </GoogleMap>
      <button onClick={() => {
        setCookies("logged", false);
        navigate("/");
      }}>logout</button>
    </>
  ) : <>Loading...</>
}

export default Test;