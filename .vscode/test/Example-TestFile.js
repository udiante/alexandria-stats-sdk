const Index = require('../../index')
const Manager = Index.AlexandriaStatsManager.init('http://localhost:7000/api', 'developemt_env_env_1234wjroiqherio12ube12oiuehg12iou', 'AlexandriaSDKStatsAutoTEST')


function test() {
    Manager.sendTag("test_counter", "contador-pruebas")
    Manager.sendEvent("LOGGED_EVENT", { "hola": 1, caracola: 0 })
    Manager.sendUniqueEvent("LOGGED_UNIQUE_EVENT", "usuarioActivo", { 'unique': 0, event: 1243, "a": "aa" })
}

test()

for (let index = 0; index < 100; index++) {
    test()

}