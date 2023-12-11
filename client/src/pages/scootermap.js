import React, { useEffect } from 'react';

function ScooterMap(props) {
  useEffect(() => {
    // Check if the Google Maps API script is already loaded
    if (!window.google) {
      // Replace 'YOUR_API_KEY' with your actual Google Maps API key
      const apiKey = 'AIzaSyDJRoO4KMgtAMwle1ktjpp704ycLrzsgOQ';

      // Create a script element to dynamically load the Google Maps JavaScript API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;

      // Append the script to the document head
      document.head.appendChild(script);

      // Define the global callback function to initialize the map
      window.initMap = () => {
        initializeMap(); // Call a separate function for map initialization
      };

      // Clean up function to remove the script when the component is unmounted
      return () => {
        document.head.removeChild(script);
        delete window.initMap; // Remove the global callback function
      };
    }
  }, []); // An empty dependency array ensures that this effect runs once when the component mounts

  // Separate function for map initialization
  const initializeMap = () => {
    // Create a map
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 }, // Set the initial center
      zoom: 10, // Set the initial zoom level
    });
    console.log(map); // Log the map object to the console
    console.log('Map initialized!'); // Log a message for debugging

    // You can add markers or perform other map-related actions here
  };

  return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
}

export default ScooterMap;
