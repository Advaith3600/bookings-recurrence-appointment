/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var axios = require('axios');

/**
 * Attaches a given access token to a MS Graph API call
 * @param endpoint: REST API endpoint to call
 * @param accessToken: raw access token string
 */
async function fetch(endpoint, accessToken, method = 'GET', body = {}) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
    };

    console.log(`request made to ${endpoint} at: ` + new Date().toString());

    try {
        const response = method === 'GET' ? await axios.get(endpoint, options) : await axios.post(endpoint, body, options);
        return await response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Error response data:', JSON.stringify(error.response.data, null, 2));
            console.log('Error response status:', error.response.status);
            console.log('Error response headers:', JSON.stringify(error.response.headers, null, 2));
        } else if (error.request) {
            // The request was made but no response was received
            console.log('Error request data:', JSON.stringify(error.request, null, 2));
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error message:', error.message);
        }
        throw new Error(error);
    }
}

module.exports = fetch;
