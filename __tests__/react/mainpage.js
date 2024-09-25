import { render, screen, getAllByRole } from "@testing-library/react";
import React from "react";

import Main from "../../client/component/main";

describe("Main component tests", () => {
  /* TODO: as the main page is turned from one component with a wall of html as output,
   *   to many components, these unit tests should render specific components instead of the main page
   * As Redux is implemented, the Provider will need to be mocked? and injected instead of props
   */

  describe("Layout Tests", () => {
    // this is implementation driven, and will need to change when the frontend changes
    // uses specific props
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

    it("activity dropdown should show available activities", async () => {
      // implementation driven: uses specific props
      const allActivities = ["A", "B", "C", "D"];
      const { getByText, getByLabelText } = render(
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
      const { getByText, getByLabelText } = render(
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

    it("skill level radio buttons should have Beginner, Intermediate, Advanced", () => {
      // implementation driven: uses specific props
      const { getByRole, getByText } = render(<Main {...minimalProps} />);

      expect(() => getByText(/Choose skill level:/i)).not.toThrow();
      expect(() => getByRole("radio", { name: "Beginner" })).not.toThrow();
      expect(() => getByRole("radio", { name: "Intermediate" })).not.toThrow();
      expect(() => getByRole("radio", { name: "Advanced" })).not.toThrow();
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
});
