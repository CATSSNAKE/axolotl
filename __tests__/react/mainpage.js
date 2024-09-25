import { getByLabelText, render, screen } from "@testing-library/react";
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
    it("activity dropdown shows available activities", async () => {
      // this is implementation driven, and will need to change when the frontend changes
      // uses specific props
      const allActivities = ["A", "B", "C", "D"];
      const { getByText } = render(
        <Main {...minimalProps} allActivities={allActivities} />
      );
      const label = getByText("Choose an activity:");
      expect(label).not.toBeUndefined();
      const select = label.nextElementSibling;
      expect(
        Array.from(select.childNodes).map((childNode) => childNode.textContent)
      ).toEqual(["", ...allActivities]);
    });

    it("activity dropdown doesn't include activities that have already been selected", async () => {
      // this is implementation driven, and will need to change when the frontend changes
      const allActivities = ["A", "B", "C", "D"];
      const { getByText } = render(
        <Main
          {...minimalProps}
          allActivities={allActivities}
          selectedA={{ A: true }}
        />
      );

      const label = getByText("Choose an activity:");
      expect(label).not.toBeUndefined();
      const select = label.nextElementSibling;
      expect(
        Array.from(select.childNodes).map((childNode) => childNode.textContent)
      ).toEqual(["", ...allActivities.filter((elem) => elem !== "A")]);
    });

    it("skill level radio buttons should have Beginner, Intermediate, Advanced", () => {
      const { getByRole, getByText } = render(<Main {...minimalProps} />);

      expect(() => getByText(/Choose skill level:/i)).not.toThrow();
      expect(() => getByRole("radio", { name: "Beginner" })).not.toThrow();
      expect(() => getByRole("radio", { name: "Intermediate" })).not.toThrow();
      expect(() => getByRole("radio", { name: "Advanced" })).not.toThrow();
    });
  });
});
