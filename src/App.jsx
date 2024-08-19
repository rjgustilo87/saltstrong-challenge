import { useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 27.9944024,
  lng: -82.5930317
};

function App() {
  const [latDD, setLatDD] = useState('');
  const [lngDD, setLngDD] = useState('');
  const [latDMS, setLatDMS] = useState({});
  const [lngDMS, setLngDMS] = useState({});
  const [mapCenter, setMapCenter] = useState(center);
  const [notes, setNotes] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCx7kBbwkl3Zlm76YmE74OpT-yzxTrQYgU'
  });

  const convertCoords = async () => {
    try {
      const response = await axios.post('http://localhost:3001/convert', { lat: parseFloat(latDD), lng: parseFloat(lngDD) });
      setLatDMS(response.data.lat);
      setLngDMS(response.data.lng);
      setMapCenter({ lat: parseFloat(latDD), lng: parseFloat(lngDD) });
    } catch (error) {
      console.error(error);
    }
  };

  const saveCoords = async () => {
    try {
      await axios.post('http://localhost:3001/save', { lat: parseFloat(latDD), lng: parseFloat(lngDD), notes });
      alert('Coordinates saved successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-gray-700">Latitude (DD):</label>
        <input
          type="number"
          value={latDD}
          onChange={(e) => setLatDD(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Longitude (DD):</label>
        <input
          type="number"
          value={lngDD}
          onChange={(e) => setLngDD(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <br />
      <div className="mb-4">
        <button
          onClick={convertCoords}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Convert Coords
        </button>
        <button
          onClick={saveCoords}
          className="bg-green-500 text-white py-2 px-4 rounded ml-4"
        >
          Save Coords
        </button>
      </div>  
      <div className="mt-4">
        <h2>Converted Coordinates (DMS):</h2>
        <p>Latitude: {latDMS.degrees}° {latDMS.minutes} {latDMS.seconds}</p>
        <p>Longitude: {lngDMS.degrees}° {lngDMS.minutes} {lngDMS.seconds}</p>
      </div>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={10}
        >
          <Marker position={mapCenter} />
        </GoogleMap>
      )}
    </div>
  );
}

export default App;
