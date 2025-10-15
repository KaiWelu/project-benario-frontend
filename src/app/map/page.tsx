"use client";
import React from "react";
import { Map } from "@vis.gl/react-maplibre";

const page = () => {
  return (
    <div className="p-4 bg-amber-100 min-h-screen">
      <Map
        initialViewState={{
          longitude: 13.405,
          latitude: 52.52,
          zoom: 12,
        }}
        style={{ width: 1200, height: 800 }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      />
    </div>
  );
};

export default page;
