"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Map, Source, Layer, MapRef } from "@vis.gl/react-maplibre";
import type {
  ExpressionSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import SidePanel from "@/components/ui/SidePanel";

export interface CsvRow {
  Bezirksnummer: string;
  Wahlbezirk: string;
  [key: string]: string | number; // dynamic party column
}

interface ElectionRow {
  Adresse: string;
  Stimmart: string;
  Bezirksnummer: string;
  Bezirksname: string;
  Wahlbezirk: string;
  Wahlbezirksart: string;
  Briefwahlbezirk: string;
  Abgeordnetenhauswahlkreis: string;
  Bundestagswahlkreis: string;
  OstWest: string;
  WahlberechtigteInsgesamt: string;
  WahlberechtigteA1: string;
  WahlberechtigteA2: string;
  WahlberechtigteA3: string;
  Wählende: string;
  WählendeB1: string;
  GültigeStimmen: string;
  UngültigeStimmen: string;
  SPD?: string;
  GRÜNE?: string;
  CDU?: string;
  DieLinke?: string;
  AFD?: string;
  FDP?: string;
  BSW?: string;
  [key: string]: string | undefined; // catch-all for any other party columns
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
  const [selectedParty, setSelectedParty] = useState<string>("DieLinke");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [electionData, setElectionData] = useState<CsvRow[] | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  // this is for highlighting
  const [selectedUwb, setSelectedUwb] = useState<string | null>(null);

  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    fetch("/data/Stimmbezirke-AGH21.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/data/Berlin_BT25_Custom.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows: CsvRow[] = await res.json();
        setElectionData(rows);
        console.log("Loaded JSON rows: " + rows.length);
      } catch (error) {
        console.error("Error loading election data: " + error);
      }
    };
    loadData(); // this is an helper for async functions so everything gets loaded
  }, []);

  useEffect(() => {
    fetch("/data/Berlin_BT25_Custom.json")
      .then((res) => res.json())
      .then((rows: CsvRow[]) => {
        const record = jsonToElectionRecord(rows, selectedParty); // pick the party here
        console.log("Selected Party: " + selectedParty);
        setCsvData(record);
      })
      .catch(console.error);
  }, [selectedParty]);

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

    const getDistrictById = (id: string) => {
      if (!electionData) return null;

      return electionData.find((row) => row.Adresse === id) || null;
    };

    const compositeId = uwb.slice(0, 2) + "W" + uwb.slice(2);

    const district = getDistrictById(compositeId);
    console.log(district);
    setSelectedDistrict(district);
    setSelectedUwb(uwb); // highlights this district
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

  // we need something better for performance
  // use map.setFeatureState() (recommended for interactivity)
  const fillExpression = useMemo(
    () => createFillColorExpression(csvData, getColor),
    [csvData]
  );

  // this is for highlighting the selected district
  const selectedDistrictLayer: FillLayerSpecification = {
    id: "selected-district",
    type: "fill",
    source: "voting-districts",
    paint: {
      "fill-color":
        fillExpression /* createFillColorExpression(csvData, getColor), // this gets the original color */,
      "fill-opacity": 0.7,
      "fill-outline-color": "#000000", // white border around the fill
    },
    filter: ["==", "UWB", selectedUwb || ""], // only show when a UWB is selected
  };

  const districtsFill: FillLayerSpecification = {
    id: "districts-fill",
    type: "fill",
    source: "voting-disctricts",
    paint: {
      "fill-color": createFillColorExpression(csvData, getColor),
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        1.0, // highlighted
        0.6, // default
      ],
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
      <SidePanel
        isOpen={isSidebarOpen}
        selectedParty={selectedParty}
        onPartyChange={setSelectedParty}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        selectedDistrict={selectedDistrict}
      />
      {geoData && (
        <Map
          id="test-map"
          ref={mapRef}
          initialViewState={{ longitude: 13.405, latitude: 52.52, zoom: 12 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          interactiveLayerIds={["districts-fill"]}
          onLoad={() => console.log("Map loaded!")}
          onClick={handleClick}
        >
          <Source id="voting-districts" type="geojson" data={geoData}>
            <Layer {...districtsFill} source="voting-districts" />
            <Layer {...districtsOutline} />
            {selectedUwb && <Layer {...selectedDistrictLayer} />}
          </Source>
        </Map>
      )}
    </div>
  );
};

export default JsonMap;
