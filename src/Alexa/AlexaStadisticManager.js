const AlexandriaStatsManager = require('./../AlexandriaStadisticsManager')
const ENABLE_LOGS = (process.env.ENABLE_DEBUG_LOGS == 'true')

const ALEXA_CONSTANT_EVENTS = {
    NO_LOCALE: 'NO_LOCALE',
    NO_APL_SUPORT: 'NO_APL_SUPPORTED',
    HAS_UNKNOWN_APL_SUPORT: 'UNKNOWN_APL_SUPPORTED'
}

const ALEX_EVENTS = {
    USER_START_INTENT: 'USER_START_INTENT',
    INTENT_DEVICE_DATA: 'INTENT_DEVICE_DATA',
    USERS_RETENTION: 'USERS_RETENTION',
    CUSTOM_DATA: 'CUSTOM_DATA',
    INTENT_USAGE: 'INTENT_USAGE',
    APL_SUPPORT: 'INTENT_APL_SUPPORT',
    LOCALES: 'INTENT_LOCALES'
}

module.exports.init = function (alexandriaHost, alexandriaAPIkey, appIdentifier) {
    AlexandriaStatsManager.init(alexandriaHost, alexandriaAPIkey, appIdentifier)
}

module.exports.logStartIntent = function (intentHandler) {
    this.logIntentProperties(intentHandler)
    try {
        const userIdentifier = getUserIdentifier(intentHandler)
        if (userIdentifier) {
            // AlexandriaStatsManager.sendTag(ALEX_EVENTS.USERS_RETENTION, userIdentifier)
            AlexandriaStatsManager.sendUniqueEvent(ALEX_EVENTS.USER_START_INTENT, userIdentifier, prepareUserStartData(intentHandler))
        }
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

module.exports.logIntentProperties = function (intentHandler) {
    try {
        AlexandriaStatsManager.sendTag(ALEX_EVENTS.APL_SUPPORT, getAPLDevice(intentHandler))
        AlexandriaStatsManager.sendTag(ALEX_EVENTS.LOCALES, getLocale(intentHandler))
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

module.exports.logValue = function (tag, event) {
    AlexandriaStatsManager.sendTag(tag || ALEX_EVENTS.CUSTOM_DATA, event)
}

/** 
 * Logs an intent
 */
module.exports.logIntentUsage = function (intentIdentifier) {
    AlexandriaStatsManager.sendTag(ALEX_EVENTS.INTENT_USAGE, intentIdentifier)
}

function getUserIdentifier(intentHandler) {
    try {
        return obfuscateData(intentHandler.requestEnvelope.context.System.user.userId)
    } catch (error) {

    }
}

const crypto = require('crypto')
function obfuscateData(string) {
    return crypto.createHash('sha1').update(string).digest("base64")
}

function getAPLDevice(intentHandler) {
    try {
        if (hasAPL(intentHandler)) {
            return getAPLDeviceIdentifier(intentHandler)
        }
        return ALEXA_CONSTANT_EVENTS.NO_APL_SUPORT
    } catch (error) {
        return ALEXA_CONSTANT_EVENTS.NO_APL_SUPORT
    }
}

function hasAPL(intentHandler) {
    var posibleData = intentHandler.intentData.supportsAPL || intentHandler.intentData.suportsAPL || intentHandler.intentData.APL
    if (posibleData == undefined || !posibleData) {
        return false
    }
    return true
}

function getAPLDeviceIdentifier(intentHandler) {
    try {
        const hwdData = getAPLViewPortHardwareSpecs(intentHandler)
        if (hwdData) {
            return 'shape:'+hwdData.shape+'|w:'+hwdData.pixelWidth+'px|h:'+hwdData.pixelHeight+'px|dpi:'+hwdData.dpi
        }
    } catch (error) {
        return ALEXA_CONSTANT_EVENTS.HAS_UNKNOWN_APL_SUPORT
    }
}

function getAPLViewPortHardwareSpecs(intentHandler) {
    try {
        const viewPort = intentHandler.requestEnvelope.context.Viewport
        return {
            shape: viewPort['shape'],
            pixelWidth: viewPort['pixelWidth'],
            pixelHeight: viewPort['pixelHeight'],
            dpi: viewPort['dpi']
        }
    } catch (error) {
        
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

function prepareUserStartData(intentHandler) {
    var userData = {
        LOCALE: getLocale(intentHandler),
        hasAPL: false
    }
    try {
        userData.hasAPL = hasAPL(intentHandler) || false
        if (userData.hasAPL) {
            userData['APL_DEVICE'] = getAPLDevice(intentHandler)
        }
    } catch (error) {
        
    }
    return userData
}