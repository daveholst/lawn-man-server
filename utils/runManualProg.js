// TODO
// 20mins total, 14m fertigation, 6min flush
// juiceBox -> Change delivery valve to juiceBox
// openSprinkler -> start watering
// juiceBox -> Change dilvery back to bore
// openSprinler -> stop watering
const axios = require('axios').default;
const mqtt = require('mqtt');

const stationConverter = (stnCount, stationNum, time) => {
  // build array
  const runArray = new Array(stnCount).fill(0);
  runArray.fill(Number(time), Number(stationNum) - 1, Number(stationNum));
  // for (let i = 0; i < stnCount; i++) {
  //   if (i + 1 === Number(stationNum)) {
  //     runArray.push(Number(time));
  //   } else {
  //     runArray.push(0);
  //   }
  // }
  return runArray;
};

const runManualProgram = ({ property, stationNumber, fertRuntime }) => {
  console.log('in RMP', property.zones.length);
  console.log(stationConverter(16, stationNumber, fertRuntime));

  // change master valve to juicebox
  // setup mqtt client
  const mqttClient = mqtt.connect(
    process.env.MQTTSERVER || 'mqtt://10.104.0.3',
    {
      username: process.env.MQTTUSR,
      password: process.env.MQTTPWD,
    }
  );

  mqttClient.on('connect', () => {
    mqttClient.subscribe(`${property.juiceBoxId}/#`, (err) => {
      if (!err) {
        mqttClient.publish(`${property.juiceBoxId}`, 'Server Online!');
      }
    });
  });

  // switch the valve to juicebox
  mqttClient.publish(`${property.juiceBoxId}/relay1`, 'on');
  // start opensprinkler

  // set turn off after set time.
  setTimeout(() => {
    mqttClient.publish(`${property.juiceBoxId}/relay1`, 'off');
  }, fertRuntime * 1000);
  // switch the valve back
};

module.exports = runManualProgram;
