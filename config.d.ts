interface Config {
  stathat: {
    email: string
    prefix: string
  }
  sensorpush: {
    email: string
    password: string
  }
  loopMs: number
  ignoreSensorsAfterMins: number
  clusters: {
    regex: RegExp
    name: string
  }[]
}
declare const config: Config
export default config
