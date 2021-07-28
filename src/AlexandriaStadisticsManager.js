const axios = require('axios')

var axiosInstance

var ALEXANDRIA_ENDPOINT
var ALEXANDRIA_API_KEY
var APP_IDENTIFIER


module.exports.init = function (alexandriaHost, alexandriaAPIkey, appIdentifier) {
    ALEXANDRIA_ENDPOINT = alexandriaHost + '/stats'
    ALEXANDRIA_API_KEY = alexandriaAPIkey
    APP_IDENTIFIER = appIdentifier

    axiosInstance = axios.create({
        baseURL: ALEXANDRIA_ENDPOINT,
        timeout: 1000,
        headers: {
            'x-access-token': alexandriaAPIkey,
            'x-no-response': true
        },
        params: {
            apiKey: alexandriaAPIkey,
            application: APP_IDENTIFIER
        }
    });

    return module.exports
}

// Exposed functionality

/**
 * Sends a tag as a counter under the defined tag
 * @param {string} tagToSend 
 * @param {string} valueToSend 
 */
module.exports.sendTag = function sendTag(tagToSend, valueToSend) {
    if (tagToSend && valueToSend && APP_IDENTIFIER) {
        try {
            axiosInstance.post('/count', {
                application: APP_IDENTIFIER,
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
 * Sends a object under the defined tag
 * @param {string} tagToSend 
 * @param {string} valueToSend 
 */
module.exports.sendEvent = function sendEvent(tagToSend, valueToSend) {
    if (tagToSend && valueToSend && APP_IDENTIFIER) {
        try {
            axiosInstance.post('/event', {
                application: APP_IDENTIFIER,
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
 * Sends a object under the defined tag, that will be stored without duplicates
 * @param {string} tagToSend 
 * @param {string} uniqueIdentifierToSend 
 * @param {string} valueToSend 
 */
module.exports.sendUniqueEvent = function sendUniqueEvent(tagToSend, uniqueIdentifierToSend, valueToSend) {
    if (tagToSend && uniqueIdentifierToSend && valueToSend && APP_IDENTIFIER) {
        try {
            axiosInstance.post('/uniqueEvent', {
                application: APP_IDENTIFIER,
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

module.exports.getUniqueEvents = async function(tag, uniqueIdentifier) {
    var response
    try {
        var uniqueEvents = await axiosInstance.get('/uniqueEvent', {
            application: APP_IDENTIFIER
        })
        if (uniqueEvents && uniqueEvents.data) {
            uniqueEvents = uniqueEvents.data
            if (tag) {
                response = uniqueEvents[tag]
                if (uniqueIdentifier && response) {
                    response = response[uniqueIdentifier]
                }
            }
            else {
                response = uniqueEvents
            }
        }
    } catch (error) {
        if (process.env.ENABLE_DEBUG_LOGS) {
            console.error(error)
        }
    }
    return response
}

// Private functionality