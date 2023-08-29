import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import DeleteModal from "./DeleteModal";
import reactRedux from "react-redux";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

global.fetch = jest.fn();

describe("<DeleteModal />", () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
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

  it("should render without crashing", () => {
    const { getByText } = render(<DeleteModal />);
    expect(getByText(/Do you really want to delete/)).toBeInTheDocument();
  });

  it("should handle Cancel button click", () => {
    const { getByText } = render(<DeleteModal />);
    fireEvent.click(getByText("Cancel"));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "panels/setDeleteLayerVisible",
      payload: { visible: false, id: undefined },
    });
  });

  it("should handle Delete button click", async () => {
    (window.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ feature_id: 1 }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });
    const { getByTestId } = render(<DeleteModal />);
    fireEvent.click(getByTestId("delete-button"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);

      // Check the first call to mockDispatch
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: "panels/setDeleteLayerVisible",
        payload: { visible: false, id: undefined },
      });

      // Check the second call to mockDispatch
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        type: "layers/updateLayerList",
        payload: [],
      });

      // Check the third call to mockDispatch
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        type: "layers/updateSelectedLayerId",
        payload: 1,
      });
    });
  });

  it("should handle Delete button click with server error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: "Server error" }),
    });

    const { getByTestId } = render(<DeleteModal />);
    await act(async () => {
      fireEvent.click(getByTestId("delete-button"));
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      // Add a check to make sure `setError` has been called with the correct argument
    });
  });

  it("should handle Delete button click with network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { getByTestId } = render(<DeleteModal />);

    console.error = jest.fn();

    await act(async () => {
      fireEvent.click(getByTestId("delete-button"));
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
