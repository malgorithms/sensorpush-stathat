import stathat from 'stathat'
import {api as sensorpush} from 'sensorpush'
import config from '../config'
stathat.useHTTPS = true

function recordValue(s: string, v: number) {
  console.log(`${new Date()} StatHat value: ${v.toFixed(3)} : ${s}`)
  stathat.trackEZValue(config.stathat.email, `${config.stathat.prefix}${s}`, v, function () {
    /* noop */
  })
}

function avg(a: number[]): number {
  let x = 0
  a.forEach((v) => (x += v))
  return x / a.length
}

function timeout(ms: number): Promise<void> {
  return new Promise((resolve): void => {
    setTimeout((): void => {
      resolve()
    }, ms)
  })
}

async function oneLoop() {
  const idToName: {[k: string]: string} = {}
  const clusterRes: {[k: string]: {humidities: number[]; temperatures: number[]}} = {}
  const {authorization} = await sensorpush.oauth.authorize(config.sensorpush.email, config.sensorpush.password)
  const {accesstoken} = await sensorpush.oauth.accesstoken(authorization)
  const gateways = await sensorpush.devices.gateways(accesstoken)
  const sensors = await sensorpush.devices.sensors(accesstoken)
  const startTime = new Date(Date.now() - config.ignoreSensorsAfterMins * 60 * 1000)
  const sampleRes = await sensorpush.samples(accesstoken, startTime, 1)
  console.log(`Got ${Object.keys(sampleRes.sensors).length} sensors with data in the last ${config.ignoreSensorsAfterMins} mins(s)`)

  for (const sensorId in sensors) {
    const info = sensors[sensorId]
    idToName[sensorId] = info.name
    recordValue(`sensor - ${info.name} - battery voltage`, info.battery_voltage)
  }

  for (const gatewayName in gateways) {
    const info = gateways[gatewayName]
    const d = new Date(info.last_seen).getTime()
    const mins = (Date.now() - d) / 60000
    recordValue(`gateway - ${info.name} - last seen - minutes`, mins)
  }

  for (const sensorId in sampleRes.sensors) {
    const name = idToName[sensorId]
    const measurements = sampleRes.sensors[sensorId][0]
    recordValue(`sensor - ${name} - temperature`, measurements.temperature)
    recordValue(`sensor - ${name} - humidity`, measurements.humidity)
    for (const cluster of config.clusters) {
      if (cluster.regex.test(name)) {
        clusterRes[cluster.name] ||= {humidities: [], temperatures: []}
        clusterRes[cluster.name].humidities.push(measurements.humidity)
        clusterRes[cluster.name].temperatures.push(measurements.temperature)
      }
    }
  }

  // Finally, report averages for clusters
  for (const clusterName of Object.keys(clusterRes)) {
    const v = clusterRes[clusterName]
    recordValue(`cluster - ${clusterName} - avg. temperature`, avg(v.temperatures))
    recordValue(`cluster - ${clusterName} - avg. humidity`, avg(v.humidities))
    recordValue(`cluster - ${clusterName} - sensors reporting`, v.temperatures.length)
  }
}

async function main() {
  while (true) {
    try {
      await oneLoop()
    } catch (err) {
      console.error(new Date(), err)
    }
    await timeout(config.loopMs)
  }
}
main()
