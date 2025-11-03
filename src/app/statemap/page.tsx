"use client";
import React, { useState, useEffect, useRef } from "react";
import { Map, Source, Layer, MapRef, Popup } from "@vis.gl/react-maplibre";
import type {
  FillLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import { CsvRow } from "../jsonmap/page";
import MapLayerPanel from "@/components/ui/MapLayerPanel";
import { useAppSelector } from "@/store";
import { MAP_SOURCES } from "@/lib/constants/mapSources";

const StateMap = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [electionData, setElectionData] = useState<CsvRow[] | null>(null);

  const mapRef = useRef<MapRef>(null);

  // Redux layer state
  const activeLayerId = useAppSelector((s) => s.mapLayer.activeLayerId);

  function getAllVotes(bez: any, awk2: any, party: string) {
    let votes: number = 0;
    const newBez = bez.toString();
    let newAwk2 = awk2.toString();

    console.log("BEZ: " + bez);
    console.log("awk2: " + awk2);

    if (newAwk2[0] === "0") {
      newAwk2 = newAwk2.slice(1);
    }

    const id = newBez + "W" + newAwk2;

    const bwbList: string[] = [];
    const uwbList: string[] = [];
    electionData?.forEach((row) => {
      const aghID = String(row.Adresse).slice(0, 4);
      const bwb = String(row.Adresse);
      const bwbID =
        String(row.Briefwahlbezirk).slice(0, 2) +
        "B" +
        String(row.Briefwahlbezirk).slice(2, 4);

      if (aghID === id) {
        votes += Number(row.DieLinke || 0);
        if (bwbList.includes(bwbID) !== true) bwbList.push(bwbID);
        uwbList.push(aghID);
      }
    });

    electionData?.forEach((row) => {
      bwbList.forEach((bwb) => {
        if (bwb === row.Adresse) {
          votes = votes + Number(row.DieLinke);
        }
      });
    });

    console.log(uwbList);
    console.log(bwbList);
    return votes;
  }

  useEffect(() => {
    if (!activeLayerId) return;
    const url = MAP_SOURCES[activeLayerId];
    if (!url) return;

    fetch(url)
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
  }, [activeLayerId]);

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

  const handleClick = (e: any) => {
    if (!mapRef.current || !geoData) return;
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ["districts-fill"],
    });

    if (!features.length) {
      return;
    }

    console.log("Bezirk:", features[0].properties?.BEZ);
    console.log("====BEZIRK====");
    console.log("AWK:", features[0].properties?.AWK);
    console.log("AWK2:", features[0].properties?.AWK2);
    console.log(
      "Votes: " +
        getAllVotes(
          features[0].properties?.BEZ,
          features[0].properties?.AWK2,
          "DieLinke"
        )
    );
    console.log("\n");
  };

  const handleMouseMove = (e: any) => {
    if (!mapRef.current && !geoData) return;

    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ["districts-fill"],
    });

    if (features.length > 0) {
      setHoveredId(features[0].id); // feature ID is a string from AWK
    } else {
      setHoveredId(null);
    }
  };

  const handleMouseLeave = () => {
    if (!mapRef.current && !geoData) return;
    setHoveredId(null);
  };

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
      <Map
        id="test-map"
        ref={mapRef}
        initialViewState={{ longitude: 13.405, latitude: 52.52, zoom: 12 }}
        style={{
          width: "100%",
          height: "100%",
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={
          geoData && activeLayerId ? ["districts-fill"] : undefined
        }
        onLoad={() => console.log("Everything is loaded!")}
        onClick={(e) => {
          if (!geoData || !activeLayerId) return; // this way there are no errors if no district layer is selected
          handleClick(e);
        }}
        onMouseMove={(e) => {
          if (!geoData || !activeLayerId) return;
          handleMouseMove(e);
        }}
        onMouseLeave={(e) => {
          if (!geoData || !activeLayerId) return;
          handleMouseLeave(e);
        }}
      >
        {activeLayerId && geoData && (
          <Source id="voting-districts" type="geojson" data={geoData}>
            <Layer {...districtsFill} source="voting-districts" />
            <Layer {...districtsOutline} />
          </Source>
        )}

        {hoveredId && (
          <div className="bg-amber-200 absolute top-2 left-2 p-2">
            {hoveredId}
          </div>
        )}
      </Map>

      <MapLayerPanel />
    </div>
  );
};

export default StateMap;
