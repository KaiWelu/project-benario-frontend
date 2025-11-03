import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MAP_LAYERS } from "@/lib/constants/mapLayers";

type MapLayerState = {
  activeLayerId: string | null;
};

const initialState: MapLayerState = {
  activeLayerId: null,
};

const slice = createSlice({
  name: "mapLayer",
  initialState,
  reducers: {
    setActiveLayerId(state, action: PayloadAction<string>) {
      state.activeLayerId = action.payload;
    },
    clearActiveLayer(state) {
      state.activeLayerId = null;
    },
  },
});

export const { setActiveLayerId, clearActiveLayer } = slice.actions;
export default slice.reducer;
