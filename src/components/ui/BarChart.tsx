import React from "react";
import { ResponsiveBar } from "@nivo/bar";

// for prototyping colors :D
const PARTY_COLORS: Record<string, string> = {
  SPD: "#E3000F",
  CDU: "#000000",
  GRÜNE: "#64A12D",
  DieLinke: "#BE3075",
  AFD: "#009EE0",
  FDP: "#FFED00",
  BSW: "#D981B7",
};

const BarChart = ({ district }: { district: any }) => {
  if (!district) return;
  return (
    <div className="p-2 w-md h-full " style={{ height: 300 }}>
      <ResponsiveBar
        data={district}
        keys={["votes"]}
        indexBy="party"
        margin={{ top: 40, right: 20, bottom: 50, left: 60 }}
        padding={0.3}
        colors={({ data }) => PARTY_COLORS[data.party] || "#cccccc"}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          legend: "Partei",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: "Stimmen",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#ffffff"
        animate={true}
      />
    </div>
  );
};

export default BarChart;
