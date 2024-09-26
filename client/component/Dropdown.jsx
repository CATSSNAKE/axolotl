import React from "react";

export default ({ labelText, options, updater, current }) => (
  <label>
    {labelText}
    <select className="allInput" onChange={updater}>
      <option value=""></option>
      {options.map((op, i) => (
        <option key={i} value={op}>
          {op}
        </option>
      ))}
    </select>
  </label>
);
