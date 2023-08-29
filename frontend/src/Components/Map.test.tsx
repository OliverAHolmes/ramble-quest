import React from "react";
import { render, act } from "@testing-library/react";
import reactRedux, { useSelector } from "react-redux";
import Map from "./Map"; // Assuming the Map component file is Map.tsx
import mapboxgl from "mapbox-gl";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockUseSelector = useSelector as jest.Mock;

jest.mock("mapbox-gl", () => ({
  Map: jest.fn(),
  Popup: jest.fn(),
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
};

// Mocking Redux useSelector and useDispatch hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("Map", () => {
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
                coordinates: [130.91697317210253, -22.352283782872988],
                type: "Point",
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
  });
});
