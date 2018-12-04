module.exports =
  stathat:
    email:    "you@example.com"
    prefix:   "sensorpush - "
  sensorpush:
    email:    "you@example.com"
    password: "smashw0rd"
  loop_ms: 60 * 1000 * 5 # every 5 mins lookup latest stats and post
  ignore_sensors_after_mins: 10 # if a sensor hasn't reported in X mins, don't post
  clusters: [
    {
      regex: /^.*Alcatraz.*$/
      name: 'Prison Alcatraz'
    }
    {
      regex: /^.*WH.*$/
      name: 'White House'
    }
  ]
