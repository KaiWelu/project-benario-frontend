import { Grid2x2, Grid3x2, Grid3x3 } from "lucide-react";
import { MapLayer } from "../types/map";

export const MAP_LAYERS: MapLayer[] = [
  {
    id: "bundestag",
    name: "Bundeswahlkreise",
    description:
      "Wahlkreise für die Bundestagswahlen 2025. Ungefähr 200.000 Wahlberechtigte pro Wahlkreis.",
    icon: Grid2x2,
  },
  {
    id: "landtag",
    name: "Landeswahlkreise",
    description:
      "Wahlkreise für die Abgeordnetenhauswahlen 2026. Ungefähr 30.000 Wahlberechtigte pro Wahlkreis.",
    icon: Grid3x2,
  },
  {
    id: "stimmbezirk",
    name: "Stimmbezirke",
    description:
      "Kleinste Einheiten für Wahlen in Berlin. Entspricht einem Wahllokal und zugeordnetem Briefwahlbezirk.",
    icon: Grid3x3,
  },
] as const;
