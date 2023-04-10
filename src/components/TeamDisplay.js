import React from 'react';

const TeamDisplay = ({ teamData, index, isLast }) => {
  return (
    <div key={index} className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Team {index + 1}</h3>
      <div className="flex space-x-1 mb-2">
        {Object.entries(teamData.active_synergies).map(([synergy, level]) => (
          <div key={synergy} className="relative">
            <img
              src={require(`./resources/synergies/${synergy}.png`)}
              alt={synergy}
              className="w-8 h-8"
            />
            <div className="absolute bottom-0 right-0 bg-white text-xs font-semibold rounded-full px-1 text-gray-800">
              {level}
            </div>
          </div>
        ))}
        <div className="border-r border-gray-400 mx-2 h-8"></div>
        {teamData.unfulfilled_synergies.map((synergy) => (
          <img
            key={synergy}
            src={require(`./resources/synergies/${synergy}.png`)}
            alt={synergy}
            className="w-8 h-8 grayscale opacity-50"
          />
        ))}
      </div>
      <div className="flex space-x-1 mb-2">
        {teamData.team.map((unit) => (
          <img
            key={unit.name}
            src={require(`./resources/units/${unit.name}.png`)}
            alt={unit.name}
            className="w-8 h-8"
          />
        ))}
      </div>
      <div className="text-sm font-semibold">Team score: {teamData.total_score}</div>
      {!isLast && <hr className="my-4 border-t border-gray-300" />}
    </div>
  );
};

export default TeamDisplay;