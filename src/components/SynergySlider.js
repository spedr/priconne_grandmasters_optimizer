import React, { useState } from 'react';

function SynergySlider({ synergy, levels, onChange }) {
  const [sliderValue, setSliderValue] = useState(0);

  const handleChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    const closestLevel = [min, ...levels].reduce((prev, curr) =>
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
    );

    if (Math.abs(newValue - closestLevel) <= (max - min) / (levels.length * 4)) {
      setSliderValue(closestLevel);
      onChange(synergy, closestLevel); // Add this line
    } else {
      setSliderValue(sliderValue);
    }
  };

  const min = 0;
  const max = Math.max(...levels);

  return (
    <div className="flex items-center space-x-2">
      <img
        src={require(`./resources/synergies/${synergy}.png`)}
        alt={synergy}
        className="w-8 h-8"
      />
      <div className="relative w-full">
        <input
          type="range"
          min={min}
          max={max}
          value={sliderValue}
          onChange={handleChange}
          list={`${synergy}-levels`}
          className="w-full h-1.5 cursor-pointer appearance-none bg-gray-300 focus:outline-none"
          style={{
            backgroundImage: `linear-gradient(90deg, #3B82F6 ${sliderValue / max * 100}%, #E5E7EB ${sliderValue / max * 100}%)`,
            borderRadius: '999px',
          }}
        />
        <datalist id={`${synergy}-levels`}>
          {levels.map((level) => (
            <option key={level} value={level} />
          ))}
        </datalist>
        <div className="absolute left-0 right-0 top-full mt-1 flex text-xs text-gray-500">
          {[min, ...levels].map((level) => (
            <span key={level} className="absolute w-4 text-center" style={{ left: `calc(${((level - min) / (max - min)) * 100}% - 8px)` }}>{level}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SynergySlider;
