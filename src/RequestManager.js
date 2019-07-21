const axios = require('axios')

/**
 * @param {string} url Path of the GET request to perform 
 * @param {Object} queryParams Object with the query parameters
 * @returns {Object} Returns the response of the performed request, if undefined the request failed
 * @deprecated This function will be removed in future versions, please use 'getRequestWithError' 
 */
async function getRequest(url, queryParams) {
    var result = await getRequestWithError(url,queryParams)
    var response = result.response
    return response
}

/**
 * @param {string} url Path of the GET request to perform 
 * @param {Object} queryParams Object with the query parameters
 * @returns {Object} Returns the data field of the performed request, if undefined the request failed
 */
async function getRequestData(url, queryParams) {
    var result = await getRequestWithError(url,queryParams)
    var response = result.response
    if (response) {
        response = response.data
    }
    return response
}

const RequestResult = {
    response : undefined,
    error : undefined
}

/**
 * @param {string} url Path of the GET request to perform
 * @param {Object} queryParams Object with the query parameters
 * @returns {RequestResult} The request result with a 
 */
async function getRequestWithError(url, queryParams) {
    var result = Object.assign({}, RequestResult)
    try {
        var response = await axios.get(url, {
            params: queryParams
        })
        result.response = response
    } catch (error) {
        result.error = error
    }
    return result
}

module.exports = {
    RequestResultModel : RequestResult,
    getRequest: getRequest,
    getRequestData : getRequestData,
    getRequestWithError : getRequestWithError
}