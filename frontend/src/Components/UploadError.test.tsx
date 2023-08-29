import React from "react";
import { render, screen } from "@testing-library/react";
import UploadError from "./UploadError";

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
