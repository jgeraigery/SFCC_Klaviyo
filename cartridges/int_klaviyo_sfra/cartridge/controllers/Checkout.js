'use strict';

var server = require('server');
var basketMgr = require('dw/order/BasketMgr');
var klaviyoUtils = require('*/cartridge/scripts/klaviyo/utils');
var startedCheckoutData = require('*/cartridge/scripts/klaviyo/eventData/startedCheckout');


server.extend(module.superModule);


server.append('Begin', function (req, res, next) {

    if(klaviyoUtils.klaviyoEnabled){

        var exchangeID = klaviyoUtils.getKlaviyoExchangeID();
        var dataObj, serviceCallResult, currentBasket;
        var isKlDebugOn = request.httpParameterMap.kldebug.booleanValue; // needs to be in the Checkout & Add TO Cart as well...(AND ORDER CONFIRMATION...)

        if (exchangeID) {
            currentBasket = basketMgr.getCurrentBasket()

            if (currentBasket && currentBasket.getProductLineItems().toArray().length) { //TODO: is there a property for isEmpty on basket object?
                dataObj = startedCheckoutData.getData(currentBasket);
                serviceCallResult = klaviyoUtils.trackEvent(exchangeID, dataObj, klaviyoUtils.EVENT_NAMES.startedCheckout);
                if (isKlDebugOn) {
                    res.viewData.klDebugData = klaviyoUtils.prepareDebugData(dataObj);
                    res.viewData.serviceCallData = klaviyoUtils.prepareDebugData(serviceCallResult);
                }
            }

        } else {
            res.viewData.klid = klaviyoUtils.getProfileInfo();
        }

    }

    next();
});


module.exports = server.exports();