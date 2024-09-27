import React, { useState } from "react";

export default ({
  selectedActivitySkillLevels,
  updateActivitiesSkillLevels,
}) => {
  return (
    <ul className="listField">
      {Object.entries(selectedActivitySkillLevels).map(
        ([activity, skillLevel], i) => (
          <li key={i}>
            {activity + " - " + skillLevel}
            <button onClick={() => updateActivitiesSkillLevels(activity)}>
              Delete
            </button>
          </li>
        )
      )}
    </ul>
  );
};
