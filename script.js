const synergyUrl = "https://raw.githubusercontent.com/spedr/priconne_grandmasters_optimizer/main/synergies.json";

let requiredSynergies = {};

fetch(synergyUrl)
  .then((response) => response.json())
  .then((synergyData) => {
    synergyDict = synergyData;
    createSliders(synergyData);
  });

  function createSliders(synergyData) {
    const synergiesDiv = document.getElementById("synergies");
  
    for (const synergy in synergyData) {
      const levels = synergyData[synergy];
      const sliderContainer = document.createElement("div");
      sliderContainer.classList.add("slider-container");
  
      const label = document.createElement("label");
      label.setAttribute("for", `${synergy}-slider`);
      label.textContent = synergy;
      label.classList.add("slider-label");
  
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = 0;
      slider.max = levels.length;
      slider.value = 0;
      slider.step = 1;
      slider.id = `${synergy}-slider`;
      slider.classList.add("synergy-slider");
      slider.addEventListener("input", (event) => {
        updateRequiredSynergies(event, levels);
      });
  
      const dataList = document.createElement("datalist");
      dataList.id = `${synergy}-tickmarks`;
      [0, ...levels].forEach((level) => {
        const option = document.createElement("option");
        option.value = level;
        dataList.appendChild(option);
      });
  
      const levelIndicator = document.createElement("span");
      levelIndicator.id = `${synergy}-level-indicator`;
      levelIndicator.textContent = "0";
      levelIndicator.classList.add("level-indicator");
  
      sliderContainer.appendChild(label);
      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(dataList);
      sliderContainer.appendChild(levelIndicator);
      synergiesDiv.appendChild(sliderContainer);
    }
  }
  
  function updateRequiredSynergies(event, levels) {
    const synergy = event.target.id.replace("-slider", "");
    const index = parseInt(event.target.value, 10);
  
    const levelIndicator = document.getElementById(`${synergy}-level-indicator`);
    const value = index === 0 ? 0 : levels[index - 1];
    levelIndicator.textContent = value;
  
    if (value === 0) {
      delete requiredSynergies[synergy];
    } else {
      requiredSynergies[synergy] = value;
    }
  }

function generateOptimizedTeams() {
    const teams = generateTeams(units, requiredSynergies, synergyDict);
    const topTeams = getTopTeams(teams, synergyDict);
    displayTeams(topTeams, synergyDict);
  }