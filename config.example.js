const config = {
  stathat: {
    email: 'foo1@gmail.com',
    prefix: 'sensorpush - ',
  },
  sensorpush: {
    email: 'foo2@gmail.com',
    password: 'somep@ss'',
  },
  loopMs: 5 * 60 * 1000,
  ignoreSensorsAfterMins: 15, // if a sensor hasn't reported in X mins, don't post
  clusters: [
    {
      regex: /^.*Dreadfort.*$/,
      name: 'House Bolton',
    },
    {
      regex: /^.*13F.*$/,
      name: 'Apartment 13F',
    },
  ],
}

module.exports = config
