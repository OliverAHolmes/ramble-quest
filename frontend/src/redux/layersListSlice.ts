import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Layer {
  created_at: string;
  feature: {
    type: string;
    features: any[]; // Define the type more specifically if you know it
  };
  id: number;
  name: string;
}

export interface LayersListState {
  layers: Layer[]
  selectedLayerId?: number
}

const initialPanelsState: LayersListState = {
  layers: []
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
    }
  },
});

export const { updateLayerList, updateSelectedLayerId } = panelsSlice.actions;

export default panelsSlice.reducer;
