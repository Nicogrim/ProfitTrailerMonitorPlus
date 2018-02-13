// ==UserScript==
// @name         Profit Trailer Monitor Plus
// @namespace    https://www.bugs-ev.de
// @version      01.0.00
// @description  Vires in Numeris
// @author       Ediz Turcan
// @match        https://turcan.de:8081/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const locale = 'en-EN';
    const currency = 'Bits';
    const divider = 1000000;

    $(document).ready(function() {
        console.log("Profit Trailer Monitor Plus v01.0.00 loaded.");

        convert();
    });

    function convert() {
        var refreshTime = 100;

        // Balance
        convertId('#mBalanceVal');

        // Total Current Value
        convertId('#mTotalCurrentVal');

        // Total Pending Value
        convertId('#mTotalPendingVal');

        // Profit Last Week
        convertId('#mLastWeekProfit');
        showPercentageChange('#mTotalCurrentVal', '#mLastWeekProfit');

        // Profit Yesterday
        convertId('#mYesterdayProfit');
        showPercentageChange('#mTotalCurrentVal', '#mYesterdayProfit');

        // Profit Today
        convertId('#mTodayProfit');
        showPercentageChange('#mTotalCurrentVal', '#mTodayProfit');

        setTimeout(convert, refreshTime);
    }

    function convertId(id) {
        const obj = $(id);
        var currentValue = Number(obj.text());
        if(!isNaN(currentValue)) {
            currentValue *= divider;
            obj.text(currentValue.toLocaleString(locale));
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