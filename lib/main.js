"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stathat_1 = __importDefault(require("stathat"));
const sensorpush_1 = require("sensorpush");
const config_1 = __importDefault(require("../config"));
stathat_1.default.useHTTPS = true;
function recordValue(s, v) {
    console.log(`${new Date()} StatHat value: ${v.toFixed(3)} : ${s}`);
    stathat_1.default.trackEZValue(config_1.default.stathat.email, `${config_1.default.stathat.prefix}${s}`, v, function () {
        /* noop */
    });
}
function avg(a) {
    let x = 0;
    a.forEach((v) => (x += v));
    return x / a.length;
}
function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
async function oneLoop() {
    var _a;
    const idToName = {};
    const clusterRes = {};
    const { authorization } = await sensorpush_1.api.oauth.authorize(config_1.default.sensorpush.email, config_1.default.sensorpush.password);
    const { accesstoken } = await sensorpush_1.api.oauth.accesstoken(authorization);
    const gateways = await sensorpush_1.api.devices.gateways(accesstoken);
    const sensors = await sensorpush_1.api.devices.sensors(accesstoken);
    const startTime = new Date(Date.now() - config_1.default.ignoreSensorsAfterMins * 60 * 1000);
    const sampleRes = await sensorpush_1.api.samples(accesstoken, startTime, 1);
    console.log(`Got ${Object.keys(sampleRes.sensors).length} sensors with data in the last ${config_1.default.ignoreSensorsAfterMins} mins(s)`);
    for (const sensorId in sensors) {
        const info = sensors[sensorId];
        idToName[sensorId] = info.name;
        recordValue(`sensor - ${info.name} - battery voltage`, info.battery_voltage);
    }
    for (const gatewayName in gateways) {
        const info = gateways[gatewayName];
        const d = new Date(info.last_seen).getTime();
        const mins = (Date.now() - d) / 60000;
        recordValue(`gateway - ${info.name} - last seen - minutes`, mins);
    }
    for (const sensorId in sampleRes.sensors) {
        const name = idToName[sensorId];
        const measurements = sampleRes.sensors[sensorId][0];
        recordValue(`sensor - ${name} - temperature`, measurements.temperature);
        recordValue(`sensor - ${name} - humidity`, measurements.humidity);
        for (const cluster of config_1.default.clusters) {
            if (cluster.regex.test(name)) {
                clusterRes[_a = cluster.name] || (clusterRes[_a] = { humidities: [], temperatures: [] });
                clusterRes[cluster.name].humidities.push(measurements.humidity);
                clusterRes[cluster.name].temperatures.push(measurements.temperature);
            }
        }
    }
    // Finally, report averages for clusters
    for (const clusterName of Object.keys(clusterRes)) {
        const v = clusterRes[clusterName];
        recordValue(`cluster - ${clusterName} - avg. temperature`, avg(v.temperatures));
        recordValue(`cluster - ${clusterName} - avg. humidity`, avg(v.humidities));
        recordValue(`cluster - ${clusterName} - sensors reporting`, v.temperatures.length);
    }
}
async function main() {
    while (true) {
        try {
            await oneLoop();
        }
        catch (err) {
            console.error(new Date(), err);
        }
        await timeout(config_1.default.loopMs);
    }
}
main();
