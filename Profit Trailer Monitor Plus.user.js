// ==UserScript==
// @name         Profit Trailer Monitor Plus
// @namespace    https://www.bugs-ev.de
// @version      01.0.00
// @description  Vires in Numeris
// @author       Ediz Turcan
// @match        https://localhost:8081/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your local language code, e.g. de-DE, en-EN, en-GB
    const locale = 'de-DE';

    // BTC, mBTC or Bits
    var currency = 'Bits';

    // USD or EUR
    const fiat = 'EUR';

    // Don't change anything below this line

    var multiplier = 1;
    switch (currency) {
        case 'Bits':
            multiplier = 1000000;
            break;
        case 'mBTC':
            multiplier = 1000;
            break;
        default:
            currency = 'BTC';
            multiplier = 1;
            break;
    }

    var euroPrice = -1;

    $(document).ready(function() {
        console.log("Profit Trailer Monitor Plus v01.0.00 loaded.");
        euroPriceJob();
        convertJob();
    });

    function convertJob() {
        var refreshTime = 100;

        // Balance
        convertFiat('#mBalanceVal', '#mBalUSDValue');
        convertCurrency('#mBalanceVal');

        // Total Current Value
        convertFiat('#mTotalCurrentVal', '#mTCVUSDValue');
        convertCurrency('#mTotalCurrentVal');

        // Total Pending Value
        convertFiat('#mTotalPendingVal', '#mTPVUSDValue');
        convertCurrency('#mTotalPendingVal');

        // Profit Last Week
        convertFiat('#mLastWeekProfit', '#mLastWeekProfitUSDValue');
        convertCurrency('#mLastWeekProfit');
        showPercentageChange('#mTotalCurrentVal', '#mLastWeekProfit');

        // Profit Yesterday
        convertFiat('#mYesterdayProfit', '#mYesterdayProfitUSDValue');
        convertCurrency('#mYesterdayProfit');
        showPercentageChange('#mTotalCurrentVal', '#mYesterdayProfit');

        // Profit Today
        convertFiat('#mTodayProfit', '#mTodayProfitUSDValue');
        convertCurrency('#mTodayProfit');
        showPercentageChange('#mTotalCurrentVal', '#mTodayProfit');

        setTimeout(convertJob, refreshTime);
    }

    function euroPriceJob() {
        var refreshTime = 10000;
        $.getJSON('https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=EUR', function(data) {
            var price = Number(data[0].price_eur);
            if(!isNaN(price)) {
                euroPrice = price;
            }
            setTimeout(euroPriceJob, refreshTime);
        });
    }

    function convertFiat(id, fiatID) {
        if(fiat == 'USD') { return; }
        if(fiat == 'EUR' && euroPrice == -1) { return; }
        var price = 0;
        switch (fiat) {
            case 'EUR':
                price = euroPrice;
                break;
            default:
                break;
        }
        var value = Number($(id).attr('title'));
        if(isNaN(value)) { return; }
        var newPrice = value * price;
        $(fiatID).text(newPrice.toLocaleString(locale, { maximumFractionDigits: 2 }));
        var children = $(($(fiatID).parent().children())[0]);
        var labels = children.children();
        labels.each(function() {
            var currentText = $(this).text();
            $(this).text(currentText.replace('USD', fiat));
        });
    }

    function convertCurrency(id) {
        if(currency == 'BTC') { return; }
        const obj = $(id);
        var currentValue = Number(obj.attr("title"));
        if(!isNaN(currentValue)) {
            var newValue = currentValue * multiplier;
            obj.text(newValue.toLocaleString(locale));
            obj.next().text(currency);
        }
    }

    function showPercentageChange(tcvID, whereToShowID) {
        const obj = $(whereToShowID);
        const currentTCV = Number($(tcvID).attr("title"));
        const currentProfit = Number(obj.attr('title'));
        if(!isNaN(currentTCV) && !isNaN(currentProfit)) {
            var percentage = currentProfit / currentTCV * 100;
            var div = obj.parent().parent();
            var id = whereToShowID + 'Percentage';
            var newObj = $(id);
            var stringToDisplay = '+' + percentage.toLocaleString(locale) + ' %';
            if(newObj.length) {
                newObj.text(stringToDisplay);
            } else {
                div.append('<p class="' + obj.parent().next().attr("class") + '" id="' + id.replace('#', '') + '">' + stringToDisplay + '</p>');
            }
        }
    }

})();