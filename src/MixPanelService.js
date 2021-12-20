var MixPanel = require('mixpanel')

var isInitialized = false

module.exports.init = function (MIXPANEL_TOKEN) {
    if(!MIXPANEL_TOKEN) {
        return
    }
    MixPanel = require('mixpanel')
    MixPanel.init(MIXPANEL_TOKEN, {
        host: "api-eu.mixpanel.com",
    })
    isInitialized = true
}

module.exports.trackEvent = function (eventName, userDistintc, payload) {
    if (!isInitialized) {
        return
    }
    MixPanel.track(eventName, {distinct_id: userDistintc, payload})
}

module.exports.configureUserData = function (userDistinct, userData) {
    MixPanel.people.set(userDistinct, userData)
}