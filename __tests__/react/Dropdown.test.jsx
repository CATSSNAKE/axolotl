import React from "react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import Dropdown from "../../client/component/Dropdown";

describe("Dropdown compoenent", () => {
  it("should be able to select an from a dropdown", async () => {
    const mFunc = jest.fn();
    const user = userEvent.setup();
    const { getByRole, getByLabelText } = render(
      <Dropdown
        labelText="Select:"
        updater={(e) => mFunc(e.target.value)}
        options={["A", "B", "C"]}
      />
    );

    await user.selectOptions(getByLabelText("Select:"), "A");

    expect(mFunc).toHaveBeenCalled();
    expect(mFunc).toHaveBeenCalledWith("A");

    expect(getByRole("option", { name: "" }).selected).toBe(false);
    expect(getByRole("option", { name: "A" }).selected).toBe(true);
    expect(getByRole("option", { name: "B" }).selected).toBe(false);
    expect(getByRole("option", { name: "C" }).selected).toBe(false);
  });
});
