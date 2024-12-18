/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config({ path: '.env.dev' });

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: process.env.CLOUD_INSTANCE + process.env.TENANT_ID, // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
        clientSecret: process.env.CLIENT_SECRET // Client secret generated from the app registration in Azure portal
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
}

const REDIRECT_URI = process.env.REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI;
const GRAPH_ME_ENDPOINT = process.env.GRAPH_API_ENDPOINT + "v1.0/me";
const GRAPH_STAFF_ENDPOINT = process.env.GRAPH_API_ENDPOINT + 'v1.0/solutions/bookingBusinesses/' + process.env.BOOKINGS_ID + '/staffMembers'
const GRAPH_SERVICES_ENDPOINT = process.env.GRAPH_API_ENDPOINT + 'v1.0/solutions/bookingBusinesses/' + process.env.BOOKINGS_ID + '/services'
const GRAPH_CUSTOM_QUESTIONS_ENDPOINT = process.env.GRAPH_API_ENDPOINT + 'v1.0/solutions/bookingBusinesses/' + process.env.BOOKINGS_ID + '/customQuestions'
const GRAPH_CREATE_BOOKING_APPOINTMENT_ENDPOINT = process.env.GRAPH_API_ENDPOINT + 'v1.0/solutions/bookingBusinesses/' + process.env.BOOKINGS_ID + '/appointments'
const GRAPH_CUSTOMERS_ENDPOINT = process.env.GRAPH_API_ENDPOINT + 'v1.0/solutions/bookingBusinesses/' + process.env.BOOKINGS_ID + '/customers'

module.exports = {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
    GRAPH_ME_ENDPOINT,
    GRAPH_STAFF_ENDPOINT,
    GRAPH_SERVICES_ENDPOINT,
    GRAPH_CUSTOM_QUESTIONS_ENDPOINT,
    GRAPH_CREATE_BOOKING_APPOINTMENT_ENDPOINT,
    GRAPH_CUSTOMERS_ENDPOINT
};
