/* 
This is the updated prototype for state management and it will follow a hybrid approach while redux 
is tracking the global state of selected variables there will be configs based on the selection wich
will then be rendered in the component. We will also utilize a custom hook to enhance performance with
caching.

Redux State (What to show)
    ↓
Config Files (How to calculate & display)
    ↓
Component (Rendering)

This might to be refactored later to incorporate different types of data like election results or dtd data
*/

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface MapState {
  activeLayerId: string | null; // wich layer is selected
  activeDatasetId: string | null; // what kind of data is selected
  selectedParty: string | null; // wich party is selected
  colorSchemeId: string | null; // selected coloring scheme e.g. district winner or heatmap
  selectedDistrictId: string | null; // wich district is currently selected
  sideBarOpen: boolean;
  processedData: Record<string, any> | null; // optional for cached data to enhance performance
}

const initialState: MapState = {
  activeLayerId: null,
  activeDatasetId: null,
  selectedParty: null,
  colorSchemeId: "votes_heatmap_absolute",
  selectedDistrictId: null,
  sideBarOpen: true,
  processedData: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setActiveLayer: (state, action: PayloadAction<string>) => {
      state.activeLayerId = action.payload;
      state.processedData = null;
    },
    setActiveDataset: (state, action: PayloadAction<string>) => {
      state.activeDatasetId = action.payload;
      state.processedData = null;
    },
    setSelectedParty: (state, action: PayloadAction<string>) => {
      state.selectedParty = action.payload;
      state.processedData = null;
    },
    setColorScheme: (state, action: PayloadAction<string>) => {
      state.colorSchemeId = action.payload;
    },
    setSelectedDistrict: (state, action: PayloadAction<string | null>) => {
      state.selectedDistrictId = action.payload;
    },
    setProcessedData: (state, action: PayloadAction<Record<string, any>>) => {
      state.processedData = action.payload;
    },
  },
});

export default mapSlice.reducer;
