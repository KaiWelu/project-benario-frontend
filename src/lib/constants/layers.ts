import type { FeatureCollection } from "geojson";

/* To have this properly work we need something to distinguish between different data types so 
the agregation strategy can be changed based on data type */

export type DistrictLevel = "federal" | "state" | "local";

export type AggregationStrategy =
  | { type: "direct"; key: string }
  | { type: "sum"; groupBy: string[] }
  | {
      type: "custom";
      fn: (feature: any, rawData: any[], party: string) => number;
    };

export interface LayerConfig {
  id: string;
  name: string;
  level: DistrictLevel;
  geoJsonUrl: string;
  idProperty: string; // wich property to use as id

  // how to aggregate votes for a certain districtlevel
  aggregationStrategy: AggregationStrategy;

  // optional properties needed for the aggregation strategy
  requiredProperties?: string[];
}
