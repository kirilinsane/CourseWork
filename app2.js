'use strict';

console.clear();
const concolor = require('concolor');
const axios = require('axios');

console.log('Hi');
console.log(concolor`${'Enter your city'}(b,red)`);

const getData = async cityName => {
  const API_KEY = '3bd68c313a18c02837369e027d9ac4bd';
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  let objectReq = {};
  await axios.get(URL)
    .then(res => {
      objectReq  = res.data;
    })
    .catch(err => {
      objectReq = { err };
    });
  return objectReq;
};

const input = async () => {
  const stdin = process.openStdin();
  const cityName = await new Promise(resolve => {
    stdin.addListener('data', data => {
      resolve(data.toString().trim());
    });
  });

  const object = await getData(cityName);
  if (!object.err) {
    const vis = 'Visibility is';
    const currentVis =  object.visibility;
    const skyStatus =  object.weather.main;
    if (!currentVis) {
      console.log(concolor`${'Unknown visibility'}(b,red/black)`);
    } else {
      console.log(concolor`${vis}(b,green) ${currentVis + 'm'}(b,yellow)`);
    }
    if (!skyStatus) {
      console.log(concolor`${'No information about the sky'}(b,red/black)`);
    } else {
      console.log('sky:' + skyStatus);
    }

    const getTemp = (gradation = '') => {
      const value = object.main[gradation];
      return Math.round(value - 273);
    };

    const curr = 'Current temperature is:';
    const tempCurr = getTemp('temp');
    console.log(concolor`${curr}(b,blue) ${tempCurr + '°C'}(b,yellow)`);

    const feels = 'Feels like:';
    const tempFeels = getTemp('feels_like');
    console.log(concolor`${feels}(b,blue) ${tempFeels + '°C'}(b,yellow)`);

    const min = 'Min temperature for today is:';
    const tempMin = getTemp('temp_min');
    console.log(concolor`${min}(b,blue) ${tempMin + '°C'}(b,yellow)`);

    const max = 'Max temperature for today is:';
    const tempMax = getTemp('temp_max');
    console.log(concolor`${max}(b,blue) ${tempMax + '°C'}(b,yellow)`);

    const wind = 'Wind speed is:';
    const windSpeed = object.wind.speed;
    console.log(concolor`${wind}(b,green) ${windSpeed + 'm/s'}(b,yellow)`);

    process.exit(0);
  } else {
    console.log(concolor`${'Ooops,this city doesn`t exist,try again'}(b,red)`);

    input();
  }
};

input();
