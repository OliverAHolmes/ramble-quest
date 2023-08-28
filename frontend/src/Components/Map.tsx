import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef } from "react";
import "./Map.css";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import bbox from "@turf/bbox";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3RhY2tzb25kYXZlIiwiYSI6ImNsbDAwOXU4ejA3dGkzZW82NGRveWpiMTQifQ.4YsujGfX1Nl7NbQgkAi90g";

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const layers = useSelector((state: RootState) => state.layers.layers);
  const slecetedLayerId = useSelector(
    (state: RootState) => state.layers.selectedLayerId
  );

  // Add and Remove layers as needed
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Add new layers based on the updated state
    layers.forEach((layer) => {
      const layerId = `layer-${layer.id}`;

      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
        map.current.removeSource(layerId);
      }

      map.current?.addSource(layerId, {
        type: "geojson",
        data: layer.feature as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
      });

      map.current?.addLayer({
        id: layerId,
        type: "fill",
        source: layerId,
        layout: {},
        paint: {
          "fill-color": slecetedLayerId === layer.id ? "#FF0000" : "#0080ff",
          "fill-opacity": 0.5,
        },
      });

      if (slecetedLayerId === layer.id) {
        const boundingBox = bbox(layer.feature);
        map.current?.fitBounds([
          [boundingBox[0], boundingBox[1]],
          [boundingBox[2], boundingBox[3]],
        ]);
      }
    });
  }, [layers, slecetedLayerId]);

  useEffect(() => {
    if (!mapContainer.current) return; // wait for map container to be loaded

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [149.11427731324218, -35.27469562974684],
      zoom: 14,
    });
    return () => map.current?.remove();
  }, [mapContainer]);

  return <div className="map-container" ref={mapContainer} />;
};

export default Map;
