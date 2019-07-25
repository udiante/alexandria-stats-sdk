const axios = require('axios')

var axiosInstance

var host
var apiKey
var appIdentifier

module.exports = function (ALEXANDRIA_HOST, ALEXANDRIA_API_KEY, APP_IDENTIFIER) {
    host = ALEXANDRIA_HOST
    apiKey = ALEXANDRIA_API_KEY
    appIdentifier = APP_IDENTIFIER

    axiosInstance = axios.create({
        baseURL: ALEXANDRIA_HOST + '/stats/',
        timeout: 500,
        headers: {
            'x-access-token': ALEXANDRIA_API_KEY,
            'x-no-response': true
        },
        params: {
            apiKey: ALEXANDRIA_API_KEY,
            application: APP_IDENTIFIER
        }
    });

    this.logCounter = function (tag, value) {
        sendTag(tag, value)
    }

    this.logEvent = function (tag, value) {
        sendEvent(tag, value)
    }

    this.logUniqueEvent = function(tag, uniqueIdentifier, value) {
        sendUniqueEvent(tag, uniqueIdentifier, value)
    }
    return this
}

// Exposed functionality

/**
 * 
 * @param {string} tagToSend 
 * @param {string} valueToSend 
 */
function sendTag(tagToSend, valueToSend) {
    if (tagToSend && valueToSend && appIdentifier) {
        try {
            axiosInstance.post('/count', {
                application: appIdentifier,
                tag: tagToSend,
                value: valueToSend
            })
        } catch (error) {
            if (process.env.ENABLE_DEBUG_LOGS) {
                console.error(error)
            }
        }
    }
}

/**
 * 
 * @param {string} tagToSend 
 * @param {string} valueToSend 
 */
function sendEvent(tagToSend, valueToSend) {
    if (tagToSend && valueToSend && appIdentifier) {
        try {
            axiosInstance.post('/event', {
                application: appIdentifier,
                tag: tagToSend,
                value: valueToSend
            })
        } catch (error) {
            if (process.env.ENABLE_DEBUG_LOGS) {
                console.error(error)
            }
        }
    }
}

/**
 * 
 * @param {string} tagToSend 
 * @param {string} uniqueIdentifierToSend 
 * @param {string} valueToSend 
 */
function sendUniqueEvent(tagToSend, uniqueIdentifierToSend, valueToSend) {
    if (tagToSend && uniqueIdentifierToSend && valueToSend && appIdentifier) {
        try {
            axiosInstance.post('/uniqueEvent', {
                application: appIdentifier,
                tag: tagToSend,
                uniqueIdentifier: uniqueIdentifierToSend,
                value: valueToSend
            })
        } catch (error) {
            if (process.env.ENABLE_DEBUG_LOGS) {
                console.error(error)
            }
        }
    }
}


// Private functionality