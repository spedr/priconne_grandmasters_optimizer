import logo from './logo.svg';
import './App.css';
import SynergySlider from './components/SynergySlider';
import React, { useState, useEffect, useRef } from 'react';
import { generateTeams, getTopTeams, printTeams, getStartingSet } from './teamGeneration';
import TeamDisplay from './components/TeamDisplay';
import Pagination from './components/Pagination';
import Header from './components/Header';
import units from './resources/units.json';
import synergies from './resources/synergies.json';
import UnitSelector from './components/UnitSelector';

function App() {

  const typeSynergies = synergies.typeSynergies;
  const jobSynergies = synergies.jobSynergies;
  const [requiredJobSynergies, setRequiredJobSynergies] = useState({});
  const [requiredTypeSynergies, setRequiredTypeSynergies] = useState({});
  const [generatedTeams, setGeneratedTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [desiredPage, setDesiredPage] = useState(1);
  const [mode, setMode] = useState("");
  const unitSelectorRef = useRef();


  //const [synergyDict, setSynergyDict] = useState({ ...jobSynergies, ...typeSynergies });

  const handlePageChange = (newPage) => {
    console.log(newPage);
    setCurrentPage(newPage);
  };

  const handleJobSynergyChange = (synergy, value) => {
    if (value === 0) {
      const newRequiredJobSynergies = { ...requiredJobSynergies };
      delete newRequiredJobSynergies[synergy];
      setRequiredJobSynergies(newRequiredJobSynergies);
    } else {
      setRequiredJobSynergies({ ...requiredJobSynergies, [synergy]: value });
    }
  };
  
  const handleTypeSynergyChange = (synergy, value) => {
    if (value === 0) {
      const newRequiredTypeSynergies = { ...requiredTypeSynergies };
      delete newRequiredTypeSynergies[synergy];
      setRequiredTypeSynergies(newRequiredTypeSynergies);
    } else {
      setRequiredTypeSynergies({ ...requiredTypeSynergies, [synergy]: value });
    }
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToDesiredPage = () => {
    const newPage = Math.max(1, Math.min(desiredPage, totalPages));
    setCurrentPage(newPage);
    setShowModal(false);
  };

  const handleDesiredPageChange = (e) => {
    setDesiredPage(e.target.value);
  };

  const exploreTeams = () => {
    if (Object.keys(requiredJobSynergies).length === 0 && Object.keys(requiredTypeSynergies).length === 0) {
      return;
    }
  
    const requiredSynergies = { ...requiredJobSynergies, ...requiredTypeSynergies };
    console.log(requiredSynergies);
    const synergyDict = { ...jobSynergies, ...typeSynergies };
    
    // Get the selected units from the UnitSelector component
    const selectedUnits = Array.from(unitSelectorRef.current.getSelectedUnits());
    
    // Pass the selected units to the getStartingSet function
    const [startingSets, mode] = getStartingSet(units, requiredSynergies, synergyDict, selectedUnits);
    
    setMode(mode);
    const teams = generateTeams([startingSets, mode], units, requiredSynergies, synergyDict);
    const teamsWithScoreAtLeast10 = printTeams(teams, synergyDict, requiredSynergies);
    console.log(teamsWithScoreAtLeast10.length);
    setGeneratedTeams(teamsWithScoreAtLeast10);
  
    setTotalPages(Math.ceil(teamsWithScoreAtLeast10.length / 10));
    setCurrentPage(1); // Reset the current page to 1 when new teams are generated
  };
  


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-5">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <UnitSelector ref={unitSelectorRef} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Job Synergies</h2>
                {Object.entries(jobSynergies).map(([synergy, levels]) => (
                  <SynergySlider key={synergy} synergy={synergy} levels={levels} onChange={handleJobSynergyChange} />
                ))}
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Type Synergies</h2>
                {Object.entries(typeSynergies).map(([synergy, levels]) => (
                  <SynergySlider key={synergy} synergy={synergy} levels={levels} onChange={handleTypeSynergyChange} />
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-6 bg-white rounded-md shadow-md">
            <Header
              exploreTeams={exploreTeams}
              mode={mode}
              showModal={showModal}
              setShowModal={setShowModal}
              desiredPage={desiredPage}
              handleDesiredPageChange={handleDesiredPageChange}
              goToDesiredPage={goToDesiredPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              goToLastPage={goToLastPage}
            />
            <div className="p-4">
              {generatedTeams
                .slice((currentPage - 1) * 10, currentPage * 10)
                .map((teamData, index, arr) => (
                  <TeamDisplay key={index} teamData={teamData} index={index} isLast={index === arr.length - 1} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;