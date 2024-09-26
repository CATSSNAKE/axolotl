import { jest } from "@jest/globals";
import { render, getAllByRole, getByRole } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Main from "../../client/component/main";

import handleA from "../../client/handleActivity";
jest.mock("../../client/handleActivity", () => ({
  __esModule: true,
  default: jest.fn(() => {}),
}));

describe("Main component tests", () => {
  /* TODO: as the main page is turned from one component with a wall of html as output,
   *   to many components, these unit tests should render specific components instead of the main page
   * As Redux is implemented, the Provider will need to be mocked? and injected instead of props
   */
  const minimalProps = {
    activity: "",
    setActivity: () => {},
    skillLevel: "",
    setSkillLevel: () => {},
    city: "",
    setCity: () => {},
    zipCode: "",
    setZipCode: () => {},
    distance: "",
    setDistance: () => {},
    gender: "",
    setGender: () => {},
    allActivities: [],
    selectedA: "",
    setSelectedA: () => {},
    zipcodes: [],
    setZipcodes: () => {},
  };
  describe("Layout Tests", () => {
    // this is implementation driven, and will need to change when the frontend changes
    // uses specific props

    it("activity dropdown should show available activities", async () => {
      // implementation driven: uses specific props
      const allActivities = ["A", "B", "C", "D"];
      const { getByLabelText } = render(
        <Main {...minimalProps} allActivities={allActivities} />
      );
      let select;
      expect(
        () => (select = getByLabelText("Choose an activity:"))
      ).not.toThrow();
      expect(
        getAllByRole(select, "option").map((option) => option.textContent)
      ).toEqual(["", ...allActivities]);
    });

    it("activity dropdown shouldn't include activities that have already been selected", async () => {
      // implementation driven: uses specific props
      const allActivities = ["A", "B", "C", "D"];
      const { getByLabelText } = render(
        <Main
          {...minimalProps}
          allActivities={allActivities}
          selectedA={{ A: true }}
        />
      );

      let select;
      expect(
        () => (select = getByLabelText("Choose an activity:"))
      ).not.toThrow();
      expect(
        getAllByRole(select, "option").map((option) => option.textContent)
      ).toEqual(["", ...allActivities.filter((elem) => elem !== "A")]);
    });

    it("should have a delete button for selected activities", () => {
      const allActivities = ["A", "B", "C", "D"];
      const { getByText } = render(
        <Main
          {...minimalProps}
          allActivities={allActivities}
          selectedA={{ A: true }}
        />
      );

      expect(() => getByText("Delete")).not.toThrow();
    });

    it("skill level dropdown should show Beginner, Intermediate, Advanced options", async () => {
      // implementation driven: uses specific props
      const { getByLabelText } = render(<Main {...minimalProps} />);
      let select;
      expect(
        () => (select = getByLabelText("Choose a skill level:"))
      ).not.toThrow();
      expect(
        getAllByRole(select, "option").map((option) => option.textContent)
      ).toEqual(["", "Beginner", "Intermediate", "Advanced"]);
    });

    it("should have an 'Add' button", () => {
      // implementation driven: uses specific props
      const { getByRole } = render(<Main {...minimalProps} />);

      // would throw if there is no button with text 'Add'
      expect(() => getByRole("button", { name: "Add" })).not.toThrow();
    });

    it("should have an activities list", () => {
      const { getByRole } = render(<Main {...minimalProps} />);

      // would throw if it cannot find a list, or if there is more than one
      expect(() => getByRole("list")).not.toThrow();
    });

    it("should have a city input field", () => {
      const { getByLabelText } = render(<Main {...minimalProps} />);

      // would throw if it cannot find a list, or if there is more than one
      let input;
      expect(() => (input = getByLabelText("City:"))).not.toThrow();
      // don't know how to get the role of the selected element
      //expect(input.getAttribute("role")).toEqual("textbox"); //currently gets null
    });

    it("should have a zip code input field", () => {
      const { getByLabelText } = render(<Main {...minimalProps} />);

      // would throw if it cannot find a list, or if there is more than one
      let input;
      expect(() => (input = getByLabelText("Zip Code:"))).not.toThrow();
      // don't know how to get the role of the selected element
      //expect(input.getAttribute("role")).toEqual("textbox"); //currently gets null
    });

    it("should have a gender dropdown", async () => {
      // implementation driven: uses specific props
      const { getByLabelText } = render(<Main {...minimalProps} />);
      let select;
      expect(() => (select = getByLabelText("Gender:"))).not.toThrow();
      expect(
        getAllByRole(select, "option").map((option) => option.textContent)
      ).toEqual([
        expect.stringMatching(""),
        expect.stringMatching(/prefer not to say/i),
        expect.stringMatching(/non[\s-]binary/i),
        expect.stringMatching(/male/i),
        expect.stringMatching(/female/i),
      ]);
    });

    it("should have a search button", () => {
      // implementation driven: uses specific props
      const { getByRole } = render(<Main {...minimalProps} />);

      // would throw if there is no button with text 'Add'
      expect(() => getByRole("button", { name: "Search" })).not.toThrow();
    });

    it("should have a google map element (Manual check)", () => {});
  });

  describe("Interaction Tests", () => {
    it("should be able to select an activity", async () => {
      const setActivity = jest.fn();
      const user = userEvent.setup();
      const allActivities = ["A", "B", "C"];
      const { getByLabelText } = render(
        <Main
          {...minimalProps}
          allActivities={allActivities}
          setActivity={setActivity}
        />
      );

      const selectElement = getByLabelText("Choose an activity:");
      await user.selectOptions(selectElement, "A");

      expect(setActivity).toHaveBeenCalled();
      expect(setActivity).toHaveBeenCalledWith("A");

      expect(getByRole(selectElement, "option", { name: "" }).selected).toBe(
        false
      );
      expect(getByRole(selectElement, "option", { name: "A" }).selected).toBe(
        true
      );
      expect(getByRole(selectElement, "option", { name: "B" }).selected).toBe(
        false
      );
      expect(getByRole(selectElement, "option", { name: "C" }).selected).toBe(
        false
      );
    });

    it("should be able to select a skill level", async () => {
      const setSkillLevel = jest.fn();
      const user = userEvent.setup();
      const { getByLabelText } = render(
        <Main {...minimalProps} setSkillLevel={setSkillLevel} />
      );

      const selectElement = getByLabelText("Choose a skill level:");
      await user.selectOptions(selectElement, "Beginner");

      expect(setSkillLevel).toHaveBeenCalled();
      expect(setSkillLevel).toHaveBeenCalledWith("Beginner");

      expect(getByRole(selectElement, "option", { name: "" }).selected).toBe(
        false
      );
      expect(
        getByRole(selectElement, "option", { name: "Beginner" }).selected
      ).toBe(true);
      expect(
        getByRole(selectElement, "option", { name: "Intermediate" }).selected
      ).toBe(false);
      expect(
        getByRole(selectElement, "option", { name: "Advanced" }).selected
      ).toBe(false);
    });

    xit("should show added activity", async () => {
      const user = userEvent.setup();
      const allActivities = ["Golf", "Climbing", "Hiking"];

      const { getByLabelText, getByText, rerender } = render(
        <Main {...minimalProps} allActivities={allActivities} />
      );

      await user.selectOptions(
        getByLabelText(/choose an activity:?/i),
        "Climbing"
      );
      await user.selectOptions(
        getByLabelText("Choose a skill level:"),
        "Beginner"
      );
      await user.click(getByText("Add"));

      expect(handleA).toHaveBeenCalled();
      await rerender(<Main {...minimalProps} allActivities={allActivities} />);

      // below fails, as the elements aren't being added to the DOM,
      // because the state is being held in the App component
      expect(() => getByText("Climbing - Beginner")).not.toThrow();
      expect(() => getByText(/delete/i)).not.toThrow();
    });

    // doesn't work because state is held in higher component
    xit("should delete selected activities and return them to the option list", async () => {
      const user = userEvent.setup();
      const allActivities = ["A", "B", "C", "D"];
      const { getByRole, getByText } = render(
        <Main
          {...minimalProps}
          allActivities={allActivities}
          selectedA={{ Golf: "Beginner" }}
        />
      );

      await user.click(getByText("Delete"));
      // the list item should have been removed
      expect(() =>
        getByRole("listitem", { name: "Golf - Beginner" })
      ).toThrow();
      // the deleted Activity should be added back to the options
      expect(() => getByRole("option", { name: "Golf" })).not.toThrow();
    });

    it("should be able to selecte a gender");
  });
});
