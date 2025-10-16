"use client";
import React, { useState, useEffect } from "react";
import { Map, Source, Layer } from "@vis.gl/react-maplibre";
import type {
  FillLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";
import type { FeatureCollection } from "geojson";

const ReactMap = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch("/data/Stimmbezirke-AGH21.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  const districtsFill = {
    id: "disctricts-fill",
    type: "fill",
    paint: {
      "fill-color": "#4C763B",
      "fill-opacity": 0.2,
    },
    //need to check how the filter works
    /* filter: ["==", "$type", "Polygon"], */
  } as FillLayerSpecification; // this needs to be cast to be type safe for the layer component

  const districtsOutline = {
    id: "districts-outline",
    type: "line",
    paint: {
      "line-color": "#4C763B",
      "line-width": 0.2,
    },
  } as LineLayerSpecification;

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
      >
        {geoData && (
          <Source id="voting-disctricts" type="geojson" data={geoData}>
            <Layer {...districtsFill} />
            <Layer {...districtsOutline} />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default ReactMap;
