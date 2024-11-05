const hbs = require('hbs');

module.exports = {
    registerHelpers: () => {
        hbs.registerHelper('json', function(context) {
            return JSON.stringify(context);
        });
    }
};
