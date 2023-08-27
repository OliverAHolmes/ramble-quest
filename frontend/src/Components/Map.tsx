import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, {useEffect, useRef} from "react";
import './Map.css';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import bbox from '@turf/bbox';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhY2tzb25kYXZlIiwiYSI6ImNsbDAwOXU4ejA3dGkzZW82NGRveWpiMTQifQ.4YsujGfX1Nl7NbQgkAi90g';


const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const layers = useSelector((state: RootState) => state.layers.layers);
  const slecetedLayerId = useSelector((state: RootState) => state.layers.selectedLayerId);
  // const [tableData, setTableData] = useState<TableDataItem[]>([]);

  // useEffect(() => {
  //   if (!map.current) return;

  //   if(map.current){
      
  //   }
  //   layers.layers.forEach((layer) => {

  //     console.log(layer);
  //     const layerId = `layer-${layer.id}`;

  //     // Remove layer if it already exists
  //     if (map.current?.getLayer(layerId)) {
  //       map.current?.removeLayer(layerId);
  //       map.current?.removeSource(layerId);

  //     }

  //     // Add new layer
  //     map.current?.addSource(layerId, {
  //       type: 'geojson',
  //       data: layer.feature as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
  //     });
  //     map.current?.addLayer({
  //       id: layerId,
  //       type: 'fill', // You can change this based on what you need
  //       source: layerId,
  //       layout: {},
  //       paint: {
  //         'fill-color': '#0080ff', // You can customize this
  //         'fill-opacity': 0.5,
  //       },
  //     });
  //   });
  // }, [layers]);

  useEffect(() => {
    if (!mapContainer.current) return; // wait for map container to be loaded

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [149.11427731324218, -35.27469562974684],
      zoom: 14,
    });

    map.current.on('load', () => {

      if(layers && layers.length > 0){

        layers.forEach((layer) => {

          const layerId = `layer-${layer.id}`;
    
          // Remove layer if it already exists
          // if (map.current?.getLayer(layerId)) {
          //   map.current?.removeLayer(layerId);
          //   map.current?.removeSource(layerId);
    
          // }
    
          // Add new layer
          map.current?.addSource(layerId, {
            type: 'geojson',
            data: layer.feature as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
          });
          map.current?.addLayer({
            id: layerId,
            type: 'fill', // You can change this based on what you need
            source: layerId,
            layout: {},
            paint: {
              'fill-color': '#0080ff', // You can customize this
              'fill-opacity': 0.5,
            },
          });

          if(slecetedLayerId === layer.id){

            // Calculate the bounding box and fit the map to it
            const boundingBox = bbox(layer.feature);
            map.current?.fitBounds([
              [boundingBox[0], boundingBox[1]],
              [boundingBox[2], boundingBox[3]]
            ]);

          }
        });
      }
      
    });


    return () => map.current?.remove();
  }, [mapContainer, layers, slecetedLayerId]);

  return (<div className="map-container" ref={mapContainer} />);
}

export default Map;
