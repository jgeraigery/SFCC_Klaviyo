'use strict';

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');

/* eslint-disable */
var r = require("*/cartridge/scripts/util/Response");
/* eslint-enable */

/* API Includes */
var ISML = require('dw/template/ISML');

var klaviyoUtils = require('*/cartridge/scripts/klaviyo/utils');
var viewedProductData = require('*/cartridge/scripts/klaviyo/eventData/viewedProduct');
var viewedCategoryData = require('*/cartridge/scripts/klaviyo/eventData/viewedCategory');
var searchedSiteData = require('*/cartridge/scripts/klaviyo/eventData/searchedSite');

/**
 * Controller that sends the necessary data required for klaviyo to track user events
 * such as checkout, order confirmation, searching etc and renders the renders the klaviyoTag isml file
 *
 * @module controllers/Klaviyo
 */

var Event = function () {

    if(dw.system.Site.getCurrent().getCustomPreferenceValue('klaviyo_enabled')){

        var kx = request.httpParameterMap.kx;
        var exchangeID = (!kx.empty) ? kx.stringValue : klaviyoUtils.getKlaviyoExchangeID();
        var isKlDebugOn = request.httpParameterMap.kldebug.booleanValue;
        var dataObj, serviceCallResult, action, parms;

        if (exchangeID) {
            action = request.httpParameterMap.action.stringValue;
            parms = request.httpParameterMap.parms.stringValue;

            if(action != 'false') { // string test intentional, action passed as 'false' for pages that do not need to trigger events (Home, Page, Default)
                switch(action) {
                    case klaviyoUtils.EVENT_NAMES.viewedProduct :
                        dataObj = viewedProductData.getData(parms); // parms: product ID
                        break;
                    case klaviyoUtils.EVENT_NAMES.viewedCategory :
                        dataObj = viewedCategoryData.getData(parms); // parms: category ID
                        break;
                    case klaviyoUtils.EVENT_NAMES.searchedSite :
                        parms = parms.split('|');
                        dataObj = searchedSiteData.getData(parms[0], parms[1]); // parms: search phrase, result count
                        break;
                }
                serviceCallResult = klaviyoUtils.trackEvent(exchangeID, dataObj, action);
                if (isKlDebugOn) {
                    app.getView({
                        klDebugData: klaviyoUtils.prepareDebugData(dataObj),
                        serviceCallData: klaviyoUtils.prepareDebugData(serviceCallResult)
                    }).render('klaviyo/klaviyoDebug');
                    return;
                }
            }
        } else {
            // no klaviyo ID, check for SFCC profile and ID off that if extent
            var klid = klaviyoUtils.getProfileInfo();
            if(klid) {
                app.getView({klid: klid}).render('klaviyo/klaviyoID');
            }
        }

    }

};


exports.Event = guard.ensure(['get'], Event);
