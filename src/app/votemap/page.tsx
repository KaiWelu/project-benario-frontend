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
            const rows = results.data as any[];
            const record: Record<string, number> = {};

            rows.forEach((row) => {
              const bezirksnummer = row["Bezirksnummer"];
              const wahlbezirk = row["Wahlbezirk"];

              const composite = `0${bezirksnummer}${wahlbezirk}`.trim();
              let uwb = "";

              if (composite.length > 5) {
                uwb = `${bezirksnummer}${wahlbezirk}`.trim();
              } else {
                uwb = composite;
              }

              const votes = Number(row["Die Linke"] || 0);

              if (uwb) record[uwb] = votes;
            });

            console.log("UWB keys:", Object.keys(record).length);
            setCsvData(record);
          },
        });
      })
      .catch(console.error);
  }, []);

  const getColor = (votes: number) => {
    if (votes > 250) return "#FFD93D";
    if (votes > 200) return "#450693";
    if (votes > 100) return "#FF3F7F";
    return "#cccccc";
  };

  const handleClick = (e: any) => {
    if (!mapRef.current || !geoData) return;
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ["districts-fill"],
    });

    if (!features.length) return;
    const uwb = features[0].properties?.UWB;
    const key = uwb?.toString().trim();
    const votes = uwb ? csvData[key] : undefined;

    console.log("UWB: " + uwb);
    console.log("Stimmen: " + votes);
  };

  // Helper to build the match expression
  const createFillColorExpression = (
    csvData: Record<string, number>,
    getColor: (votes: number) => string
  ): ExpressionSpecification => {
    const entries = Object.entries(csvData).flatMap(([id, votes]) => [
      id,
      getColor(votes),
    ]);

    return [
      "match",
      ["get", "UWB"],
      ...entries,
      "#cccccc",
    ] as unknown as ExpressionSpecification;
  };

  const districtsFill: FillLayerSpecification = {
    id: "districts-fill",
    type: "fill",
    source: "voting-disctricts",
    paint: {
      "fill-color": createFillColorExpression(csvData, getColor),
      "fill-opacity": 0.6,
    },
    filter: ["==", "$type", "Polygon"],
  };

  const districtsOutline = {
    id: "districts-outline",
    type: "line",
    paint: {
      "line-color": "#0F0E0E",
      "line-width": 0.5,
      "line-opacity": 0.2,
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
