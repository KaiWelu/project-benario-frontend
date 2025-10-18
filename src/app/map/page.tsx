"use client";
import React, { useState, useEffect } from "react";
import { Map } from "@vis.gl/react-maplibre";
import maplibregl from "maplibre-gl";

interface FeatureCollection {
  type: string;
  features: any[];
}

const TestMap = () => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/Stimmbezirke-AGH21.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  return (
    <div className="bg-black h-screen w-screen">
      <Map
        initialViewState={{
          longitude: 13.405,
          latitude: 52.52,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onLoad={(e) => {
          const map = e.target;
          if (!geoData) return;

          // Add GeoJSON source
          if (!map.getSource("districts")) {
            map.addSource("districts", {
              type: "geojson",
              data: geoData as GeoJSON.FeatureCollection,
            });
          }

          // this sets the fill color etc.
          if (!map.getLayer("districts-fill")) {
            map.addLayer({
              id: "districts-fill",
              type: "fill",
              source: "districts",
              paint: {
                "fill-color": "#2d98da",
                "fill-opacity": 0.2,
              },
              filter: ["==", "$type", "Polygon"],
            });
          }

          // this sets the outline color etc.
          if (!map.getLayer("districts-outline")) {
            map.addLayer({
              id: "districts-outline",
              type: "line",
              source: "districts",
              paint: {
                "line-color": "#2d98da",
                "line-width": 0.5,
              },
              filter: ["==", "$type", "Polygon"],
            });
          }

          map.on("click", "districts-fill", (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ["districts-fill"],
            });
            if (!features.length) return;

            const feature = features[0];

            console.log("UWB:", feature.properties?.UWB);
          });
        }}
      />
    </div>
  );
};

export default TestMap;
