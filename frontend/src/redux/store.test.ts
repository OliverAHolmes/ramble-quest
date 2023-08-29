import { configureStore } from "@reduxjs/toolkit";
import {
  setUploadGeoJsonVisable,
  setLayerListVisable,
  setLayerAttributeTableVisable,
  setDeleteLayerVisible,
} from "./panelsSlice";
import { updateLayerList, updateSelectedLayerId } from "./layersListSlice";
import { rootReducer, type RootState } from "./store";
import { act } from "@testing-library/react";

describe("Redux Store", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      devTools: false,
      middleware: [],
    });
  });

  it("should handle panel actions", () => {
    act(() => {
      store.dispatch(setUploadGeoJsonVisable(true));
      store.dispatch(setLayerAttributeTableVisable(true));
      store.dispatch(setLayerListVisable(true));
      store.dispatch(setDeleteLayerVisible({ visible: true, id: 1 }));
    });

    const state: RootState = store.getState();
    expect(state.panels.uploadGeoJson.visible).toBe(true);
    expect(state.panels.layerAttributeTable.visible).toBe(true);
    expect(state.panels.layerList.visible).toBe(true);
    expect(state.panels.deleteLayer).toEqual({ visible: true, id: 1 });
  });

  it("should handle panel actions", () => {
    act(() => {
      store.dispatch(setUploadGeoJsonVisable(true));
      store.dispatch(setDeleteLayerVisible({ visible: true, id: 1 }));
    });

    const state: RootState = store.getState();
    expect(state.panels.uploadGeoJson.visible).toBe(true);
    expect(state.panels.deleteLayer).toEqual({ visible: true, id: 1 });
  });

  it("should handle layer actions", () => {
    const layerListMock = [
      {
        created_at: "some-date",
        feature: { type: "type", features: [] },
        id: 1,
        name: "layer1",
      },
    ];
    act(() => {
      store.dispatch(updateLayerList(layerListMock));
      store.dispatch(updateSelectedLayerId(1));
    });

    const state: RootState = store.getState();
    expect(state.layers.list).toEqual(layerListMock);
    expect(state.layers.selectedLayerId).toEqual(1);
  });
});
