# sensorpush-stathat

I recently wrote a [sensorpush npm module](https://www.npmjs.com/package/sensorpush) in vanilla Javascript. It allows you to access your SensorPush data from any Node app.

SensorPush is an excellent product of sensors (see http://www.sensorpush.com/), paired with a mobile app to track them. They're great for tracking the temp and/or humidity in your home, greenhouse, wherever, with no monthly fees, despite the cloud hosting. I even put one inside my fridge - which had been having issues - and it's tracking the temp.

StatHat is a great service for tracking data, counters and values. It lets you manage individual stats, smart alerts, and dashboards.

_This repo_ is a personal script I wrote to track all my own sensors and push the data to StatHat.com, which draws nice graphs and allows custom alerts. It lets you define "clusters" of sensors based on regular expressions. For example, let's say you have 2 homes and an office with sensors; you might like to track the average temp and humidity in each of your 3 locations, not just at a per-sensor level.

![](https://github.com/malgorithms/sensorpush-stathat/raw/master/media/stathat.png)

To use this script:

- clone the repo
- copy `config.example.js` to `config.js` and edit the credentials
- `npm install` (or `yarn`)
- `node index.js`
