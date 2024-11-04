var express = require('express');
var router = express.Router();

var fetch = require('../fetch');

var { GRAPH_STAFF_ENDPOINT, GRAPH_SERVICES_ENDPOINT, GRAPH_CUSTOM_QUESTIONS_ENDPOINT } = require('../authConfig');
const isAuthenticated = require('../auth/isAuthenticated');

router.get('/',
  isAuthenticated, // check if user is authenticated
  async function(req, res, next) {
    try {
      const response = await Promise.all([
        fetch(GRAPH_STAFF_ENDPOINT, req.session.accessToken),
        fetch(GRAPH_SERVICES_ENDPOINT, req.session.accessToken),
        fetch(GRAPH_CUSTOM_QUESTIONS_ENDPOINT, req.session.accessToken),
      ]);
      console.log(JSON.stringify(response, null, 2));
      res.render('bookings', {
        staff: response[0].value,
        services: response[1].value,
        customQuestions: response[2].value
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
