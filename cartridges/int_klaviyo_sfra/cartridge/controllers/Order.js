'use strict';

var server = require('server');
var OrderMgr = require('dw/order/OrderMgr');
var klaviyoUtils = require('*/cartridge/scripts/klaviyo/utils');
var orderConfirmationData = require('*/cartridge/scripts/klaviyo/eventData/orderConfirmation');


server.extend(module.superModule);


server.append('Confirm', function (req, res, next) {

    if(klaviyoUtils.klaviyoEnabled){

        var exchangeID = klaviyoUtils.getKlaviyoExchangeID();
        var dataObj, serviceCallResult, currentOrder;

        if (exchangeID && req.form.orderID && req.form.orderToken) {
            currentOrder = OrderMgr.getOrder(req.form.orderID, req.form.orderToken);
            // check to see if the status is new or created
            if (currentOrder.status == dw.order.Order.ORDER_STATUS_NEW || currentOrder.status == dw.order.Order.ORDER_STATUS_OPEN) {
                dataObj = orderConfirmationData.getData(currentOrder, exchangeID);
                serviceCallResult = klaviyoUtils.trackEvent(exchangeID, dataObj, klaviyoUtils.EVENT_NAMES.orderConfirmation);
            }

        }

    }

    next();
});


module.exports = server.exports();