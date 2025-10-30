import React from "react";
import {
  BetweenHorizontalEnd,
  LandPlot,
  Grid2x2,
  Grid3x2,
  Grid3x3,
} from "lucide-react";

const MapLayerPanel = () => {
  return (
    <nav className="bg-gray-50 shadow-md absolute top-0 right-0 flex flex-col h-full p-4 just w-sm flex-col gap-2">
      <div className="border-b-2 p-1 mb-3 border-red-700">
        <div className="flex flex-row gap-1 items-center">
          <LandPlot size={22} strokeWidth={1} />
          <p className="text-2xl">Wahlkreisauswahl</p>
        </div>
      </div>
      <button className="text-md flex flex-col rounded-sm shadow-sm p-2 bg-white items-start hover:bg-cyan-100">
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
      </button>
    </nav>
  );
};

export default MapLayerPanel;
