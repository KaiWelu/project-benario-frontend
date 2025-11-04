"use client";
import React from "react";
import { LandPlot } from "lucide-react";

import { MAP_LAYERS } from "@/lib/constants/mapLayers";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveLayerId } from "@/store/mapLayerSlice";

const MapLayerPanel = () => {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.mapLayer.activeLayerId);
  return (
    <nav className="bg-gray-50/90 shadow-md absolute top-0 right-0 flex h-full p-4 just w-sm flex-col gap-2 overflow-y-auto">
      {/*   <div className="border-b-2 p-1 mb-3 border-red-700">
        <div className="flex flex-row gap-1 items-center">
          <LandPlot size={26} strokeWidth={1} />
          <p className="text-2xl">Wahlkreisauswahl</p>
        </div>
      </div>
      <button className="text-md flex flex-col rounded-sm shadow-sm p-2 bg-white items-start hover:bg-rose-50 hover:border-1">
        <div className="flex flex-row items-center gap-1.5 mb-1">
          <Grid2x2 size={22} strokeWidth={1} />
          <h1>Bundeswahlkreise</h1>
        </div>
        <p className="text-sm text-start border-t-1 pt-1 border-gray-400">
          Wahlkreise für die Bundestagswahlen 2025. Ungefähr 200.000
          Wahlberechtigte pro Wahlkreis.
        </p>
      </button>
      <button className="text-md flex flex-col rounded-sm shadow-sm p-2 bg-white items-start hover:bg-cyan-100">
        <div className="flex flex-row items-center gap-1.5 mb-1">
          <Grid3x2 size={22} strokeWidth={1} />
          <h1>Landeswahlkreise</h1>
        </div>
        <p className="text-sm text-start border-t-1 pt-1 border-gray-400">
          Wahlkreise für die Abgordnetenhauswahlen 2026. Ungefähr 30.000
          Wahlberechtigte pro Wahlkreis
        </p>
      </button>
      <button className="text-md flex flex-col rounded-sm shadow-sm p-2 bg-white items-start hover:bg-cyan-100">
        <div className="flex flex-row items-center gap-1.5 mb-1">
          <Grid3x3 size={22} strokeWidth={1} />
          <h1>Stimmbezirke</h1>
        </div>
        <p className="text-sm text-start border-t-1 pt-1 border-gray-400">
          Kleinste Einheiten für Wahlen in Berlin. Entspricht einem Wahllokal
          und zugeordnetem Briefwahlbezirk.
        </p>
      </button>*/}
      <div className="border-b-2 p-1 mb-3 border-red-700">
        <div className="flex flex-row gap-1 items-center">
          <LandPlot size={26} strokeWidth={1} />
          <p className="text-2xl">Wahlkreisauswahl</p>
        </div>
      </div>
      <fieldset className="flex flex-col gap-3" aria-label="Map layers">
        {MAP_LAYERS.map((layer) => {
          const Icon = layer.icon;
          const checked = activeId === layer.id;

          return (
            <label
              key={layer.id}
              className={`cursor-pointer block rounded-md p-2 border transition-shadow ${
                checked
                  ? "bg-rose-50 border-gray-400 shadow-sm"
                  : "bg-white border-gray-200 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="mapLayer"
                  value={layer.id}
                  checked={checked}
                  onChange={() => dispatch(setActiveLayerId(layer.id))}
                  className="sr-only"
                  aria-checked={checked}
                />
                <div className="flex-shrink-0 mt-0.5">
                  <Icon size={22} strokeWidth={1} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-lg">{layer.name}</h2>
                    {/*  {checked && (
                      <span className="text-sm text-cyan-700">Ausgewählt</span>
                    )} */}
                  </div>
                  <p className="text-sm text-gray-800 mt-1">
                    {layer.description}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </fieldset>
    </nav>
  );
};

export default MapLayerPanel;
