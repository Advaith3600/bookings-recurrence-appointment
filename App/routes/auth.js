/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');

const authProvider = require('../auth/AuthProvider');
const { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require('../authConfig');

const router = express.Router();

const BASE_URL = (process.env.BASE_URL || '/').replace(/\/$/, '');

router.get('/signin', authProvider.login({
    scopes: [],
    redirectUri: REDIRECT_URI,
    successRedirect: BASE_URL + '/'
}));

router.get('/acquireUserReadToken', authProvider.acquireToken({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
    successRedirect: BASE_URL + '/users/profile'
}));

router.get('/acquireBookingsReadWriteToken', authProvider.acquireToken({
    scopes: ['BookingsAppointment.ReadWrite.All'],
    redirectUri: REDIRECT_URI,
    successRedirect: BASE_URL + '/bookings'
}));

router.post('/redirect', authProvider.handleRedirect());

router.get('/signout', authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI
}));

module.exports = router;
