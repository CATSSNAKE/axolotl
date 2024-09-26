import { expect, jest, it } from "@jest/globals";
import { render, getAllByRole, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";

import Main from "../../client/component/main";
import Dropdown from "../../client/component/Dropdown";

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

  describe("Interaction Tests", () => {
    // it("should be able to select an activity", async () => {
    //   const mFunc = jest.fn();
    //   const user = userEvent.setup();
    //   const { getByRole, getByLabelText } = render(
    //     <Dropdown
    //       labelText="Select:"
    //       updater={(e) => mFunc(e.target.value)}
    //       options={["A", "B", "C"]}
    //     />
    //   );

    //   await user.selectOptions(getByLabelText("Select:"), "A");

    //   expect(mFunc).toHaveBeenCalled();
    //   expect(mFunc).toHaveBeenCalledWith("A");

    //   expect(getByRole("option", { name: "" }).selected).toBe(false);
    //   expect(getByRole("option", { name: "A" }).selected).toBe(true);
    //   expect(getByRole("option", { name: "B" }).selected).toBe(false);
    //   expect(getByRole("option", { name: "C" }).selected).toBe(false);
    // });

    // not currently working...
    // seems like the front end isn't actually ever marking an option as selected?
    xit("should be able to select an activity", async () => {
      // const [activity, setActivity] = useState(""); // can;t do outside a react component
      const setActivityMocked = jest.fn();
      const user = userEvent.setup();
      const { getByLabelText, findByRole } = render(
        <Main
          {...minimalProps}
          // activity={activity}
          setActivity={setActivityMocked}
          allActivities={["A", "B"]}
        />
      );

      await user.selectOptions(getByLabelText(/choose an activity:?/i), "A");

      await waitFor(() => expect(setActivityMocked).toHaveBeenCalled());
      expect((await findByRole("option", { name: "A" })).selected).toBe(true);
      expect((await findByRole("option", { name: "B" })).selected).toBe(false);
    });

    // not currently working...
    // seems like the front end isn't actually ever marking a radio as selected?
    xit("should be able to select a skill level", async () => {
      const user = userEvent.setup();
      const { getByLabelText, findByRole } = render(<Main {...minimalProps} />);

      await user.click(getByLabelText(/beginner/i));
      // Definitley not checking anything...
      //
      // console.log(
      //   getAllByRole("radio").map((radio) => `${radio.name}: ${radio.checked}`)
      // );
      expect((await findByRole("radio", { name: /beginner/i })).checked).toBe(
        true
      );
    });

    xit("should show added activities", async () => {
      const setSelectedA = jest.fn();
      const user = userEvent.setup();
      const { getByLabelText, getByText } = render(
        <Main
          {...minimalProps}
          setSelectedA={setSelectedA}
          allActivities={["A"]}
        />
      );

      await user.click(getByLabelText(/beginner/i));
      await user.selectOptions(getByLabelText(/choose an activity:?/i), "A");
      await user.click(getByText("Add"));
      expect(setSelectedA).toHaveBeenCalled();
      expect(() => getByText("A - Beginner")).not.toThrow();
      expect(() => getByText(/delete/i)).not.toThrow();
    });

    xit("should delete selected activities and return them to the option list", async () => {
      const user = userEvent.setup();
      const allActivities = ["A", "B", "C", "D"];
      const deleteA = jest.fn();
      const { getByRole, getAllByRole, getByText } = render(
        <Main
          {...minimalProps}
          allActivities={allActivities}
          selectedA={{ A: true }}
          deleteA={deleteA}
        />
      );

      console.log(getByText("Delete"));
      await user.click(getByText("Delete"));

      console.log(getAllByRole("listitem"));
      expect(deleteA).toHaveBeenCalled();
      // the list item should have been removed
      expect(() => getByRole("listitem", { key: "A" })).toThrow();
      // the deleted Activity should be added back to the options
      expect(() => getByRole("option", { name: "A" })).not.toThrow();
    });
  });
});
