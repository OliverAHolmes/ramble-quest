import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";
// import { rootReducer } from "../redux/store";
import { Provider } from "react-redux";
import panelsReducer, {
  setUploadGeoJsonVisable,
  setLayerListVisable,
} from "../redux/panelsSlice";

// const store = configureStore({
//   reducer: rootReducer,
// });

describe("<Navbar />", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        panels: panelsReducer,
      },
    });
    store.dispatch = jest.fn(); // Now we mock dispatch
  });

  it("should open and close the menu", () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>,
    );

    const menuButton = screen.getByLabelText(/toggle menu/i);
    expect(menuButton).toBeInTheDocument();

    // Open the menu
    userEvent.click(menuButton);
    // Check the state changes or menu appearance (Based on what `isOpen` actually does)

    // Close the menu
    userEvent.click(menuButton);
    // Check the state changes or menu disappearance
  });

  it("should dispatch setUploadGeoJsonVisable when Upload button is clicked", () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>,
    );

    const uploadButton = screen.getByText(/upload/i);
    expect(uploadButton).toBeInTheDocument();

    userEvent.click(uploadButton);
    expect(store.dispatch).toHaveBeenCalledWith(setUploadGeoJsonVisable(true));
  });

  it("should dispatch setLayerListVisable when Layers button is clicked", () => {
    const layerListVisible = false; // mock the initial state value from Redux
    store.getState = jest.fn().mockReturnValue({
      panels: {
        layerList: {
          visible: layerListVisible,
        },
      },
    });

    render(
      <Provider store={store}>
        <Navbar />
      </Provider>,
    );

    const layersButton = screen.getByText(/layers/i);
    expect(layersButton).toBeInTheDocument();

    userEvent.click(layersButton);
    expect(store.dispatch).toHaveBeenCalledWith(
      setLayerListVisable(!layerListVisible),
    );
  });
});
