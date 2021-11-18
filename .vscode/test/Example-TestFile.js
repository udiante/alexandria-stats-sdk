const Index = require('../../index')
const Manager = Index.AlexandriaStatsManager.init('http://localhost:7000/api', 'developemt_env_env_1234wjroiqherio12ube12oiuehg12iou', 'AlexandriaSDKStatsAutoTEST')


async function test() {
    Manager.sendTag("test_counter", "contador-pruebas")
    Manager.sendEvent("LOGGED_EVENT", { "hola": 1, caracola: 0 })
    Manager.sendUniqueEvent("LOGGED_UNIQUE_EVENT", "usuarioActivo", { 'unique': 0, event: 1243, "a": "aa" })
    const allEvents = await Manager.getUniqueEvents()
    console.log(allEvents)
    const activeUserEvent = await Manager.getUniqueEvents("LOGGED_UNIQUE_EVENT", "usuarioActivo")
    console.log(activeUserEvent)
}

test()

for (let index = 0; index < 100; index++) {
    //test()

}