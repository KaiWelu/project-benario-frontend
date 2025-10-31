import Papa from "papaparse";
import fs from "fs";

export function electionResultsToJson(
  csvString: string,
  headerMapping: (string | null)[]
): any[] {
  // parsing without headers and skipping of empty lines
  const parsed = Papa.parse<string[]>(csvString, {
    skipEmptyLines: true,
  });

  // return empty array if there is no data
  const rows = parsed.data;
  if (rows.length === 0) return [];

  // skip the first row because of the headers
  const dataRows = rows.slice(1);

  const result = dataRows.map((row) => {
    const obj: Record<string, string> = {};

    headerMapping.forEach((newHeader, index) => {
      if (newHeader !== null) {
        obj[newHeader] = row[index] ?? null;
      }
    });
    return obj;
  });
  return result;
}

export async function parseTest() {
  const response = await fetch("/data/Berlin_BT25_W1.csv");
  const csvString = await response.text();

  const headers: (string | null)[] = [
    "Adresse",
    "Stimmart",
    "Bezirksnummer",
    "Bezirksname",
    "Wahlbezirk",
    "Wahlbezirksart",
    "Briefwahlbezirk",
    "Abgeordnetenhauswahlkreis",
    "Bundestagswahlkreis",
    "OstWest",
    "WahlberechtigteInsgesamt",
    "WahlberechtigteA1",
    "WahlberechtigteA2",
    "WahlberechtigteA3",
    "Wählende",
    "WählendeB1",
    "GültigeStimmen",
    "UngültigeStimmen",
    "SPD",
    "GRÜNE",
    "CDU",
    "DieLinke",
    "AFD",
    "FDP",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "BSW",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  const json = electionResultsToJson(csvString, headers);
  console.log(json);
}
