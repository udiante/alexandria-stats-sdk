var MixPanel = require('mixpanel')
var mixPanel

module.exports.init = function (MIXPANEL_TOKEN) {
    if(!MIXPANEL_TOKEN) {
        return
    }
    mixPanel = MixPanel.init(MIXPANEL_TOKEN, {
        host: "api-eu.mixpanel.com",
    })
}

module.exports.trackEvent = function(eventName, payload) {
    if (!mixPanel) {
        return
    }
    mixPanel.track(eventName, payload)
}

module.exports.trackUserEvent = function (eventName, userDistinct, payload) {
    if (!mixPanel) {
        return
    }
    var eventData = payload || {}
    eventData.distinct_id = userDistinct
    mixPanel.track(eventName, eventData)
}

module.exports.configureUserData = function (userDistinct, userData) {
    if (!mixPanel) {
        return
    }
    mixPanel.people.set(userDistinct, userData)
}

/**
 * Adds the properties defined witouth ignoring duplicates
 * @param {*} userDistinct User identifier
 * @param {*} userData An object with key: {values} o key: [Array]
 * @returns 
 */
module.exports.unionUserProperty = function (userDistinct, userData){
    if (!mixPanel) {
        return
    }
    mixPanel.people.union(userDistinct, userData)
}

/**
 * Increases a property for a user
 * @param {String} userDistinct User identifier
 * @param {String} property property name
 * @param {Number} amount *optional* The amount to increase (if not provided is 1)
 */
module.exports.incrementUserProperty = function (userDistinct, property, amount) {
    if (!mixPanel) {
        return
    }
    mixPanel.people.increment(userDistinct, property, amount);
}
