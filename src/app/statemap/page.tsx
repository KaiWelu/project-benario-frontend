"use client";
import React, { useState, useEffect, useRef } from "react";
import { Map, Source, Layer, MapRef } from "@vis.gl/react-maplibre";
import type {
  FillLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";
import type { FeatureCollection } from "geojson";

const StateMap = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    fetch("/data/districts/berlin/AGH_Wahlkreise_26.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  /*   const handleClick = (e: any) => {
    if (!mapRef.current || !geoData) return;
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ["districts-fill"],
    });

    if (!features.length) return;
    console.log("Clicked UWB:", features[0].properties?.UWB);
  }; */

  const districtsFill = {
    id: "districts-fill",
    type: "fill",
    source: "voting-disctricts",
    paint: {
      "fill-color": "#4C763B",
      "fill-opacity": 0.2,
    },
    //need to check how the filter works
    filter: ["==", "$type", "Polygon"],
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
      {geoData && (
        <Map
          id="test-map"
          ref={mapRef}
          initialViewState={{ longitude: 13.405, latitude: 52.52, zoom: 12 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          interactiveLayerIds={["districts-fill"]}
          onLoad={() => console.log("Everything is loaded!")}
          /* onClick={handleClick} */
        >
          <Source id="voting-districts" type="geojson" data={geoData}>
            <Layer {...districtsFill} source="voting-districts" />
            <Layer {...districtsOutline} />
          </Source>
        </Map>
      )}
    </div>
  );
};

export default StateMap;
