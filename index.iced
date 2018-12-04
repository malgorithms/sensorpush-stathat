stathat          = require 'stathat'
https            = require 'https'
{make_esc}       = require 'iced-error'
sensorpush       = require 'sensorpush'
config           = require './config.iced'
stathat.useHTTPS = true

# ====================================================================

recordValue = (str, v) ->
  console.log "#{new Date()} StatHat value: #{v.toFixed(3)} : #{str}"
  stathat.trackEZValue config.stathat.email, "#{config.stathat.prefix}#{str}", v, ->

# ====================================================================

avg = (a) ->
  x = 0
  x += v for v in a
  x / a.length

# ====================================================================

one_loop = (_, cb) ->

  esc = make_esc cb, "one_loop"
  id_to_name_mapping = {}
  cluster_res = {}
  await sensorpush.api.oauth.authorize config.sensorpush, esc defer {authorization, apikey}
  await sensorpush.api.oauth.accesstoken {authorization}, esc defer {accesstoken}
  await sensorpush.api.devices.gateways {accesstoken}, esc defer res
  for gateway_name, info of res
    d = new Date(info.last_seen)
    mins = (Date.now() - d) / 60000
    recordValue "gateway - #{info.name} - last seen - minutes", mins

  await sensorpush.api.devices.sensors {accesstoken}, esc defer res
  for k, info of res
    id_to_name_mapping[k] = info.name
    recordValue "sensor - #{info.name} - battery voltage", info.battery_voltage

  startTime = new Date(new Date() - config.ignore_sensors_after_mins * 60 * 1000)
  await sensorpush.api.samples {accesstoken, limit: 1, startTime}, esc defer res
  console.log "Got #{Object.keys(res.sensors).length} sensors with data in the last #{config.ignore_sensors_after_mins} mins(s)"

  for k,v of res.sensors
    name = id_to_name_mapping[k]
    measurements = v[0]
    recordValue "sensor - #{name} - temperature", measurements.temperature
    recordValue "sensor - #{name} - humidity", measurements.humidity
    for cluster in config.clusters
      if cluster.regex.test(name)
        cluster_res[cluster.name] or= {humidities:[], temperatures:[]}
        cluster_res[cluster.name].humidities.push measurements.humidity
        cluster_res[cluster.name].temperatures.push measurements.temperature

  # finally report average cluster values
  for cluster_name, v of cluster_res
    recordValue "cluster - #{cluster_name} - avg. temperature", avg(v.temperatures)
    recordValue "cluster - #{cluster_name} - avg. humidity", avg(v.humidities)
    recordValue "cluster - #{cluster_name} - sensors reporting", v.temperatures.length

  cb null

# ====================================================================

main = (_, cb) ->
  while true
    await
      one_loop null, defer err
      setTimeout defer(), config.loop_ms
    if err? then console.error err

# ====================================================================

await main null, defer (err)
if err then console.error err else console.log "Success"
process.exit (if err? then 1 else 0)
