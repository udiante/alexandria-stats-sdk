# Alexandria Stats SDK

Package NPM para el uso de la funcionalidad de estadísticas de la API Alexandria.

# Versions

## 1.5.0 

Added Mixpanel SDK to Alexa Tracking (Beta)

- Added automatic Alexa event tracking providing the Mixpanel API KEY. 
*Optional* if provided the events will be sended to MixPanel

````javascript
AlexaStadisticManager.init(alexandriaHost, alexandriaAPIkey, appIdentifier, mixPanelToken)
````

- For a shared tracking Mixpanel project you can provide a Skill identifier
````javascript
AlexaStatsManager.ALEXA_SKILL_IDENTIFIER = 'SKILL_TEST'
````

# Usage

Required:
    - Alexandria endpoint
    - Valid Alexandria API KEY
    - Valid unique Application identifier

Example:

````javascript 
var StatsManager = AlexandriaStatsManager.init('http://localhost:7000/api','API_KEY_VERY_SECURE','UNIQUE_APPLICATION_IDENTIFIER')

// Increases the event "PRUEBA_ENVIO" under the TAG "PRUEBA SDK"
StatsManager.sendTag("PRUEBA_SDK", "PRUEBA_ENVIO")

// Increases the event "{evento:"NUEVO_EVENTO", id:1234}" under the TAG "PRUEBA SDK"
StatsManager.sendEvent("PRUEBA_SDK", {evento:"NUEVO_EVENTO", id:1234})

// Updates the event "USER_LOGGED" with the data "{evento:"NUEVO_EVENTO", id:1234}" under the TAG "PRUEBA SDK"
StatsManager.sendUniqueEvent("PRUEBA_SDK", "USER_LOGGED", {location:"123456", id:1234})

// Retrieves all the unique events, if provided you can filter based on the name (ie: "USER_LOGGED" with the data under the TAG "PRUEBA SDK")
async StatsManager.getUniqueEvents('PRUEBA_SDK', 'USER_LOGGED')
async StatsManager.getUniqueEvents('PRUEBA_SDK', 'USER_LOGGED')

````

NPM Import:
````javascript 
"alexandria-stats-sdk": "git://github.com:udiante/alexandria-stats-sdk#semver:^1.1.0"
"alexandria-stats-sdk": "file:./../alexandria-stats-sdk",
````

## ENV VARIABLES
ENABLE_DEBUG_LOGS: ["true"] prints console error logs