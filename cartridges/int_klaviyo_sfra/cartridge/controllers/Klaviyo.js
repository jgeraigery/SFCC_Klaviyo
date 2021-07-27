'use strict';

var server = require('server');

// Use the following for CSRF protection: add middleware in routes and hidden field on form

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var Logger = require('dw/system/Logger');

/* API Includes */


/**
 * You have to add the values for Klaviyo Account, Klaviyo API Key in
 * Merchant Tools -> Site Preferences -> Custom Site Preference -> Klaviyo
 * Change the value of Klaviyo Enabled as Yes
 */

server.get(
    'RenderKlaviyo',
    server.middleware.https,
    function (req, res, next) {
        if (!dw.system.Site.getCurrent().getCustomPreferenceValue('klaviyo_enabled')) {
            return;
        }
        var logger = Logger.getLogger('renderKlaviyo', 'Klaviyo - Render Klaviyo Controller');
        try {
            var klaviyoUtils = require('*/cartridge/scripts/utils/klaviyo/klaviyoDataLayer');
            var klaviyoTags = require('*/cartridge/scripts/utils/klaviyo/klaviyoOnSiteTags.js').klaviyoOnSiteTags;

            var klaviyoDataLayer = klaviyoUtils.buildDataLayer();
            var sendToDom = klaviyoTags(klaviyoDataLayer);

            res.render('/klaviyo/klaviyoTag', {
                klaviyoData: sendToDom
            });
            next();
        } catch (e) {
            logger.debug('error rendering klaviyo ' + e.message + ' at ' + e.lineNumber);
        }
    }
);

server.get(
    'RenderKlaviyoAddToCart',
    server.middleware.https,
    function (req, res, next) {
        if (!dw.system.Site.getCurrent().getCustomPreferenceValue('klaviyo_enabled')) {
            return;
        }
        var klaviyoUtils = require('*/cartridge/scripts/utils/klaviyo/klaviyoUtils');
        var klaviyoTags = require('*/cartridge/scripts/utils/klaviyo/klaviyoOnSiteTags.js').klaviyoOnSiteTags;

        var klaviyoDataLayer = klaviyoUtils.buildCartDataLayer();
        var sendToDom = klaviyoTags(klaviyoDataLayer);

        res.render('/klaviyo/klaviyoTag', {
            klaviyoData: sendToDom
        });
        next();
    }
);

module.exports = server.exports();
