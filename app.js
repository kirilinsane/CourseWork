'use strict';

const concolor = require('concolor');
const axios = require('axios');

const greeting = () => {
  console.clear();
  console.log('Hi');
  console.log(concolor`${'Enter your city'}(b,red)`);
};

const getData = async cityName => {
  const API_KEY = '3bd68c313a18c02837369e027d9ac4bd';
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  let objectReq = {};
  await axios.get(URL)
    .then(res => {
      objectReq = res.data;
    })
    .catch(err => {
      objectReq = { err };
    });
  return objectReq;
};

const printInformation = object => {
  const visione = 'Visibility is';
  const currentVision = object.visibility;
  const skyStatus = object.weather.main;

  const getTemp = gradation => {
    const value = object.main[gradation];
    return Math.round(value - 273);
  };

  if (!currentVision) {
    console.log(concolor`${'Unknown visibility'}(b,red/black)`);
  } else {
    console.log(concolor`${visione}(b,green) ${currentVision + 'm'}(b,yellow)`);
  }
  if (!skyStatus) {
    console.log(concolor`${'No information about the sky'}(b,red/black)`);
  } else {
    console.log('sky:' + skyStatus);
  }

  const phrase1 = 'Current temperature is:';
  const currTemperature = getTemp('temp');
  console.log(concolor`${phrase1}(b,blue) ${currTemperature + '°C'}(b,yellow)`);

  const phrase2 = 'Feels like:';
  const feelTemperature = getTemp('feels_like');
  console.log(concolor`${phrase2}(b,blue) ${feelTemperature + '°C'}(b,yellow)`);

  const phrase3 = 'Min temperature for today is:';
  const minTemperature = getTemp('temp_min');
  console.log(concolor`${phrase3}(b,blue) ${minTemperature + '°C'}(b,yellow)`);

  const phrase4 = 'Max temperature for today is:';
  const maxTemperature = getTemp('temp_max');
  console.log(concolor`${phrase4}(b,blue) ${maxTemperature + '°C'}(b,yellow)`);

  const phrase5 = 'Wind speed is:';
  const windSpeed = object.wind.speed;
  console.log(concolor`${phrase5}(b,green) ${windSpeed + 'm/s'}(b,yellow)`);

  process.exit(0);
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
    printInformation(object);
  } else {
    console.log(concolor`${'Ooops,this city doesn`t exist,try again'}(b,red)`);
    input();
  }
};

greeting();
input();
