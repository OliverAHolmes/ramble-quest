import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import bbox from "@turf/bbox";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3RhY2tzb25kYXZlIiwiYSI6ImNsbDAwOXU4ejA3dGkzZW82NGRveWpiMTQifQ.4YsujGfX1Nl7NbQgkAi90g";

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapLayers, setMapLayers] = useState<Set<string>>(new Set());
  const layers = useSelector((state: RootState) => state.layers.layers);
  const slecetedLayerId = useSelector(
    (state: RootState) => state.layers.selectedLayerId,
  );

  // Add and Remove layers as needed
  useEffect(() => {
    if (!isMapLoaded) return;

    // Remove layers that are no longer in 'layers'
    mapLayers.forEach((layerId) => {
      if (!layers.find((layer) => `layer-${layer.id}` === layerId)) {
        ['fill', 'circle', 'line'].forEach((type) => {
          const id = `${type}-${layerId}`;
          if (map.current?.getLayer(id)) {
            map.current.removeLayer(id);
          }
        });
        if (map.current?.getSource(layerId)) {
          map.current.removeSource(layerId);
        }
        mapLayers.delete(layerId);
      }
    });

    // Update the set of map layers
    setMapLayers(new Set(layers.map((layer) => `layer-${layer.id}`)));

    // Add new layers based on the updated state
    layers.forEach((layer) => {
      const layerId = `layer-${layer.id}`;

      // Remove existing layers
      if (map.current?.getLayer(`fill-${layerId}`)) {
        map.current.removeLayer(`fill-${layerId}`);
      }
      if (map.current?.getLayer(`circle-${layerId}`)) {
        map.current.removeLayer(`circle-${layerId}`);
      }
      if (map.current?.getLayer(`line-${layerId}`)) {
        map.current.removeLayer(`line-${layerId}`);
      }

      if (map.current?.getSource(layerId)) {
        map.current.removeSource(layerId);
      }

      map.current?.addSource(layerId, {
        type: "geojson",
        data: layer.feature as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
      });

      map.current?.addLayer({
        id: `fill-${layerId}`,
        type: "fill",
        source: layerId,
        layout: {},
        paint: {
          "fill-color": slecetedLayerId === layer.id ? "#FF0000" : "#0080ff",
          "fill-opacity": 0.5,
        },
        filter: ["==", "$type", "Polygon"],
      });

      map.current?.addLayer({
        id: `circle-${layerId}`,
        type: "circle",
        source: layerId,
        layout: {},
        paint: {
          "circle-radius": 10,
          "circle-color": slecetedLayerId === layer.id ? "#FF0000" : "#0080ff",
          "circle-opacity": 0.5,
        },
        filter: ["==", "$type", "Point"],
      });

      map.current?.addLayer({
        id: `line-${layerId}`,
        type: "line",
        source: layerId,
        layout: {},
        paint: {
          "line-color": slecetedLayerId === layer.id ? "#FF0000" : "#0080ff",
          "line-width": 2,
        },
        filter: ["==", "$type", "LineString"],
      });

      if (slecetedLayerId === layer.id) {
        const boundingBox = bbox(layer.feature);
        map.current?.fitBounds(
          [
            [boundingBox[0], boundingBox[1]],
            [boundingBox[2], boundingBox[3]],
          ],
          {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
          },
        );
      }
    });
  }, [isMapLoaded, layers, slecetedLayerId]);

  useEffect(() => {
    if (!mapContainer.current) return; // wait for map container to be loaded

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [149.11427731324218, -35.27469562974684],
      zoom: 14,
    });

    map.current.on("load", () => {
      setIsMapLoaded(true);
    });

    return () => map.current?.remove();
  }, [mapContainer]);

  return <div className="map-container" ref={mapContainer} />;
};

export default Map;
