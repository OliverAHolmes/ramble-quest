import React from "react";
import { render } from "@testing-library/react";
import Layers from "./Layers";

// Mock useSelector from react-redux
import { useSelector } from "react-redux";

const mockUseSelector = useSelector as jest.Mock;

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

jest.mock("./Layers/Table", () => {
  const MockedLayersTable = () => (
    <div data-testid="layersTable-component">LayersTable</div>
  );
  return MockedLayersTable;
});

jest.mock("./Layers/NoLayers", () => {
  const MockedNoLayers = () => (
    <div data-testid="noLayers-component">NoLayers</div>
  );
  return MockedNoLayers;
});

describe("<Layers />", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockUseSelector.mockClear();
  });

  it("renders NoLayers when isOpen is true and layers are empty", () => {
    mockUseSelector.mockImplementation((selector) => {
      return selector({
        panels: { layerList: { visible: true } },
        layers: { list: [] },
      });
    });
    const { getByTestId } = render(<Layers />);
    expect(getByTestId("noLayers-component")).toBeInTheDocument();
  });

  it("renders LayersTable when isOpen is true and layers exist", () => {
    mockUseSelector.mockImplementation((selector) => {
      return selector({
        panels: { layerList: { visible: true } },
        layers: { list: [{}] },
      });
    });
    const { getByTestId } = render(<Layers />);
    expect(getByTestId("layersTable-component")).toBeInTheDocument();
  });

  it("does not render NoLayers or LayersTable when isOpen is false", () => {
    mockUseSelector.mockImplementation((selector) => {
      return selector({
        panels: { layerList: { visible: false } },
        layers: { list: [] },
      });
    });
    const { queryByTestId } = render(<Layers />);
    expect(queryByTestId("noLayers-component")).not.toBeInTheDocument();
    expect(queryByTestId("layersTable-component")).not.toBeInTheDocument();
  });
});
