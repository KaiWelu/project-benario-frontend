"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Map, Source, Layer, MapRef } from "@vis.gl/react-maplibre";
import type {
  ExpressionSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";
import type { FeatureCollection, Feature } from "geojson";
import Papa from "papaparse";

interface CsvRow {
  Wahlbezirk: string;
  Wahlbezirksart: string;
  Abgeordnetenhauswahlkreis: string;
  "Die Linke": string;
}

const VoteMap = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [csvData, setCsvData] = useState<Record<string, number>>({});

  const mapRef = useRef<MapRef>(null);

  const csvText = useEffect(() => {
    fetch("/data/Stimmbezirke-AGH21.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));

    // this will create a record with voting data for die Linke
    // it uses "Erststimme"
    fetch("/data/Berlin_BT25_W1.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse<CsvRow>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const lookup: Record<string, number> = {};
            results.data.forEach((row) => {
              const combinedId = `0${row.Abgeordnetenhauswahlkreis}${row.Wahlbezirk}`;
              if (!lookup[combinedId]) {
                lookup[combinedId] = Number(row["Die Linke"]); // use any column you want
              }
            });
            setCsvData(lookup);
          },
        });
      })
      .catch(console.error);

    console.log(csvData);
  }, []);

  const getColor = (votes: number) => {
    if (votes > 100) {
      return "#BF092F";
    } else {
      return "#3B9797";
    }
  };

  const handleClick = (e: any) => {
    if (!mapRef.current || !geoData) return;
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ["districts-fill"],
    });

    if (!features.length) return;
    console.log("Clicked UWB:", features[0].properties?.UWB);
    console.log(csvData);
  };

  const districtsFill = {
    id: "districts-fill",
    type: "fill",
    source: "voting-disctricts",
    paint: {
      "fill-color": [
        "match",
        ["get", "combinedId"],
        ...Object.entries(csvData).flatMap(([id, votes]) => [
          id,
          getColor(votes),
        ]),
        "#cccccc", // fallback color
      ] as unknown as ExpressionSpecification,
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
          onClick={handleClick}
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

export default VoteMap;
