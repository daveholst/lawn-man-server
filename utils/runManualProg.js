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
  console.log(runArray);
  return runArray;
};

const runManualProgram = async ({ property, stationNumber, fertRuntime }) => {
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
  try {
    const res = await axios.get(`${property.openSprinklerAddress}cr`, {
      params: {
        pw: property.openSprinklerKey,
        t: `${stationConverter(
          property.zones.length,
          stationNumber,
          fertRuntime
        )}`,
      },
    });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
  // set turn off after set time.
  // switch the valve back
  setTimeout(() => {
    mqttClient.publish(`${property.juiceBoxId}/relay1`, 'off');
  }, (Number(fertRuntime) - 360) * 1000);
};

module.exports = runManualProgram;
