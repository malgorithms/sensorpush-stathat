# sensorpush-stathat

I recently wrote a [https://www.npmjs.com/package/sensorpush](sensorpush npm module) in vanilla Javascript. It allows you to access your SensorPush data from any Node app.

SensorPush is an excellent product of sensors (see http://www.sensorpush.com/), paired with a mobile app to track them. They're excellent for tracking the temp and/or humidity in your home, greenhouse, wherever. I even put one inside my fridge, and it's tracking the temp.

This repo is a personal iced-coffee-script script I wrote to track all my own sensors and push the data to StatHat.com, which draws nice graphs and allows custom alerts.

To use this script:

* `npm install -g iced-coffee-script` if you haven't already
* clone the repo
* copy `config.example.iced` to `config.iced` and edit the credentials
* `npm install`
* `iced index.iced`

I prefer iced for my personal projects, but I'll take a PR if someone wants to make a build step that compiles the iced.
