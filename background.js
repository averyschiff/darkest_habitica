// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/*Currently set to only run on habitica.com
 * Potential future work to cover other areas of the site.
 */
chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({

				pageUrl: {hostEquals: 'habitica.com'},

			})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]	
		}]);
	});
});
