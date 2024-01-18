import React, { useEffect } from 'react';

const MapWithPositions = () => {
  // Replace 'YOUR_API_KEY' with your actual Google Maps API key
  const apiKey = 'YOUR_API_KEY';

  useEffect(() => {
    const stockholm = {  lat: 55.6050, lng: 13.0038  }; // Stockholm

    

    const positionsTableBody = document.getElementById('positionsTableBody');

    // Generate 100 random positions in Stockholm
    for (let i = 0; i < 100; i++) {
      const randomLatitude = stockholm.lat + (Math.random() - 0.5) * 0.2; // Adjust the range as needed
      const randomLongitude = stockholm.lng + (Math.random() - 0.5) * 0.2; // Adjust the range as needed

      // Display position in the table
      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `<td>${randomLatitude.toFixed(6)}</td><td>${randomLongitude.toFixed(6)}</td>`;
      positionsTableBody.appendChild(tableRow);

      
    }
  }, []);
   // Empty dependency array ensures the effect runs once when the component mounts

  return (
    <div>
      <h3>Positions in Stockholm</h3>
      <table>
        <thead>
          <tr>
            <th>Latitude</th>
            <th>AIzaSyDJRoO4KMgtAMwle1ktjpp704ycLrzsgOQ&libraries=places&callback=initMap</th>
          </tr>
        </thead>
        <tbody id="positionsTableBody"></tbody>
      </table>
    </div>
  );
};

export default MapWithPositions;
