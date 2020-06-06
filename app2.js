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
        console.log(concolor`${'Visibility is'}(b,green) ${visibility + 'm'}(b,yellow)`);
      }
    };
    vis();

    const sky = () => {
      const sky =  object.weather.main;
      if (sky === undefined) {
        console.log(concolor`${'Can`t get information about the sky'}(b,red/black)`);
      }  else {
        console.log('sky:' + sky);
      }
    };
    sky();

    const temp = Math.round(object.main.temp - 273);
    console.log(concolor`${'Current temperature is:'}(b,blue) ${temp + '°C'}(b,yellow)`);

    const feelslike = Math.round(object.main.feels_like - 273);
    console.log(concolor`${'Feels like:'}(b,blue) ${feelslike + '°C'}(b,yellow)`);

    const getTemp = gradation => {
      const key = `temp_${gradation}`;
      const value = object.main[key];
      return Math.round(value - 273);
    };
    const minTemp = getTemp('min');
    console.log(concolor`${'Min temperature for today is:'}(b,blue) ${minTemp + '°C'}(b,yellow)`);

    const maxTemp = getTemp('max');
    console.log(concolor`${'Max temperature for today is:'}(b,blue) ${maxTemp + '°C'}(b,yellow)`);

    const wind = object.wind.speed;
    console.log(concolor`${'Wind speed is:'}(b,green) ${wind + 'm/s'}(b,yellow)`);

    process.exit(-1);
  } else {
    console.log(concolor`${'Ooops,this city doesn`t exist,try again'}(b,red)`);
    input();
  }
};
input();
