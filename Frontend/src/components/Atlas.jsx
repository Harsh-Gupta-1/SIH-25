import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Search, 
  Filter, 
  Download, 
  Maximize2,
  Settings,
  Info,
  TreePine,
  Wheat,
  Home,
  Building2,
  Factory,
  Mountain,
  Waves
} from 'lucide-react';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom marker icons
const createCustomIcon = (color, iconClass = 'circle') => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: ${iconClass === 'circle' ? '50%' : '2px'}; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    className: 'custom-marker'
  });
};

// Component to handle Overpass API queries for land use data
function OverpassLayer({ bounds, visibleLayers }) {
  const map = useMap();
  const [geoJsonLayers, setGeoJsonLayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!bounds || Object.keys(visibleLayers).filter(key => visibleLayers[key]).length === 0) {
      // Clear existing layers if no layers are visible
      geoJsonLayers.forEach(layer => map.removeLayer(layer));
      setGeoJsonLayers([]);
      return;
    }

    setIsLoading(true);
    // Clear existing layers
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    setGeoJsonLayers([]);

    const { _southWest, _northEast } = bounds;
    const bbox = `${_southWest.lat},${_southWest.lng},${_northEast.lat},${_northEast.lng}`;

    // Build query based on visible layers
    let queryParts = [];
    
    if (visibleLayers.forest) {
      queryParts.push(`way["landuse"="forest"](${bbox});`);
      queryParts.push(`way["natural"~"^(forest|wood)$"](${bbox});`);
    }
    
    if (visibleLayers.agriculture) {
      queryParts.push(`way["landuse"~"^(farmland|orchard|vineyard)$"](${bbox});`);
    }
    
    if (visibleLayers.water) {
      queryParts.push(`way["natural"="water"](${bbox});`);
      queryParts.push(`way["waterway"~"^(river|stream)$"](${bbox});`);
    }
    
    if (visibleLayers.residential) {
      queryParts.push(`way["landuse"="residential"](${bbox});`);
    }
    
    if (visibleLayers.commercial) {
      queryParts.push(`way["landuse"~"^(commercial|retail|industrial)$"](${bbox});`);
    }

    if (queryParts.length === 0) {
      setIsLoading(false);
      return;
    }

    const overpassQuery = `
      [out:json][timeout:25];
      (
        ${queryParts.join('\n        ')}
      );
      out geom;
    `;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(overpassUrl)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        const newLayers = [];

        data.elements.forEach(element => {
          if (element.type === 'way' && element.geometry && element.geometry.length > 2) {
            const coordinates = element.geometry.map(node => [node.lat, node.lon]);
            
            const landUseType = element.tags.landuse || element.tags.natural || element.tags.waterway || 'unknown';
            const style = getLandUseStyle(landUseType);
            
            if (style) {
              const polygon = L.polygon(coordinates, style).addTo(map);
              
              polygon.bindPopup(`
                <div class="text-sm">
                  <strong>${getLandUseDisplayName(landUseType)}</strong><br/>
                  <small>Type: ${landUseType}</small>
                  ${element.tags.name ? `<br/><small>Name: ${element.tags.name}</small>` : ''}
                </div>
              `);
              
              newLayers.push(polygon);
            }
          }
        });

        setGeoJsonLayers(newLayers);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching Overpass data:', error);
        setIsLoading(false);
      });

    // Cleanup function
    return () => {
      geoJsonLayers.forEach(layer => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [bounds, visibleLayers, map]);

  return null;
}

// Style function for different land use types
const getLandUseStyle = (landUseType) => {
  const styles = {
    forest: { fillColor: '#228B22', color: '#006400', weight: 1, fillOpacity: 0.6 },
    wood: { fillColor: '#228B22', color: '#006400', weight: 1, fillOpacity: 0.6 },
    farmland: { fillColor: '#FFD700', color: '#DAA520', weight: 1, fillOpacity: 0.5 },
    orchard: { fillColor: '#FFA500', color: '#FF8C00', weight: 1, fillOpacity: 0.5 },
    vineyard: { fillColor: '#8B008B', color: '#4B0082', weight: 1, fillOpacity: 0.5 },
    water: { fillColor: '#4169E1', color: '#000080', weight: 1, fillOpacity: 0.7 },
    river: { fillColor: '#4169E1', color: '#000080', weight: 2, fillOpacity: 0.8 },
    stream: { fillColor: '#87CEEB', color: '#4682B4', weight: 1, fillOpacity: 0.7 },
    residential: { fillColor: '#FFB6C1', color: '#DC143C', weight: 1, fillOpacity: 0.4 },
    commercial: { fillColor: '#DDA0DD', color: '#8B008B', weight: 1, fillOpacity: 0.4 },
    retail: { fillColor: '#DDA0DD', color: '#8B008B', weight: 1, fillOpacity: 0.4 },
    industrial: { fillColor: '#A9A9A9', color: '#696969', weight: 1, fillOpacity: 0.5 }
  };
  
  return styles[landUseType] || null;
};

// Display name mapping
const getLandUseDisplayName = (landUseType) => {
  const names = {
    forest: 'Forest',
    wood: 'Woods',
    farmland: 'Farmland',
    orchard: 'Orchard',
    vineyard: 'Vineyard',
    water: 'Water Body',
    river: 'River',
    stream: 'Stream',
    residential: 'Residential Area',
    commercial: 'Commercial Area',
    retail: 'Retail Area',
    industrial: 'Industrial Area'
  };
  
  return names[landUseType] || landUseType;
};

// Component to handle map events and bounds
function MapEventHandler({ onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    zoomend: () => {
      onBoundsChange(map.getBounds());
    }
  });

  useEffect(() => {
    // Set initial bounds
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
}

const Atlas = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedTileLayer, setSelectedTileLayer] = useState('osm');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapBounds, setMapBounds] = useState(null);
  const [visibleLayers, setVisibleLayers] = useState({
    forest: true,
    agriculture: true,
    water: true,
    residential: false,
    commercial: false
  });
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);
  const mapRef = useRef(null);

  // Different tile layer options
  const tileLayers = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: 'OpenStreetMap'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri',
      name: 'Satellite'
    },
    topo: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: 'Topographic'
    },
    terrain: {
      url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
      name: 'Terrain'
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      
      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        
        // Add marker
        const newMarker = {
          id: Date.now(),
          position: [lat, lon],
          name: result.display_name,
          type: 'search'
        };
        setMarkers([...markers, newMarker]);
        
        // Pan to location
        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 15);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const toggleLayer = (layerKey) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const layerConfig = [
    { key: 'forest', name: 'Forest & Woods', icon: TreePine, color: '#228B22' },
    { key: 'agriculture', name: 'Agriculture', icon: Wheat, color: '#FFD700' },
    { key: 'water', name: 'Water Bodies', icon: Waves, color: '#4169E1' },
    { key: 'residential', name: 'Residential', icon: Home, color: '#FFB6C1' },
    { key: 'commercial', name: 'Commercial', icon: Building2, color: '#DDA0DD' }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Atlas Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 z-20">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">Interactive Atlas</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <select 
            value={selectedTileLayer} 
            onChange={(e) => setSelectedTileLayer(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {Object.entries(tileLayers).map(([key, layer]) => (
              <option key={key} value={key}>{layer.name}</option>
            ))}
          </select>
          
          <button
            onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
            className={`p-2 rounded-lg border transition-colors ${
              isLayerPanelOpen 
                ? 'bg-blue-100 border-blue-300 text-blue-600' 
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-5 h-5" />
          </button>
          
          <button className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
            <Download className="w-5 h-5" />
          </button>
          
          <button className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Layer Control Panel */}
        {isLayerPanelOpen && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-30 w-64">
            <h3 className="font-medium text-gray-900 mb-3">Map Layers</h3>
            <div className="space-y-3">
              {layerConfig.map((layer) => (
                <label key={layer.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleLayers[layer.key]}
                    onChange={() => toggleLayer(layer.key)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-sm border border-white"
                      style={{ backgroundColor: layer.color }}
                    ></div>
                    <layer.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{layer.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-30">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Legend</h4>
          <div className="space-y-1">
            {layerConfig.filter(layer => visibleLayers[layer.key]).map((layer) => (
              <div key={layer.key} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: layer.color }}
                ></div>
                <span className="text-xs text-gray-600">{layer.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <MapContainer 
          center={[20.5937, 78.9629]} // Center of India
          zoom={6} 
          className="w-full h-full"
          ref={mapRef}
        >
          <TileLayer
            url={tileLayers[selectedTileLayer].url}
            attribution={tileLayers[selectedTileLayer].attribution}
          />
          
          <MapEventHandler onBoundsChange={setMapBounds} />
          <OverpassLayer bounds={mapBounds} visibleLayers={visibleLayers} />
          
          {/* Custom markers */}
          {markers.map(marker => (
            <Marker 
              key={marker.id} 
              position={marker.position}
              icon={createCustomIcon('#FF6B6B')}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{marker.name}</strong><br/>
                  <small>Type: {marker.type}</small><br/>
                  <small>Coordinates: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Atlas;