import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for the "toBeInTheDocument" matcher
import UploadError from "./UploadError"; // adjust the import to your file structure

describe("<UploadError />", () => {
  it("should render error message correctly", () => {
    // Arrange
    const testMessage = "This is a test error message";

    // Act
    render(<UploadError message={testMessage} />);

    // Assert
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText(testMessage)).toBeInTheDocument();
    expect(screen.getByTestId("i-close")).toBeInTheDocument();
  });
});
