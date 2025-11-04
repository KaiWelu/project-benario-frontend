import { COLOR_SCHEMES, ColorScheme } from "./colorSchemes";

// this needs to be typed better to be usable

export interface DatasetConfig {
  id: string;
  name: string;
  dataUrl: string;
  colorScheme: ColorScheme;
  valueKey: string; // which property to use for coloring
  partyColumn?: string; // for election data
  processData?: (rows: any[], partyColumn?: string) => Record<string, number>;
  onClick?: (feature: any, data: any) => void;
  getTooltip?: (uwb: string, value: number) => string;
}
