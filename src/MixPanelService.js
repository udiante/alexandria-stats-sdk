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

module.exports.trackUserEvent = function (eventName, userDistintc, payload) {
    if (!mixPanel) {
        return
    }
    mixPanel.track(eventName, {distinct_id: userDistintc, payload})
}

module.exports.configureUserData = function (userDistinct, userData) {
    if (!mixPanel) {
        return
    }
    mixPanel.people.set(userDistinct, userData)
}