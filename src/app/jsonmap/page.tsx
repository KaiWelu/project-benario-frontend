"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Map, Source, Layer, MapRef } from "@vis.gl/react-maplibre";
import type {
  ExpressionSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";
import type { FeatureCollection, Feature } from "geojson";

interface CsvRow {
  Bezirksnummer: string;
  Wahlbezirk: string;
  [key: string]: string | number; // dynamic party column
}

function jsonToElectionRecord(
  rows: CsvRow[],
  party: string
): Record<string, number> {
  const record: Record<string, number> = {};

  rows.forEach((row) => {
    const bezirksnummer = row.Bezirksnummer;
    const wahlbezirk = row.Wahlbezirk;

    // build UWB and account for Bezirke with two digits - looking at you Lichtenberg :D
    const composite = `0${bezirksnummer}${wahlbezirk}`.trim();
    const uwb =
      composite.length > 5 ? `${bezirksnummer}${wahlbezirk}`.trim() : composite;

    // return if empty
    if (!uwb) return;

    // pars the vote count to the record
    record[uwb] = Number(row[party] || -1);
  });
  return record;
}

const JsonMap = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [csvData, setCsvData] = useState<Record<string, number>>({});

  const mapRef = useRef<MapRef>(null);

  const dataLoading = useEffect(() => {
    fetch("/data/Stimmbezirke-AGH21.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));

    fetch("/data/Berlin_BT25_Custom.json")
      .then((res) => res.json())
      .then((rows: CsvRow[]) => {
        const record = jsonToElectionRecord(rows, "AFD"); // pick the party here
        console.log("UWB keys:", Object.keys(record).length);
        setCsvData(record);
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

    /* console.log("UWB: " + uwb);
    console.log("Stimmen: " + votes);
    parseTest(); */
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
      "#7bfc03",
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

export default JsonMap;
