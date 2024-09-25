import { render, screen, getAllByRole } from "@testing-library/react";
import React from "react";

import Main from "../../client/component/main";

describe("Main component tests", () => {
  describe("Required Layout Tests", () => {
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

      expect(() => getByRole("button", { name: "Add" })).not.toThrow();
    });
  });
});
