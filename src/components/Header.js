import PageModal from './PageModal';
import React, { useState } from 'react';
import HelpModal from './HelpModal';
import UnitSelector from './UnitSelector';
import './custom-styles.css';


const Header = ({
  exploreTeams,
  mode,
  showModal,
  setShowModal,
  currentPage,
  totalPages,
  setCurrentPage,
  desiredPage,
  handleDesiredPageChange,
  goToDesiredPage,
  goToLastPage,
}) => {
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showUnitSelector, setShowUnitSelector] = useState(false);


  return (
    
    <div className="bg-gray-200 px-4 py-4 rounded-t-md">
      <div className="flex items-center">
        <button
          className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md"
          onClick={exploreTeams}
        >
          Search teams
        </button>
        <div className="border-r border-gray-400 h-6 mx-4"></div>
        <span className="text-sm ml-2 mr-4">{mode ? `Mode: ${mode}` : 'Current execution mode'}</span>
        <button
          className="bg-gray-500 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
          onClick={() => setShowHelpModal(true)}
        >
          ?
        </button>
        <div className="border-r border-gray-400 h-6 mx-4"></div>
      <HelpModal
  showModal={showHelpModal}
  setShowModal={setShowHelpModal}
  helpText={["This app usually uses a combination of heuristics and exhaustive search to look for efficient teams. It does that by computing a number of initial sets that satisfy the minimum synergy requirements and building them iteratively by trying to find good additions to the team. If the starting set reaches 7 units, then the search space becomes small enough for us to perform exhaustive search without taking up too much time. Therefore, the app will run on [execution mode: heuristic] if your given set of required synergies has n starting set of less than 7 units. This will usually run fast enough, however, there are no guarantees that the obtained set of teams will necessarily be the most optimal ones, as it will not compute through every possible team for that given set of required synergies.", "", "Likewise, if you added enough required synergies for the starting sets to be composed of 7 of more required units, then the app will run on [execution mode: exhaustive], as it is only performing exhaustive search on all the obtained starting sets", "", "Mirror is not yet implemented. I don't know if I will or not. If you want to, feel free to send a PR."]}
/>
        <div className="flex items-center ml-4">
          <button
            className={`${
              currentPage === 1 ? "cursor-not-allowed" : ""
            } px-3 py-2 bg-gray-500 text-white font-semibold rounded-md mx-1`}
            onClick={() =>
              setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)
            }
          >
            ←
          </button>
          <div className="px-3 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md mx-1 cursor-not-allowed">
            {currentPage}
          </div>
          <div
            className={`${
              currentPage === totalPages ? "cursor-not-allowed" : ""
            } px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md mx-1`}
            onClick={() =>
              setCurrentPage(
                currentPage < totalPages ? currentPage + 1 : currentPage
              )
            }
          >
            {currentPage + 1}
          </div>
          <button
            className="px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md mx-1"
            onClick={() => {
              setShowModal(true);
            }}
          >
            ...
          </button>
          <button
            className="px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md mx-1"
            onClick={goToLastPage}
          >
            {totalPages ? totalPages : 'Last'}
          </button>
          <button
            className={`${
              currentPage === totalPages ? "cursor-not-allowed" : ""
            } px-3 py-2 bg-gray-500 text-white font-semibold rounded-md mx-1`}
            onClick={() =>
              setCurrentPage(
                currentPage < totalPages ? currentPage + 1 : currentPage
              )
            }
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;