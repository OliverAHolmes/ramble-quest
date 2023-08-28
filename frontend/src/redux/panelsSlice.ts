import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DeleteLayerState = {
  visible: boolean;
  id?: number;
};
export interface PanelsState {
  uploadGeoJson: {
    visible: boolean;
  };
  deleteLayer: DeleteLayerState;
  layerList: {
    visible: boolean;
  };
  layerAttributeTable: {
    visible: boolean;
  };
}

const initialPanelsState: PanelsState = {
  uploadGeoJson: {
    visible: false,
  },
  deleteLayer: {
    visible: false,
  },
  layerList: {
    visible: false,
  },
  layerAttributeTable: {
    visible: false,
  },
};

const panelsSlice = createSlice({
  name: "panels",
  initialState: initialPanelsState,
  reducers: {
    setUploadGeoJsonVisable: (state, action: PayloadAction<boolean>) => {
      state.uploadGeoJson.visible = action.payload;
    },
    setDeleteLayerVisable: (state, action: PayloadAction<DeleteLayerState>) => {
      state.deleteLayer = action.payload;
    },
    setLayerListVisable: (state, action: PayloadAction<boolean>) => {
      state.layerList.visible = action.payload;
    },
    setLayerAttributeTableVisable: (state, action: PayloadAction<boolean>) => {
      state.layerAttributeTable.visible = action.payload;
    },
  },
});

export const {
  setUploadGeoJsonVisable,
  setLayerListVisable,
  setLayerAttributeTableVisable,
  setDeleteLayerVisable,
} = panelsSlice.actions;

export default panelsSlice.reducer;
