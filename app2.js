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

  const temp = Math.round(object.main.temp - 273);
  console.log('Current temperature is:' + temp + '°');

  const feelslike = Math.round(object.main.feels_like - 273);
  console.log('Feels like:' + feelslike + '°');

  const minTemp = Math.round(object.main.temp_min - 273);
  console.log('Min temperature for today is:' + minTemp + '°');

  const maxTemp = Math.round(object.main.temp_max - 273);
  console.log('Max temperature for today is:' + maxTemp + '°');

  const wind = object.wind.speed;
  console.log('Wind speed is:' + wind  + 'm/s');

  process.exit(-1);
})();
