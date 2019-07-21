
module.exports.AlexandriaStatsManager = require('./src/AlexandriaStadisticsManager')

var Manager = new this.AlexandriaStatsManager('http://localhost:7000/api','alex1234','PRUBEAS-SDK')
Manager.logCounter("PRUEBA_SDK", "PROBADO")
Manager.logEvent("PRUEBA_SDK", {evento:"NUEVO_EVENTO", id:1234})
Manager.logUniqueEvent("PRUEBA_SDK", "USER_LOGGED", {location:"123456", id:1234})