# sensorpush-stathat

I recently wrote a [sensorpush npm module](https://www.npmjs.com/package/sensorpush) in vanilla Javascript. It allows you to access your SensorPush data from any Node app.

SensorPush is an excellent product of sensors (see http://www.sensorpush.com/), paired with a mobile app to track them. They're great for tracking the temp and/or humidity in your home, greenhouse, wherever, with no monthly fees, despite the cloud hosting. I even put one inside my fridge - which had been having issues - and it's tracking the temp.

*This repo* is a personal iced-coffee-script script I wrote to track all my own sensors and push the data to StatHat.com, which draws nice graphs and allows custom alerts. It lets you define "clusters" of sensors based on regular expressions. For example, let's say you have 2 homes and an office with sensors; you might like to track the average temp and humidity in each of your 3 locations, not just at a per-sensor level.

To use this script:

* `npm install -g iced-coffee-script` if you haven't already
* clone the repo
* copy `config.example.iced` to `config.iced` and edit the credentials
* `npm install`
* `iced index.iced`

# regular JS?

I personally prefer iced for my own personal projects, but I'll take a PR if someone wants to make a build step that compiles the iced.

