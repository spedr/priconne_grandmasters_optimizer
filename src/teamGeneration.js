function combinations(arr, k) {
    let results = [];
    function helper(start, combo) {
      if (combo.length === k) {
        results.push(combo.slice());
        return;
      }
      for (let i = start; i < arr.length; ++i) {
        combo.push(arr[i]);
        helper(i + 1, combo);
        combo.pop();
      }
    }
    helper(0, []);
    return results;
  }

  function canSatisfyRequirements(requiredSynergies, units) {
    const unitsWithSynergy = [];
  
    for (const unit of units) {
      let synergyPoints = 0;
      for (const synergy of unit.synergies) {
        if (synergy in requiredSynergies) {
          synergyPoints++;
        }
      }
      if (synergyPoints > 0) {
        unitsWithSynergy.push({ unit, synergyPoints });
      }
    }
  
    unitsWithSynergy.sort((a, b) => b.synergyPoints - a.synergyPoints);
  
    let requiredSynergyPoints = Object.values(requiredSynergies).reduce((a, b) => a + b, 0);
    let currentTeamSize = 0;
  
    for (const { unit, synergyPoints } of unitsWithSynergy) {
      if (currentTeamSize < 9) {
        requiredSynergyPoints -= synergyPoints;
        currentTeamSize++;
      } else {
        break;
      }
    }
  
    return requiredSynergyPoints <= 0;
  }
  

  function getStartingSet(units, requiredSynergies, synergyDict, requiredUnits) {
    if (requiredUnits.length >= 7) {
      return [[requiredUnits], "exhaustive"];
    }
  
    const unitsWithRequiredSynergies = units.filter(
      (unit) =>
        unit.synergies.some((synergy) => requiredSynergies.hasOwnProperty(synergy)) &&
        !requiredUnits.some((requiredUnit) => requiredUnit.name === unit.name)
    );
  
    if (!canSatisfyRequirements(requiredSynergies, units)) {
      return [];
    }
  
    let minUnits = units.length + 1;
    let bestStartingSets = [];
  
    for (let i = 1; i <= unitsWithRequiredSynergies.length; i++) {
      const unitCombinations = combinations(unitsWithRequiredSynergies, i);
      for (const unitCombination of unitCombinations) {
        const startingSet = [...requiredUnits, ...unitCombination];
        const startingSetSynergies = Object.fromEntries(
          Object.keys(requiredSynergies).map((synergy) => [synergy, 0])
        );
  
        for (const unit of startingSet) {
          for (const synergy of unit.synergies) {
            if (requiredSynergies.hasOwnProperty(synergy)) {
              startingSetSynergies[synergy]++;
            }
          }
        }
  
        if (
          Object.entries(requiredSynergies).every(
            ([synergy, count]) => startingSetSynergies[synergy] >= count
          )
        ) {
          if (startingSet.length < minUnits) {
            minUnits = startingSet.length;
            bestStartingSets = [startingSet];
          } else if (startingSet.length === minUnits) {
            bestStartingSets.push(startingSet);
          }
        }
      }
    }
  
    let mode = "";
    if (bestStartingSets[0].length < 7) {
      mode = "heuristic";
      bestStartingSets = fillStartingSets(units, bestStartingSets, synergyDict);
    } else {
      mode = "exhaustive";
    }
  
    return [bestStartingSets, mode];
  }

  
  function getUnitContributionScore(unit, unfulfilledSynergies) {
    return unit.synergies.reduce((score, synergy) => {
      return score + (unfulfilledSynergies[synergy] || 0);
    }, 0);
  }

  
  function getSynergyCount(team, synergy) {
    return team.filter(unit => unit.synergies.includes(synergy)).length;
  }
  
  function isValidTeam(team, requiredSynergies, synergyDict) {
    for (const [synergy, requiredCount] of Object.entries(requiredSynergies)) {
      const count = getSynergyCount(team, synergy);
      if (count < requiredCount) {
        return false;
      }
    }
  
    for (const [synergy, levels] of Object.entries(synergyDict)) {
      const count = getSynergyCount(team, synergy);
      if (count > Math.max(...levels) && !requiredSynergies.hasOwnProperty(synergy)) {
        return false;
      }
    }
  
    return true;
  }
  
  function getActiveSynergies(team, synergyDict) {
    let active_synergies = {};
    let total_score = 0;
    for (const [synergy, levels] of Object.entries(synergyDict)) {
      const count = getSynergyCount(team, synergy);
      for (const level of levels.slice().reverse()) {
        if (count >= level) {
          active_synergies[synergy] = level;
          total_score += level;
          break;
        }
      }
    }
    return { active_synergies, total_score };
  }
  
  function generateTeams(setList, units, requiredSynergies, synergyDict) {
    //const setList = getStartingSet(units, requiredSynergies, synergyDict)
    let startingSets = setList[0];
    let mode = setList[1]

    if (!startingSets.length) {
      return [];
    }
  
    const validTeams = [];
    for (const startingSet of startingSets) {
      const remainingUnits = units.filter(unit => !startingSet.includes(unit));
      const remainingSlots = 9 - startingSet.length;
  
      const allCombinations = combinations(remainingUnits, remainingSlots);
      const startingSetTeams = allCombinations
        .map(combination => startingSet.concat(combination))
        .filter(team => isValidTeam(team, requiredSynergies, synergyDict));
  
      validTeams.push(...startingSetTeams);
    }
  
    return validTeams;
  }

  function getTopTeams(teams, synergyDict) {
    const sortedTeams = teams.sort((a, b) => {
      const { totalScore: scoreA } = getActiveSynergies(a, synergyDict);
      const { totalScore: scoreB } = getActiveSynergies(b, synergyDict);
      return scoreB - scoreA;
    });
    return sortedTeams;
  }
  
  function printTeams(teams, synergyDict, requiredSynergies) {
    const scoredTeams = teams.map((team) => {
      const sortedTeam = team.slice().sort((a, b) => a.star - b.star);
      const { active_synergies, total_score } = getActiveSynergies(sortedTeam, synergyDict);
  
      // Get the unfulfilled synergies
      const unfulfilled_synergies = getUnfulfilledSynergies(sortedTeam, synergyDict).filter((synergyObj) => requiredSynergies.hasOwnProperty(synergyObj.synergy));
      console.log(unfulfilled_synergies);
      return { team: sortedTeam, active_synergies, unfulfilled_synergies, total_score };
    });
  
    const teamsWithScoreAtLeast10 = scoredTeams.filter((team) => team.total_score >= 10);
    const sortedTeams = teamsWithScoreAtLeast10.sort((a, b) => b.total_score - a.total_score);
    return sortedTeams;
  }

  function getUnfulfilledSynergies(units, synergyDict) {
    const activeSynergies = {};
  
    for (const unit of units) {
      for (const synergy of unit.synergies) {
        if (activeSynergies[synergy]) {
          activeSynergies[synergy]++;
        } else {
          activeSynergies[synergy] = 1;
        }
      }
    }
  
    const unfulfilledSynergies = [];
  
    for (const [synergy, levels] of Object.entries(synergyDict)) {
      const activeCount = activeSynergies[synergy] || 0;
      const nextLevelIndex = levels.findIndex(level => level > activeCount);
  
      if (nextLevelIndex !== -1) {
        const nextLevel = levels[nextLevelIndex];
        const distance = nextLevel - activeCount;
        unfulfilledSynergies.push({ synergy, level: nextLevel, distance });
      }
    }
  
    // Sort the unfulfilled synergies by the "distance" key
    unfulfilledSynergies.sort((a, b) => a.distance - b.distance);
  
    return unfulfilledSynergies;
  }

  function fillStartingSets(units, startingSets, synergyDict) {
    const filledStartingSets = startingSets.map(startingSet => {
      if (startingSet.length >= 7) {
        return startingSet;
      }
  
      const newStartingSet = [...startingSet];
      while (newStartingSet.length < 7) {
        const unfulfilledSynergies = getUnfulfilledSynergies(newStartingSet, synergyDict);
        const closestUnfulfilled = unfulfilledSynergies[0].distance;
  
        const relevantUnits = units.filter(unit =>
          unit.synergies.some(synergy =>
            unfulfilledSynergies.find(u => u.synergy === synergy && u.distance === closestUnfulfilled)
          ) && !newStartingSet.some(existingUnit => existingUnit.name === unit.name)
        );
  
        const unitContributions = relevantUnits.map(unit => {
          const contribution = unit.synergies.reduce((acc, synergy) => {
            const unfulfilled = unfulfilledSynergies.find(u => u.synergy === synergy);
            return unfulfilled ? acc + unfulfilled.distance : acc;
          }, 0);
  
          return {
            unit: unit,
            contribution: contribution,
          };
        });
  
        // Sort units by their contribution in descending order
        unitContributions.sort((a, b) => b.contribution - a.contribution);
  
        // Add the unit with the highest total contribution
        if (unitContributions.length > 0) {
          newStartingSet.push(unitContributions[0].unit);
        } else {
          break;
        }
      }
  
      return newStartingSet;
    });
  
    return filledStartingSets;
  }

  function displayTeams(teams) {
    const pageSize = 10;
    const paginatedTeams = paginateTeams(teams, pageSize);
    const pagesCount = paginatedTeams.length;
  
    let currentPage = 0;
  
    function renderPage(pageIndex) {
      document.getElementById("output").innerHTML = "";
  
      paginatedTeams[pageIndex].forEach(({ team, active_synergies, total_score }) => {
        const teamElement = document.createElement("div");
        teamElement.className = "team";
        teamElement.innerText = team.map(unit => unit.name).join(", ") + " - Synergy Score: " + total_score;
        document.getElementById("output").appendChild(teamElement);
      });
    }
  
    // Initial render of the first page
    renderPage(currentPage);
  
    // Add event listeners for pagination buttons
    document.getElementById("prev-page").addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        renderPage(currentPage);
      }
    });
  
    document.getElementById("next-page").addEventListener("click", () => {
      if (currentPage < pagesCount - 1) {
        currentPage++;
        renderPage(currentPage);
      }
    });
  }

  function paginateTeams(teams, pageSize) {
    const paginatedTeams = [];
  
    for (let i = 0; i < teams.length; i += pageSize) {
      paginatedTeams.push(teams.slice(i, i + pageSize));
    }
  
    return paginatedTeams;
  }

export {
    combinations,
    getStartingSet,
    getSynergyCount,
    isValidTeam,
    getActiveSynergies,
    generateTeams,
    canSatisfyRequirements,
    getTopTeams,
    printTeams,
    getUnfulfilledSynergies,
    fillStartingSets,
    paginateTeams,
    displayTeams,

  };