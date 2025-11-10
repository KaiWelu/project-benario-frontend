import { configureStore } from "@reduxjs/toolkit";
import mapLayerReducer from "./mapLayerSlice";
import mapSliceReducer from "./mapSlice";

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
  reducer: {
    mapLayer: mapLayerReducer,
    map: mapSliceReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
