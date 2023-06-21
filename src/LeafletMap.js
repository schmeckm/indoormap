import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from '../src/icons/internet_router.png';
import markerShadow from '../src/icons/marker-shadow.png';
import beaconIcon from '../src/icons/beacon.png';
import buildingGeoJSON from '../src/building.geojson';

const defaultCenterCoordinate = [47.53599, 7.73884]; // Vordefinierte Koordinaten

const gateways = [
  { id: 1, position: [47.53676, 7.73816], name: 'Gateway 1' },
  { id: 2, position: [47.53581, 7.73895], name: 'Gateway 2' },
  { id: 3, position: [47.53550, 7.73810], name: 'Gateway 3' },
];

const beacons = [
  { id: 1, position: [47.53750, 7.73920], name: 'Beacon 1' },
  { id: 2, position: [47.53610, 7.73990], name: 'Beacon 2' },
  { id: 3, position: [47.53650, 7.73910], name: 'Beacon 3' },
];



function LeafletMap() {
  const [selectedGateways, setSelectedGateways] = useState(new Set());
  const [selectedBeacons, setSelectedBeacons] = useState(new Set());
  const [showPosition, setShowPosition] = useState(true);
  const [showGSONData, setShowGSONData] = useState(false);
  const [openPopups, setOpenPopups] = useState(new Set());
  const [geoJSONData, setGeoJSONData] = useState(null);
  const [baseLayer, setBaseLayer] = useState('streetmap');
  const [uploadedGeoJSON, setUploadedGeoJSON] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const loadBuildingGeoJSON = async () => {
      try {
        const response = await fetch(buildingGeoJSON);
        const data = await response.json();
        setGeoJSONData(data);
      } catch (error) {
        console.error('Fehler beim Laden der GeoJSON-Datei:', error);
      }
    };

    loadBuildingGeoJSON();
  }, []);

  useEffect(() => {
    const defaultMarkerIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [35, 50],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const beaconMarkerIcon = L.icon({
      iconUrl: beaconIcon,
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35],
    });

    L.Marker.prototype.options.icon = defaultMarkerIcon;
    L.Marker.prototype.options.beaconIcon = beaconMarkerIcon;
  }, []);

  const handleSelectAllGateways = () => {
    if (selectedGateways.size === gateways.length) {
      setSelectedGateways(new Set());
    } else {
      setSelectedGateways(new Set(gateways.map((gateway) => gateway.id)));
    }
  };

  const handleSelectAllBeacons = () => {
    if (selectedBeacons.size === beacons.length) {
      setSelectedBeacons(new Set());
    } else {
      setSelectedBeacons(new Set(beacons.map((beacon) => beacon.id)));
    }
  };

  const handleShowPositionChange = () => {
    setShowPosition(!showPosition);
    setOpenPopups(new Set());
  };

  const handleShowGSONDataChange = () => {
    setShowGSONData(!showGSONData);
  };

  const handleCenterMap = () => {
    mapRef.current.setView(defaultCenterCoordinate, 19);
  };

  const handleBaseLayerChange = (e) => {
    setBaseLayer(e.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const uploadedData = JSON.parse(e.target.result);
        setUploadedGeoJSON(uploadedData);
      } catch (error) {
        console.error('Fehler beim Lesen der hochgeladenen Datei:', error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <div>
        <input type="checkbox" checked={selectedGateways.size === gateways.length} onChange={handleSelectAllGateways} />
        <label>Select All Gateways</label>
      </div>
      <select
        multiple
        value={Array.from(selectedGateways)}
        onChange={(event) =>
          setSelectedGateways(new Set(Array.from(event.target.selectedOptions, (option) => Number(option.value))))
        }
      >
        {gateways.map((gateway) => (
          <option key={gateway.id} value={gateway.id}>
            {gateway.name}
          </option>
        ))}
      </select>
      <div>
        <input type="checkbox" checked={selectedBeacons.size === beacons.length} onChange={handleSelectAllBeacons} />
        <label>Select All Beacons</label>
      </div>
      <select
        multiple
        value={Array.from(selectedBeacons)}
        onChange={(event) =>
          setSelectedBeacons(new Set(Array.from(event.target.selectedOptions, (option) => Number(option.value))))
        }
      >
        {beacons.map((beacon) => (
          <option key={beacon.id} value={beacon.id}>
            {beacon.name}
          </option>
        ))}
      </select>
      <div>
        <input type="checkbox" checked={showPosition} onChange={handleShowPositionChange} />
        <label>Enable Position Data on Mouse Click</label>
      </div>
      <div>
        <input type="checkbox" checked={showGSONData} onChange={handleShowGSONDataChange} />
        <label>Show GSON data</label>
      </div>
      <div>
        <button onClick={handleCenterMap}>Center Map</button>
      </div>
      <div>
        <input
          type="radio"
          id="streetmap"
          name="baselayer"
          value="streetmap"
          checked={baseLayer === 'streetmap'}
          onChange={handleBaseLayerChange}
        />
        <label htmlFor="streetmap">Street Map</label>
        <br />
        <input
          type="radio"
          id="satellitemap"
          name="baselayer"
          value="satellitemap"
          checked={baseLayer === 'satellitemap'}
          onChange={handleBaseLayerChange}
        />
        <label htmlFor="satellitemap">Satellite Map</label>
      </div>
      <div>
        <input type="file" accept=".geojson" onChange={handleFileUpload} />
      </div>
      <MapContainer center={defaultCenterCoordinate} zoom={19} ref={mapRef} style={{ height: '600px', width: '100%' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Street Map" checked={baseLayer === 'streetmap'}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite Map" checked={baseLayer === 'satellitemap'}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>
        {selectedGateways.size > 0 &&
          gateways.map((gateway) => {
            if (selectedGateways.has(gateway.id)) {
              return (
                <Marker key={gateway.id} position={gateway.position}>
                  <Popup>{gateway.name}</Popup>
                </Marker>
              );
            }
            return null;
          })}
        {selectedBeacons.size > 0 &&
          beacons.map((beacon) => {
            if (selectedBeacons.has(beacon.id)) {
              return (
                <Marker key={beacon.id} position={beacon.position} icon={L.Marker.prototype.options.beaconIcon}>
                  <Popup>{beacon.name}</Popup>
                </Marker>
              );
            }
            return null;
          })}
        {showPosition && (
          <MapContainer
            center={defaultCenterCoordinate}
            zoom={19}
            style={{ height: '600px', width: '100%', display: 'none' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON data={geoJSONData} style={{ color: 'blue', weight: 2, fillColor: 'blue', fillOpacity: 0.1 }} />
          </MapContainer>
        )}
        {showGSONData && geoJSONData && (
          <GeoJSON data={geoJSONData} style={{ color: 'blue', weight: 2, fillColor: 'blue', fillOpacity: 0.1 }} />
        )}
        {uploadedGeoJSON && (
          <GeoJSON data={uploadedGeoJSON} style={{ color: 'red', weight: 2, fillColor: 'red', fillOpacity: 0.1 }} />
        )}
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
