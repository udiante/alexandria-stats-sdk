const AlexandriaStatsManager = require('./../AlexandriaStadisticsManager')
const ENABLE_LOGS = (process.env.ENABLE_DEBUG_LOGS == 'true')

const ALEXA_CONSTANT_EVENTS = {
    NO_LOCALE: 'NO_LOCALE',
    NO_APL_SUPORT = 'NO_APL_SUPPORTED',
    HAS_UNKNOWN_APL_SUPORT = 'UNKNOWN_APL_SUPPORTED'
}

const ALEX_EVENTS = {
    USER_START_INTENT: "USER_START_INTENT",
    INTENT_DEVICE_DATA: 'INTENT_DEVICE_DATA',
    USERS_RETENTION: 'USERS_RETENTION',
    CUSTOM_DATA: 'CUSTOM_DATA'
}

module.exports.init = function (alexandriaHost, alexandriaAPIkey, appIdentifier) {
    AlexandriaStatsManager.init(alexandriaHost, alexandriaAPIkey, appIdentifier)
}

module.exports.logStartIntent = function (intentHandler) {
    this.logIntentProperties(intentHandler)
    try {
        const userIdentifier = getUserIdentifier(intentHandler)
        if (userIdentifier) {
            AlexandriaStatsManager.logCounter(ALEX_EVENTS.USERS_RETENTION, userIdentifier)
            AlexandriaStatsManager.logUniqueEvent(ALEX_EVENTS.USER_START_INTENT, userIdentifier, {
                APL: getAPLDevice(intentHandler),
                LOCALE: getLocale(intentHandler)
            })
        }
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

module.exports.logIntentProperties = function (intentHandler) {
    try {
        AlexandriaStatsManager.logCounter(ALEX_EVENTS.INTENT_DEVICE_DATA, getAPLDevice(intentHandler))
        AlexandriaStatsManager.logCounter(ALEX_EVENTS.INTENT_DEVICE_DATA, getLocale(intentHandler))
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

module.exports.logValue = function (tag, event) {
    AlexandriaStatsManager.logCounter(tag || ALEX_EVENTS.CUSTOM_DATA, event)
}

function getUserIdentifier(intentHandler) {
    try {
        return obfuscateData(intentHandler.requestEnvelope.context.System.user.userId)
    } catch (error) {

    }
}

function getAPLDevice(intentHandler) {
    try {
        if (!intentHandler.intentData.supportsAPL) {
            return ALEXA_CONSTANT_EVENTS.NO_APL_SUPORT
        }
        return ALEXA_CONSTANT_EVENTS.HAS_UNKNOWN_APL_SUPORT
    } catch (error) {
        return ALEXA_CONSTANT_EVENTS.NO_APL_SUPORT
    }
}

function getLocale(intentHandler) {
    try {
        if (!intentHandler.intentData.locale) {
            return ALEXA_CONSTANT_EVENTS.NO_LOCALE
        }
        return intentHandler.intentData.locale
    } catch (error) {
        return ALEXA_CONSTANT_EVENTS.NO_LOCALE
    }
}