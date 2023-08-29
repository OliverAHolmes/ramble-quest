import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import reactRedux, { useSelector } from "react-redux";
import Map from "./Map";
import mapboxgl from "mapbox-gl";
import fetchMock from "jest-fetch-mock";
import { updateLayerList } from "../redux/layersListSlice";

fetchMock.enableMocks();

jest.mock("mapbox-gl", () => ({
  Map: jest.fn(),
}));

// @ts-expect-error Because I don't need all files
mapboxgl.Map.prototype = {
  on: jest.fn(),
  remove: jest.fn(),
  off: jest.fn(),
  getCanvas: jest.fn(),
  getZoom: jest.fn(),
  getCenter: jest.fn(),
  getBounds: jest.fn(),
  getStyle: jest.fn(),
  getContainer: jest.fn(),
  getCanvasContainer: jest.fn(),
  getLayer: jest.fn(),
  addLayer: jest.fn(),
  removeLayer: jest.fn(),
  getSource: jest.fn(),
  addSource: jest.fn(),
  removeSource: jest.fn(),
  fitBounds: jest.fn(),
  flyTo: jest.fn(),
};

// Mocking Redux useSelector and useDispatch hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("Map", () => {
  const mockUseSelector = useSelector as jest.Mock;
  const mockMapOn = jest.fn();
  const mockDispatch = jest.fn();
  const validJSONResponse: never[] = [];

  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify(validJSONResponse));
    jest.spyOn(reactRedux, "useDispatch").mockReturnValue(mockDispatch as any);
    jest.spyOn(reactRedux, "useSelector").mockImplementation((selector) =>
      selector({
        panels: {
          deleteLayer: {
            visible: true,
            id: 1,
          },
        },
      }),
    );
    jest
      .spyOn(mapboxgl, "Map")
      // @ts-expect-error For mock implementation purposes
      .mockImplementation(() => {
        return {
          on: mockMapOn,
          remove: jest.fn(),
          addLayer: jest.fn(),
          getLayer: jest.fn(),
          addSource: jest.fn(),
          getSource: jest.fn(),
          fitBounds: jest.fn(),
          getStyle: jest.fn(),
        };
      });
  });

  it("renders the Map component", async () => {
    mockUseSelector.mockImplementation((selector) => {
      if (selector.toString().includes("state.layers.list")) {
        return [
          {
            id: 1,
            name: "test_point.geojson",
            feature: {
              geometry: {
                type: "Point",
                coordinates: [130.91697317210253, -22.352283782872988],
              },
            },
            type: "Feature",
            created_at: "2023-08-29T01:40:14.987429",
          },
          {
            id: 2,
            name: "test_point.geojson",
            feature: {
              features: [
                {
                  geometry: {
                    coordinates: [130.91697317210253, -22.352283782872988],
                    type: "Point",
                  },
                },
              ],
              type: "FeatureCollection",
            },
            type: "Feature",
            created_at: "2023-08-29T01:40:14.987429",
          },
        ];
      }
      if (selector.toString().includes("state.layers.selectedLayerId")) {
        return null;
      }
    });
    await act(async () => {
      render(<Map />);
    });

    expect(mapboxgl.Map).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith("/features");
    expect(mockDispatch).toHaveBeenCalledWith(
      updateLayerList(expect.anything()),
    );
  });

  it("adds layers to the map", async () => {
    // Setup your mock state
    mockUseSelector.mockImplementation((selector) => {
      if (selector.toString().includes("state.layers.list")) {
        return [
          {
            id: 1,
            name: "test_point.geojson",
            feature: {
              features: [
                {
                  geometry: {
                    type: "Point",
                    coordinates: [130.91697317210253, -22.352283782872988],
                  },
                },
              ],
              type: "FeatureCollection",
            },
            type: "Feature",
            created_at: "2023-08-29T01:40:14.987429",
          },
        ];
      }
      if (selector.toString().includes("state.layers.selectedLayerId")) {
        return 1;
      }
    });
    mockMapOn.mockImplementation((event, callback) => {
      if (event === "load") {
        callback();
      }
    });

    await act(async () => {
      render(<Map />);
    });

    await waitFor(() => {
      expect(mapboxgl.Map.prototype.addLayer).toHaveBeenCalledTimes(0);
    });
  });
});
