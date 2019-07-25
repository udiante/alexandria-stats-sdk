const Index = require('../../index')
const Manager = Index.AlexandriaStatsManager('http://localhost:7000/api', 'developemt_env_env_1234wjroiqherio12ube12oiuehg12iou', 'AlexandriaSDKStatsAutoTEST')
const assert = require('assert')


function test() {
    Manager.logCounter("test_counter", "contador-pruebas")
    Manager.logEvent("LOGGED_EVENT", { "hola": 1, caracola: 0 })
    Manager.logUniqueEvent("LOGGED_UNIQUE_EVENT", "usuarioActivo", { 'unique': 0, event: 1243, "a": "aa" })
}

test()

for (let index = 0; index < 100; index++) {
    // test()

}