'use strict';

var server = require('server');
var klaviyoUtils = require('*/cartridge/scripts/klaviyo/utils');
var viewedProductData = require('*/cartridge/scripts/klaviyo/eventData/viewedProduct');
var viewedCategoryData = require('*/cartridge/scripts/klaviyo/eventData/viewedCategory');
var searchedSiteData = require('*/cartridge/scripts/klaviyo/eventData/searchedSite');

/***
 *
 * NOTE: the Klaviyo-Event route exists to support event tracking on pages whose OOTB SFCC controllers are cached by default
 * to avoid caching event data, the Klaviyo-Event route is called via remote include in KlaviyoTag.isml.
 * for event tracking on pages whose controllers are not cached OOTB, server.appends to those OOTB controllers should be utilized
 * reference Cart.js, Checkout.js, Order.js in the int_klaviyo_sfra cartridge
 *
***/


// TODO: any partcular middleware need here?

server.get('Event', function (req, res, next) {

    if(klaviyoUtils.klaviyoEnabled){

        var dataObj, serviceCallResult, action, parms;
        var exchangeID = klaviyoUtils.getKlaviyoExchangeID();

        if (exchangeID) { // we have a klaviyo ID, proceed to track events
            action = request.httpParameterMap.action.stringValue;
            parms = request.httpParameterMap.parms.stringValue;

            switch(action) {
                case klaviyoUtils.EVENT_NAMES.viewedProduct :
                    dataObj = viewedProductData.getData(parms); // parms: product ID
                    break;
                case klaviyoUtils.EVENT_NAMES.viewedCategory :
                    dataObj = viewedCategoryData.getData(parms); // parms: category ID
                    break;
                case klaviyoUtils.EVENT_NAMES.searchedSite :
                    // TODO: add Show-Ajax append?  test to be sure when this happens... if its just on paging, do we want to track that?
                    // TODO: what about search-suggestion flyout? probably not supportable
                    // TODO: be sure to check for 0 result searches, filtering on both search results and PLPs, re-sorts, etc and get clarity on requirements
                    parms = parms.split('|');
                    dataObj = searchedSiteData.getData(parms[0], parms[1]); // parms: search phrase, result count
                    break;
            }
            serviceCallResult = klaviyoUtils.trackEvent(exchangeID, dataObj, action);
            // TODO: need to do anything here with the service call result, or handle all errs etc within trackEvent? otherwise no need to assign to a var / return a value
        }

    }

    res.render('klaviyo/klaviyoEmpty') // we don't need to render anything here, but SFRA requires a .render to be called
    next();
});


module.exports = server.exports();