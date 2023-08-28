import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Layer {
  created_at: string;
  feature: {
    type: string;
    features: any[];
    geometry?: {
      type: string;
      coordinates: number[];
    };
  };
  id: number;
  name: string;
}

export interface LayersListState {
  layers: Layer[];
  selectedLayerId?: number;
}

const initialPanelsState: LayersListState = {
  layers: [],
};

const panelsSlice = createSlice({
  name: "layers",
  initialState: initialPanelsState,
  reducers: {
    updateLayerList: (state, action: PayloadAction<Layer[]>) => {
      state.layers = action.payload;
    },
    updateSelectedLayerId: (state, action: PayloadAction<number>) => {
      state.selectedLayerId = action.payload;
    },
  },
});

export const { updateLayerList, updateSelectedLayerId } = panelsSlice.actions;

export default panelsSlice.reducer;
