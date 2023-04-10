import React, { useState, forwardRef, useImperativeHandle } from 'react';
import units from '../resources/units.json';

const UnitSelector = forwardRef((props, ref) => {
  const [selectedUnits, setSelectedUnits] = useState(new Set());
  const [expanded, setExpanded] = useState(false);

  const toggleUnitSelection = (unit) => {
    const newSelectedUnits = new Set(selectedUnits);
    if (newSelectedUnits.has(unit)) {
      newSelectedUnits.delete(unit);
    } else {
      newSelectedUnits.add(unit);
    }
    setSelectedUnits(newSelectedUnits);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  useImperativeHandle(ref, () => ({
    getSelectedUnits: () => {
      return Array.from(selectedUnits).map((unitName) =>
        units.find((unit) => unit.name === unitName)
      );
    },
  }));

  return (
    <div className="col-span-2">
      <div
        className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md mb-2 cursor-pointer flex items-center transition duration-150 ease-in-out"
        onClick={toggleExpanded}
      >
        <span
          className={`transform transition-transform duration-300 ${
            expanded ? 'rotate-90' : ''
          }`}
        >
          &gt;
        </span>
        <span className="ml-2">Unit Selection</span>
      </div>
      <div
        className={`flex flex-wrap gap-2.5 justify-center m-2 bg-gray-200 p-2 rounded-md transition duration-300 ease-in-out ${
          expanded ? 'max-h-full visible' : 'max-h-0 hidden'
        }`}
      >
        {units.map((unit) => (
          <img
            key={unit.name}
            src={require(`../resources/units/${unit.name}.png`)}
            alt={unit.name}
            className={`w-8 h-8 cursor-pointer ${
              selectedUnits.has(unit.name) ? '' : 'grayscale opacity-50'
            }`}
            onClick={() => toggleUnitSelection(unit.name)}
          />
        ))}
      </div>
    </div>
  );
});

export default UnitSelector;