import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import FuelCalculatorDialog from "../FuelCalculatorDialog";

describe("FuelCalculatorDialog", () => {
  it("renders with fallback default mileage of 15 km/L when defaultMileage is omitted", () => {
    render(
      <FuelCalculatorDialog
        open={true}
        routeDistanceKm={150}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const mileageInput = screen.getByLabelText(/Vehicle Mileage/i) as HTMLInputElement;
    expect(mileageInput.value).toBe("15");
    expect(screen.getByText(/Route Distance/i)).toBeInTheDocument();
    // 150 km / 15 km/L * 100 = ₹1,000
    expect(screen.getByText("₹1,000")).toBeInTheDocument();
  });

  it("renders with customized default mileage from user profile and displays profile helper text", () => {
    render(
      <FuelCalculatorDialog
        open={true}
        routeDistanceKm={150}
        defaultMileage={30}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const mileageInput = screen.getByLabelText(/Vehicle Mileage/i) as HTMLInputElement;
    expect(mileageInput.value).toBe("30");
    expect(screen.getByText(/Default from profile: 30 km\/L/i)).toBeInTheDocument();
    // 150 km / 30 km/L * 100 = ₹500
    expect(screen.getByText("₹500")).toBeInTheDocument();
  });

  it("allows rider to manually override mileage and submits the overridden value", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <FuelCalculatorDialog
        open={true}
        routeDistanceKm={300}
        defaultMileage={30}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    const mileageInput = screen.getByLabelText(/Vehicle Mileage/i);
    await user.clear(mileageInput);
    await user.type(mileageInput, "20");

    // 300 km / 20 km/L * 100 = ₹1,500
    expect(screen.getByText("₹1,500")).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /Calculate & Apply/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        routeDistanceKm: 300,
        vehicleMileage: 20,
        fuelPricePerLiter: 100,
      });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it("triggers onClose when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <FuelCalculatorDialog
        open={true}
        routeDistanceKm={100}
        onClose={handleClose}
        onSubmit={vi.fn()}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
