function getFixture(teamNames, totalMaches = 0, counter = { attempts: 1 }) {
  const fixture = {};
  const colors = {};
  const teams = [...teamNames];
  const numberOfMatches = parseInt(totalMaches);
  const randomColors = ['#0088FE', '#808000', '#FF4500','#FFBB28', '#00FF00', '#FF8042', '#006400', '#00C49F', '#8B008B', '#407a47', '#963665', '#6228b8'];

  teams.forEach((value, index) => {
    fixture[value] = [];
    colors[value] = randomColors[index];
  });

  teams.forEach((team) => {
    let exceptTeams = [team];
    for (let index in fixture) {
      if (fixture[index] && fixture[index].length === numberOfMatches) {
        exceptTeams.push(index);
      }
    }
    const oppositionCloned = deleteMultiples(exceptTeams, teams);
    setOpposition(team, oppositionCloned);
  });

  const data = [];
  const isValidFixture = getValidFixture();
  while (!isValidFixture && counter.attempts < 10) {
    counter.attempts = counter.attempts + 1;
    getFixture(teams, numberOfMatches, counter);
  }

  if (!isValidFixture) {
    return {
      error: true,
      data: [],
      message:
        "Fixture is not valid please generate again. If not able to generate after so many attempts please change number of teams or matches",
    };
  } else {
    for (let key in fixture) {
      fixture[key].forEach((team) => {
        fixture[team] = deleteElementFromArray(key, fixture[team]);
      });
    }
    let index = 0;
    for (let key in fixture) {
      fixture[key].forEach((team) => {
        data.push({ id: index++, team1: `<span style="color:${colors[key]}">${key}</span>`, team2: `<span style="color:${colors[team]}">${team}</span>` });
      });
    }

    return {
      error: false,
      data,
      message: "Success",
    };
  }
  function getValidFixture() {
    for (let key in fixture) {
      const isUndefined = (element) => element === undefined;
      if (fixture[key].some(isUndefined)) {
        return false;
      }
    }
    return true;
  }

  function setOpposition(team, oppositions) {
    let oppositionCloned = [...oppositions];
    for (let i = 0; i < numberOfMatches; i++) {
      if (fixture[team] && fixture[team].length) {
        if (fixture[team].length === numberOfMatches) {
          return;
        }
        oppositionCloned = deleteMultiples(fixture[team], oppositionCloned);
      }

      const index = getRandomInt(0, oppositionCloned.length - 1);
      fixture[team].push(oppositionCloned[index]);

      oppositionCloned[index] &&
        fixture[oppositionCloned[index]] &&
        fixture[oppositionCloned[index]].push(team);
    }
  }

  function deleteMultiples(arrayElements, array) {
    let arrayClone = [...array];
    arrayElements.forEach((team) => {
      arrayClone = deleteElementFromArray(team, arrayClone);
    });
    return arrayClone;
  }

  function deleteElementFromArray(element, array) {
    const arrayClone = [...array];
    const index = arrayClone.indexOf(element);
    if (index > -1) {
      arrayClone.splice(index, 1);
    }
    return arrayClone;
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}


export const addMinutes = (time, minutes = 0) => {
  const date = new Date(time);
  date.setMinutes(date.getMinutes() + minutes);
  return date;
} 

export const getDateTime = (startTime) => {
  const date = new Date();
  date.setHours(startTime);
  date.setMinutes(0);
  date.setSeconds(0);
  return date.toString();
} 

export const getTime = (date) => {
  const newDate = new Date(date);
  const hours = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minutes = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
  return `${hours}:${minutes}`
}

export default getFixture;
