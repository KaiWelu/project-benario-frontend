"use client";
import React, { useState, useEffect, useRef } from "react";
import { Map, Source, Layer, MapRef, Popup } from "@vis.gl/react-maplibre";
import type {
  FillLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";
import type { FeatureCollection } from "geojson";

const StateMap = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    /* fetch("/data/districts/berlin/AGH_Wahlkreise_26.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err)); */
    fetch("/data/districts/berlin/AGH_Wahlkreise_26.geojson")
      .then((res) => res.json())
      .then((data: FeatureCollection) => {
        // adds unique ids to the features based on AWK or as fallback the index
        const featuresWithId = data.features.map((feature, index) => ({
          ...feature,
          id: feature.properties?.AWK || index.toString(), // fallback to index
        }));

        setGeoData({
          ...data,
          features: featuresWithId,
        });
      })
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  const handleClick = (e: any) => {
    if (!mapRef.current || !geoData) return;
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ["districts-fill"],
    });

    if (!features.length) {
      return;
    }

    /* const feature = features[0];
    const { BEZ, AWK, AWK2 } = feature.properties ?? {}; */

    /* console.log(features[0]); */
    console.log("Bezirk:", features[0].properties?.BEZ);
    console.log("AWK:", features[0].properties?.AWK);
    console.log("AWK2:", features[0].properties?.AWK2);
    console.log(features[0].id);
    console.log("\n");
  };

  const handleMouseMove = (e: any) => {
    if (!mapRef.current) return;

    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ["districts-fill"],
    });

    if (features.length > 0) {
      setHoveredId(features[0].id); // feature ID is a string from AWK
    } else {
      setHoveredId(null);
    }
  };

  const handleMouseLeave = () => setHoveredId(null);

  const districtsFill = {
    id: "districts-fill",
    type: "fill",
    source: "voting-disctricts",
    paint: {
      "fill-color": [
        "case",
        ["==", ["id"], hoveredId], // highlight hovered feature
        "#FF0000", // hover color
        "#4C763B", // default color
      ],
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
    <div className="bg-black h-screen w-screen relative">
      {geoData && (
        <Map
          id="test-map"
          ref={mapRef}
          initialViewState={{ longitude: 13.405, latitude: 52.52, zoom: 12 }}
          style={{
            width: "100%",
            height: "100%",
          }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          interactiveLayerIds={["districts-fill"]}
          onLoad={() => console.log("Everything is loaded!")}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Source id="voting-districts" type="geojson" data={geoData}>
            <Layer {...districtsFill} source="voting-districts" />
            <Layer {...districtsOutline} />
          </Source>
          {hoveredId && (
            <div className="bg-amber-200 absolute top-2 left-2 p-2">
              {hoveredId}
            </div>
          )}
        </Map>
      )}
    </div>
  );
};

export default StateMap;
