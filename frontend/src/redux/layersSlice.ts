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

export interface LayersState {
  layers: Layer[]
}

const initialPanelsState: LayersState = {
  layers: []
};

const panelsSlice = createSlice({
  name: "layers",
  initialState: initialPanelsState,
  reducers: {
    updateLayerList: (state, action: PayloadAction<Layer[]>) => {
      state.layers = action.payload;
    },
  },
});

export const { updateLayerList } = panelsSlice.actions;

export default panelsSlice.reducer;
