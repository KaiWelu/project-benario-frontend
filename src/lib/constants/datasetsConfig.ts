import { Feature } from "maplibre-gl";
import { COLOR_SCHEMES, ColorScheme } from "./colorSchemes";

// prototype config to be used in a config based approach for map coloring based on different datasets
// needs better typing

export interface DatasetConfig {
  id: string;
  name: string;
  dataUrl: string; // source of the data
  colorScheme: ColorScheme; // color scheme to be used
  valueKey: string; // key to use for coloring
  partyColumn?: string; // used with election data
  processData?: (rows: any[], partyColumn?: string) => Record<string, number>; // function to process election data
  onClick?: (features: Feature, data: any) => void; // function for click events
}
