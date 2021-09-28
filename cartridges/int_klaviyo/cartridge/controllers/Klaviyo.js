'use strict';

/* Script Modules */
var guard = require('*/cartridge/scripts/guard');
var r = require('*/cartridge/scripts/util/Response');
var Logger = require('dw/system/Logger');
/* API Includes */
var ISML = require('dw/template/ISML');


/**
 * Controller that sends the necessary data required for klaviyo to track user events
 * such as checkout, order confirmation, searching etc and renders the renders the klaviyoTag isml file
 *
 * @module controllers/Klaviyo
*/


var RenderKlaviyo = function () {
    if (!dw.system.Site.getCurrent().getCustomPreferenceValue('klaviyo_enabled')) {
        return;
    }
    var logger = Logger.getLogger('renderKlaviyo', 'Klaviyo - Render Klaviyo Controller');
    try {
        var klaviyoUtils = require('*/cartridge/scripts/utils/klaviyo/klaviyoUtils');
        var klaviyoTags = require('*/cartridge/scripts/utils/klaviyo/klaviyoOnSiteTags.js').klaviyoOnSiteTags;

        var klaviyoDataLayer = klaviyoUtils.buildDataLayer();
        var sendToDom = klaviyoTags(klaviyoDataLayer);

        ISML.renderTemplate('klaviyo/klaviyoTag', {
            klaviyoData: sendToDom
        });
    } catch (e) {
        logger.debug('error rendering klaviyo ' + e.message + ' at ' + e.lineNumber);
    }
};

/**
 * Controller that sends the necessary data to klaviyo when an add to cart event happens
 * @module controllers/Klaviyo
*/


var RenderKlaviyoAddToCart = function () {
    if (!dw.system.Site.getCurrent().getCustomPreferenceValue('klaviyo_enabled')) {
        return;
    }
    var klaviyoUtils = require('*/cartridge/scripts/utils/klaviyo/klaviyoUtils');
    var klaviyoTags = require('*/cartridge/scripts/utils/klaviyo/klaviyoOnSiteTags.js').klaviyoOnSiteTags;

    var klaviyoDataLayer = klaviyoUtils.buildCartDataLayer();
    var sendToDom = klaviyoTags(klaviyoDataLayer);

    ISML.renderTemplate('klaviyo/klaviyoTag', {
        klaviyoData: sendToDom
    });
};


/** Handles the form submission for subscription.
 * @see {@link module:controllers/Klaviyo~Subscribe} */
exports.RenderKlaviyo = guard.ensure(['get'], RenderKlaviyo);
exports.RenderKlaviyoAddToCart = guard.ensure(['get'], RenderKlaviyoAddToCart);
