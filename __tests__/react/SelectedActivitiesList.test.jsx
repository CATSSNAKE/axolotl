import React from "react";
import { jest } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import SelectedActivitesList from "../../client/component/SelectedActivitiesList";

describe("<SelectedActivitiesList />", () => {
  it("should show an activity & skill level and a delete button", () => {
    const { getByText, getByRole } = render(
      <SelectedActivitesList
        selectedActivitySkillLevels={{ Golf: "Beginner" }}
      />
    );

    expect(() => getByText("Golf - Beginner")).not.toThrow();
    expect(() => getByRole("button", { name: "Delete" })).not.toThrow();
  });

  it("should show multiple activities & skill levels", () => {
    const { getByText, getAllByRole } = render(
      <SelectedActivitesList
        selectedActivitySkillLevels={{ Golf: "Beginner", Hiking: "Advanced" }}
      />
    );

    expect(() => getByText("Golf - Beginner")).not.toThrow();
    expect(() => getByText("Hiking - Advanced")).not.toThrow();
    expect(getAllByRole("button", { name: "Delete" }).length).toEqual(2);
  });

  it("should remove the proper activity when the delete button is pressed", async () => {
    const user = userEvent.setup();
    const selectedActivitySkillLevels = {
      Golf: "Beginner",
      Hiking: "Advanced",
    };
    const handleDelete = jest.fn(
      (key) => delete selectedActivitySkillLevels[key]
    );
    const { getAllByRole, rerender } = render(
      <SelectedActivitesList
        selectedActivitySkillLevels={selectedActivitySkillLevels}
        updateActivitiesSkillLevels={handleDelete}
      />
    );

    await user.click(getAllByRole("button", { name: "Delete" })[0]);
    rerender(
      <SelectedActivitesList
        selectedActivitySkillLevels={selectedActivitySkillLevels}
        updateActivitiesSkillLevels={handleDelete}
      />
    );

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(getAllByRole("listitem")).toHaveLength(1);
  });
});
