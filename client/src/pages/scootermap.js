import React, { useEffect, useState } from 'react';
import { FaChargingStation } from 'react-icons/fa';
import { renderToString } from 'react-dom/server';
import { MdOutlineElectricScooter } from 'react-icons/md';

const ScooterMap = () => {
  const [showScooters, setShowScooters] = useState(true);
  const [scooters, setScooters] = useState([]);
  const [users, setUsers] = useState([]);
  const [NewCenter, setNewCenter] = useState({ lat: 59.3293, lng: 18.0686 });
  const [NewZome, setNewZome] = useState(10);

  const fetchData = async () => {
    try {
      const scooterResponse = await fetch('http://localhost:3050/elcyckel/v1/scooters');
      const userResponse = await fetch('http://localhost:3050/elcyckel/v1/users');

      if (!scooterResponse.ok || !userResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const scooterData = await scooterResponse.json();
      const userData = await userResponse.json();

      console.log('Scooter data:', scooterData);
      console.log('User data:', userData);

      setScooters(scooterData);
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      // Hantera felet, t.ex. visa ett felmeddelande för användaren
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      

      
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: NewCenter,
        zoom: NewZome,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
      });

      

      // Fetch data from your database API
      const response = await fetch("http://localhost:3050/elcyckel/v1/scooters");
      const data = await response.json();

      // Extract positions from the fetched data and update the state
      const positions = data.map(item => ({
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        battery_level: parseFloat(item.battery_level),
        scooter_status: (item.scooter_status),
        scooter_id: (item.scooter_id),
        serial_number: (item.serial_number),
      }));

      // Create markers for each position with the custom bike icon
      positions.forEach((position, index) => {
        const scooterColor =
          position.battery_level <= 30 || position.scooter_status === 'Not Good' ? 'red' : 'black';
        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: `Bike ${index + 1}`,
          icon: {
            url: `data:image/svg+xml,${encodeURIComponent(renderToString(<MdOutlineElectricScooter color={scooterColor} />))}`,
            scaledSize: new window.google.maps.Size(20, 20),
          },
        });
        const infoWindow = new window.google.maps.InfoWindow();

        marker.addListener('click', () => {
          infoWindow.setContent(`
            <div style="text-align: left;">
              Scooter ID: ${position.scooter_id}<br>
              Scooter serial number: ${position.serial_number}<br>
              Battery Level: ${position.battery_level}<br>
              Status: ${position.scooter_status}
            </div>
          `);
          infoWindow.open(map, marker);
        });
      });

      // Fetch data from your database API
      const response1 = await fetch("http://localhost:3050/elcyckel/v1/stations");
      const data1 = await response1.json();

      // Extract positions from the fetched data and update the state
      const stations = data1.map(item => ({
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        station_name: item.station_name,
      }));

      // Create markers for each position with the custom bike icon
      stations.forEach((station, index) => {
        const marker1 = new window.google.maps.Marker({
          position: station,
          map: map,
          title: `Staion ${index + 1}`,
          icon: {
            url: `data:image/svg+xml,${encodeURIComponent(renderToString(<FaChargingStation color="Blue" />))}`,
            scaledSize: new window.google.maps.Size(30, 30),
          },
        });
        new window.google.maps.Circle({
          strokeColor: '#0000FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0000FF',
          fillOpacity: 0.35,
          map: map,
          center: station,
          radius: 1000,
        });
        const infoWindow1 = new window.google.maps.InfoWindow();

        marker1.addListener('click', () => {
          infoWindow1.setContent(`
            <div style="text-align: left;">
              Station name: ${station.station_name}<br>
            </div>
          `);
          infoWindow1.open(map, marker1);
        });
      });
      
      // Define functions to create rectangles
      function createredzone(bounds) {
        return new window.google.maps.Rectangle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          bounds: bounds,
        });
      }
      function creategreenzone(bounds) {
        return new window.google.maps.Rectangle({
          strokeColor: '#00FF00',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00FF00',
          fillOpacity: 0.35,
          map: map,
          bounds: bounds,
        });
      }

      const bounds_s1 = {
        north: 59.32593,
        south: 59.31093,
        east: 18.1386,
        west: 18.12,
      };

      const bounds_s2 = {
        north: 59.32593,
        south: 59.33593,
        east: 18.0486,
        west: 18.0286,
      };

      const bounds_s3 = {
        north: 59.33593,
        south: 59.3253,
        east: 18.099,
        west: 18.05386,
      };

      const bounds_s4 = {
        north: 59.2993,
        south: 59.2793,
        east: 18.0002,
        west: 17.9586,
      };
      const bounds_g1 = {
        north: 57.7689,
        south: 57.7549,
        east: 11.9346,
        west: 11.9146,
      };
      const bounds_g2 = {
        north: 57.7689,
        south: 57.7389,
        east: 11.9846,
        west: 11.9546,
      };

      const bounds_h1 = {
        north: 56.13447,
        south: 56.079,
        east: 12.7550456,
        west: 12.7020456,
      };
      const bounds_h2 = {
        north: 56.03447,
        south: 55.9999,
        east: 12.7550456,
        west: 12.7020456,
      };

      const bounds_m1 = {
        north: 55.604107,
        south: 55.614107,
        east: 13.086877,
        west: 13.0,
      };
      const bounds_m2 = {
        north: 55.594107,
        south: 55.554107,
        east: 13.086877,
        west: 13.0,
      };

      // Use the functions to create rectangles with different bounds
      createredzone(bounds_s1);
      createredzone(bounds_s2);
      creategreenzone(bounds_s3);
      creategreenzone(bounds_s4);
      createredzone(bounds_g1);
      creategreenzone(bounds_g2);
      createredzone(bounds_h1);
      creategreenzone(bounds_h2);
      createredzone(bounds_m1);
      creategreenzone(bounds_m2);
      
      fetchData();
      const dataFetchInterval = setInterval(fetchData, 1000);
      return () => clearInterval(dataFetchInterval);
    }

    if (!window.google || !window.google.maps) {
      // Load Google Maps API
      if (!document.getElementById('google-maps-script')) {
        const googleMapScript = document.createElement('script');
        googleMapScript.id = 'google-maps-script';
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDJRoO4KMgtAMwle1ktjpp704ycLrzsgOQ&libraries=places&callback=initMap`;
        googleMapScript.defer = true;
        window.initMap = initializeMap;
        window.document.body.appendChild(googleMapScript);
      }
    } else {
      initializeMap();
    }
    console.log(NewCenter);
  }, [NewCenter , NewZome]);

  const toggleList = () => {
    setShowScooters(!showScooters);
  };

  const handleMoveToService = async (scooterId) => {
    try {
      // Hämta positionen för den aktuella skotern
      const scooterResponse = await fetch(`http://localhost:3050/elcyckel/v1/scooters/${scooterId}`);
      const scooterData = await scooterResponse.json();
  
      const scooterPosition = {
        lat: parseFloat(scooterData.latitude),
        lng: parseFloat(scooterData.longitude),
      };
      const scooterinfo = {
        serial_number: scooterData.serial_number, // Provide a default value or handle the case appropriately
        city_id: scooterData.city_id,
        scooter_status: scooterData.scooter_status,
        station_id: scooterData.station_id,
      }
      console.log(scooterPosition.lat, scooterinfo.serial_number);
      // Hämta positionen för alla laddningsstationer
      const stationsResponse = await fetch('http://localhost:3050/elcyckel/v1/stations');
      const stationsData = await stationsResponse.json();
  
      // Beräkna avståndet till varje laddningsstation
      const distances = stationsData.map((station) => {
        const stationPosition = {
          lat: parseFloat(station.latitude),
          lng: parseFloat(station.longitude),
        };
        
  
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(scooterPosition.lat, scooterPosition.lng),
          new window.google.maps.LatLng(stationPosition.lat, stationPosition.lng)
        );
  
        return { stationId: station.station_id, distance };
      });
  
      // Sortera efter avstånd i stigande ordning
      distances.sort((a, b) => a.distance - b.distance);
  
      // Välj den närmaste laddningsstationen
      const nearestStationId = distances[0].stationId;
  
      // Hämta den närmaste laddningsstationens position
      const nearestStation = stationsData.find((station) => station.station_id === nearestStationId);
      const nearestStationPosition = {
        lat: parseFloat(nearestStation.latitude),
        lng: parseFloat(nearestStation.longitude),
      };
     
      const randomOffset = 0.001 + Math.random() * (0.004 - 0.001);

      // Uppdatera skoterns position till den närmaste laddningsstationen
      const newPosition = {
        latitude: nearestStationPosition.lat + randomOffset,
        longitude: nearestStationPosition.lng + randomOffset,
        battery_level: 100,
        scooter_status: "Good",
      };
      // Skicka en PUT-förfrågan för att uppdatera skoterns position
      const updateResponse = await fetch(`http://localhost:3050/elcyckel/v1/scooters/${scooterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPosition),
      });
      const response1 = await fetch(`http://localhost:3050/elcyckel/v1/scooters/${scooterId}`);

      const scooterdata = await response1.json();
      if (updateResponse.ok) {
        console.log(`Successfully updated position for scooter with ID ${scooterId} to nearest station`);
        // Perform any additional client-side actions if needed
        fetchData();
        setNewCenter({
          lat: parseFloat(scooterdata.latitude),
          lng: parseFloat(scooterdata.longitude),
        });
      } else {
        const errorData = await updateResponse.json();
        console.error(`Failed to update position for scooter with ID ${scooterId}:`, errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }};

  const handleRemoveScooter = async (scooterId) => {
    try {
      const response1 = await fetch(`http://localhost:3050/elcyckel/v1/scooters/${scooterId}`);

      const scooterdata = await response1.json();
      const response = await fetch(`http://localhost:3050/elcyckel/v1/scooters/${scooterId}`, {
        
      method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });
      
      
      if (response.ok) {
        
        console.log(`Successfully removed scooter with ID ${scooterId}`);
        fetchData();
        setNewCenter({
          lat: parseFloat(scooterdata.latitude),
          lng: parseFloat(scooterdata.longitude),
        });
      } else {
        const errorData = await response.json();
        console.error(`Failed to remove scooter with ID ${scooterId}:`, errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const findthescooter = async (scooterId) => {
    try {
      // Fetch scooter data
      const scooterResponse = await fetch(`http://localhost:3050/elcyckel/v1/scooters/${scooterId}`);
      const scooterData = await scooterResponse.json();
  
      // Set the new map center directly
      setNewCenter({
        lat: parseFloat(scooterData.latitude),
        lng: parseFloat(scooterData.longitude),
      });
      setNewZome(40)
      
    } catch (error) {
      console.error('Error:', error);
    }
    
  };
  const handleRemoveUser = async (userid) => {
    try {

      const response = await fetch(`http://localhost:3050/elcyckel/v1/users/${userid}`, {
        
      method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });
      
      
      if (response.ok) {
        
        console.log(`Successfully removed scooter with ID ${userid}`);
        fetchData();
        
      } else {
        const errorData = await response.json();
        console.error(`Failed to remove scooter with ID ${userid}:`, errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="container">
      <div className="left-panel">
        <label htmlFor="location">Välj Stad </label>
        <select
          id="location"
          onChange={(e) => {
            const locations = {
              'Stockholm Central': { lat: 59.3293, lng: 18.0686 },
              'Helsingborg': { lat: 56.0465, lng: 12.6944 },
              'Malmö': { lat: 55.6050, lng: 13.0038 },
              'Göteborg': { lat: 57.7089, lng: 11.9746 }
            };
            setNewZome(10);
            setNewCenter(locations[e.target.value]);
          }}
        >
          <option value="Stockholm Central">Stockholm Central</option>
          <option value="Helsingborg">Helsingborg</option>
          <option value="Malmö">Malmö</option>
          <option value="Göteborg">Göteborg</option>
        </select>
        <br></br>
        <div id="map"></div>
      </div>
      <div className="right-panel">
        <button onClick={toggleList}>
          Visa {showScooters ? 'Användare' : 'Scootrar'}
        </button>
        <h2>{showScooters ? 'Scootrar' : 'Användare'}</h2>
        <div className="scrollable-content">
          <ul>
            {showScooters
              ? scooters.map((scooter) => (
                  <div key={scooter.scooter_id}>
                    <li>
                      <strong>Scooter ID:</strong> {scooter.scooter_id}   ,
                      <strong>Serial Number:</strong> {scooter.serial_number}<br />
                      <strong>Battery Level:</strong> {scooter.battery_level}%   ,
                      <strong>Scooter Status:</strong> {scooter.scooter_status}<br />
                      <button onClick={() => handleMoveToService(scooter.scooter_id)}>
                      Move to Service
                      </button>   
                      <button onClick={() => handleRemoveScooter(scooter.scooter_id)}>
                        Remove Scooter
                      </button>
                      <button onClick={() => findthescooter(scooter.scooter_id)}>
                        Find Scooter
                      </button>
                    </li>
                    
                  </div>
                ))
              : users.map((user) => (
                <div key={user.user_id}>
                <li>
                  <strong>User ID:</strong> {user.user_id}   ,
                  <strong>Username:</strong> {user.username}<br />
                  <strong>Current Balance:</strong> {user.current_balance}<br />
                  <button onClick={() => handleRemoveUser(user.user_id)}>
                    Remove User
                  </button>
                </li>
                
              </div>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScooterMap;
