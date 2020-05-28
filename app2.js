'use strict';

console.clear();
console.log('Enter your city');

const axios = require('axios');

const getData = async cityName => { // functioin for getting data
  const API_KEY = '3bd68c313a18c02837369e027d9ac4bd';
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  const response = await axios.get(URL); // getting request from  API
  const object = await response.data; // fetting data from request
  return object;
};
// async anonim function for working with promises

(async () => {
  const stdin = process.openStdin();
  const cityName = await new Promise(resolve => {
    stdin.addListener('data', d => {
      resolve(d.toString().trim());
    });
  });

  const object = await getData(cityName);

  const vs = () => {
    const visibility =  object.visibility;
    if (visibility === undefined) {
      console.log(`Unknown visibility in ${cityName} `);
    }    else {
      console.log('Visibility is:' + visibility + 'metres');
    }
  };
  vs();

  const sk = () => {
    const sky =  object.weather.main;
    if (sky === undefined) {
      console.log('Can`t get information about the sky');
    }	else {
      console.log('sky:' + sky);
    }
  };
  sk();

  const temp = 'Current temperature is:' + Math.round(object.main.temp - 273) + '°';
  console.log(temp);

  const feelslike = 'Feels like:' + Math.round(object.main.feels_like - 273) + '°';
  console.log(feelslike);

  const minTemp = 'Min temperature for today is:' + Math.round(object.main.temp_min - 273) + '°';
  console.log(minTemp);

  const maxTemp = 'Max temperature for today is:' + Math.round(object.main.temp_max - 273) + '°';
  console.log(maxTemp);

  const wind = 'Wind speed is:' + object.wind.speed  + 'm/s';
  console.log(wind);

  process.exit(-1);
})();
