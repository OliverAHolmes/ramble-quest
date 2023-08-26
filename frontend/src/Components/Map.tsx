import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, {useEffect, useRef} from "react";
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhY2tzb25kYXZlIiwiYSI6ImNsbDAwOXU4ejA3dGkzZW82NGRveWpiMTQifQ.4YsujGfX1Nl7NbQgkAi90g';

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return; // wait for map container to be loaded

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [149.11427731324218, -35.27469562974684],
      zoom: 14,
    });

    return () => map.current?.remove();
  }, [mapContainer.current]);

  return (<div className="map-container" ref={mapContainer} />);
}

export default Map;
