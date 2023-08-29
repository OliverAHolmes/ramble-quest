import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Table from "./Table";
import reactRedux, { useSelector, useDispatch } from "react-redux";
import { updateSelectedLayerId } from "../../redux/layersListSlice";

const mockUseSelector = useSelector as jest.Mock;

// Mocking Redux useSelector and useDispatch hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("<Table />", () => {
  const mockDispatch = useDispatch as jest.Mock;

  beforeEach(() => {
    jest.spyOn(reactRedux, "useDispatch").mockReturnValue(mockDispatch as any);
    mockUseSelector.mockClear();
  });

  it("renders table rows based on layer data", () => {
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

    render(<Table />);

    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(useDispatch).toHaveBeenCalled();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Point")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("FeatureCollection")).toBeInTheDocument();
  });

  it("calls dispatch with correct action when row is clicked", async () => {
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
        ];
      }
      if (selector.toString().includes("state.layers.selectedLayerId")) {
        return 1;
      }
    });

    render(<Table />);

    fireEvent.click(screen.getByText("1"));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "layers/updateSelectedLayerId",
      }),
    );

    const firstRadioButton = await screen.findByTestId("radio-button-1");
    expect(mockDispatch).toHaveBeenCalledWith(updateSelectedLayerId(1));

    fireEvent.click(firstRadioButton);
    await waitFor(() => {
      expect(firstRadioButton).toBeChecked();
    });
  });

  it("calls dispatch with correct action when delete button is clicked", async () => {
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
        ];
      }
      if (selector.toString().includes("state.layers.selectedLayerId")) {
        return null;
      }
    });

    render(<Table />);

    const deleteButton = await screen.findByTestId("delete-button");

    fireEvent.click(deleteButton);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "panels/setDeleteLayerVisible",
      payload: { visible: true, id: 1 },
    });
  });
});
