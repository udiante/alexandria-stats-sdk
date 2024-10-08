const AlexandriaStatsManager = require('./../AlexandriaStadisticsManager')
const MixpanelService = require('./../MixPanelService')
const ENABLE_LOGS = (process.env.ENABLE_DEBUG_LOGS == 'true')

const ALEXA_CONSTANT_EVENTS = {
    NO_LOCALE: 'NO_LOCALE',
    NO_APL_SUPORT: 'NO_APL_SUPPORTED',
    HAS_UNKNOWN_APL_SUPORT: 'UNKNOWN_APL_SUPPORTED'
}

const ALEX_EVENTS = {
    USER_START_INTENT: 'USER_START_INTENT',
    USER_END_INTENT: 'USER_END_INTENT',
    USER_ERROR_INTENT: 'USER_ERROR_INTENT',
    USER_INTENT: 'USER_INTENT',
    INTENT_DEVICE_DATA: 'INTENT_DEVICE_DATA',
    USERS_RETENTION: 'USERS_RETENTION',
    CUSTOM_DATA: 'CUSTOM_DATA',
    INTENT_USAGE: 'INTENT_USAGE',
    APL_SUPPORT: 'INTENT_APL_SUPPORT',
    LOCALES: 'INTENT_LOCALES',
    ALEXA_RESPONSE: 'ALEXA_RESPONSE'
}

module.exports.ALEXA_SKILL_IDENTIFIER

var IS_MIXPANEL_CONFIGURED = false
module.exports.initMixPanel = function (mixPanelToken) {
    MixpanelService.init(mixPanelToken)
    IS_MIXPANEL_CONFIGURED = true
}

const GA = require('../GoogleAnalyticsService')

module.exports.initGoogleAnalytics = function (measurementId, apiSecret) {
    if (measurementId && apiSecret) {
        GA.init(measurementId, apiSecret)
    }
}

var IS_ALEXANDRIA_CONFIGURED = false
module.exports.init = function (alexandriaHost, alexandriaAPIkey, appIdentifier) {
    AlexandriaStatsManager.init(alexandriaHost, alexandriaAPIkey, appIdentifier)
    IS_ALEXANDRIA_CONFIGURED = true
}

module.exports.logStartIntent = function (intentHandler) {
    this.logIntentProperties(intentHandler)
    try {
        const userIdentifier = getUserIdentifier(intentHandler)
        if (userIdentifier) {
            var eventData = prepareUserStartData(intentHandler)
            if (IS_MIXPANEL_CONFIGURED) {
                MixpanelService.configureUserData(userIdentifier, {
                    "country": getUserLocation(eventData.LOCALE),
                    "locale": eventData.LOCALE,
                    "lastAPL_DEVICE": eventData.APL_DEVICE,
                    "hasAPL": eventData.hasAPL,
                    "lastSkill": module.exports.ALEXA_SKILL_IDENTIFIER
                })
                MixpanelService.unionUserProperty(userIdentifier, {
                    "APL_DEVICES": eventData.APL_DEVICE,
                    "SKILLS": module.exports.ALEXA_SKILL_IDENTIFIER,
                    "LOCALES": eventData.LOCALE
                })
                MixpanelService.incrementUserProperty(userIdentifier, 'recurrence')
                MixpanelService.trackUserEvent(ALEX_EVENTS.USER_START_INTENT, userIdentifier, eventData)
            }
            eventData.type = "START"
            sendToGA(ALEX_EVENTS.USER_START_INTENT, intentHandler, eventData)
            if (IS_ALEXANDRIA_CONFIGURED) {
                AlexandriaStatsManager.sendUniqueEvent(ALEX_EVENTS.USER_START_INTENT, userIdentifier, eventData)
            }
        }
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

async function sendToGA(eventName, intentHandler, eventData) {
    const userIdentifier = getUserIdentifier(intentHandler)
    if (GA.isInitialized() && userIdentifier) {
        var eventData = prepareUserStartData(intentHandler)
        const userData = {
            locale: eventData.LOCALE,
            country: getUserLocation(eventData.LOCALE),
            hasAPL: eventData.hasAPL,
        }
        delete eventData.LOCALE;
        delete eventData.hasAPL;
        delete eventData.SLOTS;
        delete eventData.speechOut;
        delete eventData.reprompt;
        delete eventData.mp_lib;
        delete eventData.$lib_version;
        delete eventData.distinct_id;
        GA.sendEvent(eventName.replace('AMAZON.', ''), userIdentifier, userData, eventData)
    }
}

function getUserLocation(locale) {
    try {
        return locale.split('-')[1]
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

// MARK: MIXPANEL Events

module.exports.logUserEndIntent = function (intentHandler, intentName) {
    if (!IS_MIXPANEL_CONFIGURED) return
    try {
        const userIdentifier = getUserIdentifier(intentHandler)
        if (userIdentifier) {
            var eventData = prepareUserStartData(intentHandler)
            eventData.INTENT_NAME = intentName
            eventData.TYPE = 'END'
            MixpanelService.trackUserEvent(ALEX_EVENTS.USER_END_INTENT, userIdentifier, eventData)
            sendToGA(ALEX_EVENTS.USER_END_INTENT, intentHandler, eventData)
        }
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

module.exports.logUserError = function (intentHandler, error) {
    if (!IS_MIXPANEL_CONFIGURED) return
    try {
        const userIdentifier = getUserIdentifier(intentHandler)
        if (userIdentifier) {
            var eventData = prepareUserStartData(intentHandler)
            try {
                eventData.error = JSON.stringify(error)
            } catch (error) {

            }
            MixpanelService.trackUserEvent(ALEX_EVENTS.USER_ERROR_INTENT, userIdentifier, eventData)
            eventData.TYPE = 'ERROR'
            sendToGA(ALEX_EVENTS.USER_ERROR_INTENT, intentHandler, eventData)
        }
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

module.exports.logUserIntent = function (intentHandler) {
    if (!IS_MIXPANEL_CONFIGURED) return
    try {
        const userIdentifier = getUserIdentifier(intentHandler)
        if (userIdentifier) {
            var eventData = prepareUserStartData(intentHandler)
            eventData.INTENT_NAME = intentHandler.intentData.intentName
            MixpanelService.trackUserEvent(ALEX_EVENTS.USER_INTENT, userIdentifier, eventData)
            eventData.TYPE = 'USER_INTENT'
            sendToGA(eventData.INTENT_NAME, intentHandler, eventData)
        }
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

function prepareIntentSlots(intentHandler) {
    try {
        return intentHandler.requestEnvelope.request.intent.slots
    } catch (error) {

    }
}

module.exports.logUserCustomEvent = function (intentHandler, eventName, eventData) {
    if (!IS_MIXPANEL_CONFIGURED) return
    try {
        const userIdentifier = getUserIdentifier(intentHandler)
        if (userIdentifier) {
            const baseEventData = prepareUserStartData(intentHandler)
            var eventPayload = Object.assign({}, baseEventData, eventData || {})
            MixpanelService.trackUserEvent(eventName, userIdentifier, eventPayload)
            eventPayload.type = "CUSTOM"
            sendToGA(eventName, intentHandler, eventPayload)
        }
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

module.exports.logCustomEvent = function (profileDistinctId, eventName, eventData) {
    if (!IS_MIXPANEL_CONFIGURED) return
    try {
        MixpanelService.trackUserEvent(eventName, profileDistinctId, eventData)
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

// MARK: Alexandria Events

module.exports.logIntentProperties = function (intentHandler) {
    try {
        const locale = getLocale(intentHandler)
        const aplDevice = getAPLDevice(intentHandler)
        AlexandriaStatsManager.sendTag(ALEX_EVENTS.APL_SUPPORT, aplDevice)
        AlexandriaStatsManager.sendTag(ALEX_EVENTS.LOCALES, locale)

        // const userIdentifier = getUserIdentifier(intentHandler)

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
 * @deprecated DO NOT USE
 */
module.exports.logIntentUsage = function (intentIdentifier) {
    AlexandriaStatsManager.sendTag(ALEX_EVENTS.INTENT_USAGE, intentIdentifier)
    MixpanelService.trackEvent(ALEX_EVENTS.INTENT_USAGE, { INTENT_NAME: intentIdentifier })
}

// MARK: Private functions

function getUserIdentifier(intentHandler) {
    try {
        return obfuscateData(intentHandler.requestEnvelope.context.System.user.userId)
    } catch (error) {

    }
}

module.exports.getUserIdentifierFromIntentHandler = function (intentHandler) {
    return getUserIdentifier(intentHandler)
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
        if (ENABLE_LOGS) {
            console.log(error)
        }
        return ALEXA_CONSTANT_EVENTS.NO_APL_SUPORT
    }
}

function hasAPL(intentHandler) {
    var posibleData = intentHandler.intentData.supportsAPL || intentHandler.intentData.suportsAPL || intentHandler.intentData.APL
    if (posibleData == undefined || !posibleData) {
        return false
    }
    return true
}

function getAPLDeviceIdentifier(intentHandler) {
    try {
        const hwdData = getAPLViewPortHardwareSpecs(intentHandler)
        if (hwdData) {
            return 'shape:' + hwdData.shape + '|w:' + hwdData.pixelWidth + 'px|h:' + hwdData.pixelHeight + 'px|dpi:' + hwdData.dpi
        }
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
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
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }
}

function getLocale(intentHandler) {
    try {
        if (!intentHandler.intentData.locale) {
            return ALEXA_CONSTANT_EVENTS.NO_LOCALE
        }
        return intentHandler.intentData.locale
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
        return ALEXA_CONSTANT_EVENTS.NO_LOCALE
    }
}

function prepareUserStartData(intentHandler) {
    var userData = intentHandler.trackingData || {} // initialize the object with the specific tracking data provided in the intentHandler

    userData.LOCALE = getLocale(intentHandler)
    userData.hasAPL = false
    userData.session = intentHandler.requestEnvelope.session.sessionId
    if (intentHandler.trackingData) {
        // Add calculated properties
        userData.SLOTS = prepareIntentSlots(intentHandler)
    }

    if (module.exports.ALEXA_SKILL_IDENTIFIER) {
        userData.SKILL = module.exports.ALEXA_SKILL_IDENTIFIER
    }

    try {
        userData.hasAPL = hasAPL(intentHandler) || false
        if (userData.hasAPL) {
            userData.APL_DEVICE = getAPLDevice(intentHandler)
        }
    } catch (error) {
        if (ENABLE_LOGS) {
            console.log(error)
        }
    }

    return userData
}