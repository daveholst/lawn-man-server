// TODO
// 20mins total, 14m fertigation, 6min flush
// juiceBox -> Change delivery valve to juiceBox
// openSprinkler -> start watering
// juiceBox -> Change dilvery back to bore
// openSprinler -> stop watering
const axios = require('axios').default;
const mqtt = require('mqtt');

const runManualProgram = (args) => {
  console.log('in RMP', args);
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
    mqttClient.subscribe(`${args.juiceBoxId}/#`, (err) => {
      if (!err) {
        mqttClient.publish(`${args.juiceBoxId}`, 'Server Online!');
      }
    });
  });

  // switch the valve to juicebox
  mqttClient.publish(`${args.juiceBoxId}/relay1`, 'on');

  // set turn off after set time.
  setTimeout(() => {
    mqttClient.publish(`${args.juiceBoxId}/relay1`, 'off');
  }, args.fertRuntime * 1000);
  // switch the valve back
};

module.exports = runManualProgram;
