import React from "react";
import { render, screen } from "@testing-library/react";
import NoLayers from "./NoLayers";

describe("<NoLayers />", () => {
  it("renders the component and displays the expected text", () => {
    render(<NoLayers />);
    expect(
      screen.getByText("No layers to display, please upload a table."),
    ).toBeInTheDocument();
  });
});
