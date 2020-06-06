'use strict';

console.clear();
const concolor = require('concolor');
const axios = require('axios');

console.log('Hi');
console.log(concolor`${'Enter your city'}(b,red)`);

const getData = async cityName => { // functioin for getting data
  const API_KEY = '3bd68c313a18c02837369e027d9ac4bd';
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  let object = {};

  await axios.get(URL)
    .then(res => {
      object  = res.data;
    })
    .catch(err => {
      object = { err };
    });
  return object;
};
// async  function for working with promises

const input = async () => {
  const stdin = process.openStdin();
  const cityName = await new Promise(resolve => {
    stdin.addListener('data', d => {
      resolve(d.toString().trim());
    });
  });

  const object = await getData(cityName);

  if (!object.err) {
    const vis = () => {
      const visibility =  object.visibility;
      if (visibility === undefined) {
        console.log(concolor`${'Unknown visibility'}(b,red/black)`);
      }    else {
        const vis = 'Visibility is';
        console.log(concolor`${vis}(b,green) ${visibility + 'm'}(b,yellow)`);
      }
    };
    vis();

    const sky = () => {
      const sky =  object.weather.main;
      if (sky === undefined) {
        console.log(concolor`${'No information about the sky'}(b,red/black)`);
      }  else {
        console.log('sky:' + sky);
      }
    };
    sky();

    const cur = 'Current temperature is:';
    const temp = Math.round(object.main.temp - 273);
    console.log(concolor`${cur}(b,blue) ${temp + '°C'}(b,yellow)`);

    const feels = 'Feels like:';
    const feelslike = Math.round(object.main.feels_like - 273);
    console.log(concolor`${feels}(b,blue) ${feelslike + '°C'}(b,yellow)`);

    const getTemp = gradation => {
      const key = `temp_${gradation}`;
      const value = object.main[key];
      return Math.round(value - 273);
    };

    const min = 'Min temperature for today is:';
    const minTemp = getTemp('min');
    console.log(concolor`${min}(b,blue) ${minTemp + '°C'}(b,yellow)`);

    const max = 'Max temperature for today is:';
    const maxTemp = getTemp('max');
    console.log(concolor`${max}(b,blue) ${maxTemp + '°C'}(b,yellow)`);

    const winds = 'Wind speed is:';
    const wind = object.wind.speed;
    console.log(concolor`${winds}(b,green) ${wind + 'm/s'}(b,yellow)`);

    process.exit(0);
  } else {
    console.log(concolor`${'Ooops,this city doesn`t exist,try again'}(b,red)`);
    input();
  }
};
input();
