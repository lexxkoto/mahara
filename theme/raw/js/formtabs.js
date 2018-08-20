/*jslint browser: true, nomen: true,  white: true */
/* global jQuery, $ */
jQuery(function($) {
"use strict";

    function setupTab() {
        // if we have one form with many div tabs within it - eg profile page
        if ($('.pieform.jstabs .pieform-fieldset').length) {
            setupTabContext($('.pieform.jstabs .pieform-fieldset').parent(), '.pieform.jstabs', true);
        }
        // if we have many forms each in their own div/tab - eg user bulk actions
        if ($('.bulk.jstabs').length) {
            setupTabContext($('.bulk.jstabs .tabcontent'), '.bulk.jstabs', false);
        }
    }

    function setupTabContext(tabcontent,ident,createmenu) {

        var i,
            id,
            listitem,
            heading;

        if (createmenu) {
            $(ident).prepend('<ul class="nav nav-tabs" role="tablist"></ul>');
        }
        mahara.tabnav = $(ident).find('.nav-tabs');

        // Remove class collasped that has been generated by pieform
        if ($(ident + ' .pieform-fieldset').length) {
            $(ident + ' .pieform-fieldset').removeClass('collapsed');
        }
        tabcontent.removeClass('collapsed');
        // Add div and bootstrap class on tabcontent to show and hide
        tabcontent.addClass('tab-pane').attr('role', 'tabpanel').wrapAll('<div class="tab-content">');

        // Set up tab navigation
        for (i = 0; i < tabcontent.length; i = i + 1) {
            // get id and title from div (tabcontent)
            id = $(tabcontent[i]).attr('id');
            heading = $(tabcontent[i]).find('legend h4').first().text();

            // if the tab-pane isn't hidden
            if (!$(tabcontent[i]).hasClass('hidden')) {
                listitem = '<li role="presentation" aria-hidden="true">' +
                    '<a href="#'+id+'" role="tab" data-toggle="tab" aria-controls="'+id+'" aria-expanded="false">'+heading+'</a>' +
                '</li>';
                mahara.tabnav.append(listitem);
            }
        }

        // set first tab active
        mahara.tabnav.find('li:first-child a').tab('show');
        if ($(mahara.tabnav.find('li:first-child a').attr('href')).find('.requiredmarker').length) {
            // show 'required' header message
            mahara.tabnav.closest('form').find('.requiredmarkerdesc').removeClass('hidden');
        }
        else {
            // hide 'required' header message
            mahara.tabnav.closest('form').find('.requiredmarkerdesc').addClass('hidden');
        }
        // Store current tab on change
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
            if ($($(e.target).attr('href')).find('.requiredmarker').length) {
                // show 'required' header message
                $(e.target).closest('form').find('.requiredmarkerdesc').removeClass('hidden');
            }
            else {
                // hide 'required' header message
                $(e.target).closest('form').find('.requiredmarkerdesc').addClass('hidden');
            }
            saveTab(e);
        });
    }

    /*
     * Check that the stored location matches our current location
     * then attempt to load saved tab state
     */
    function checkSavedTab() {
        var currentPath =  window.location.pathname,
            stateObject = JSON.parse(sessionStorage.getItem('StateObject'));

        if(stateObject === null || stateObject.url === undefined){
            return;
        }

        if(currentPath === stateObject.url) {
            restoreTab();
        }
    }

    /*
     * Restore any tab state stored in sessionStorage
     */
    function restoreTab() {
        var stateObject = JSON.parse(sessionStorage.getItem('StateObject')),
            storedTabId = stateObject.tabID,
            currentTab = mahara.tabnav.find('a[href^="'+ storedTabId +'"]');

        if(currentTab.length > 0){
            currentTab.tab('show');
        }
    }

    /*
     * Store the current active tab in session Storage
     * @param e | Event
     */
    function saveTab(e) {

        var currentTabId = $(e.target).attr('href'),
            stateObject = {
                tabID: currentTabId,
                url: window.location.pathname
            };

        sessionStorage.setItem('StateObject', JSON.stringify(stateObject));
    }

    var mahara = {};

    setupTab();
    checkSavedTab();

});
