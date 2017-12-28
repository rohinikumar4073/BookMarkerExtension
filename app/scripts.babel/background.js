'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);

});
var loadBrowserDetails = DEFAULT_NEWS_URL;


chrome.history.search({text: '',maxResults:10000}, function(data) {



});
function loadLinks(jsonData, selector) {
  jsonData.forEach(function (location) {
    let a = document.createElement('a');
    a.setAttribute('href', '#')
    a.innerHTML = JSON.stringify(location);
    a.onclick = function () {
      chrome.tabs.create({ active: true, url: location.url });
    };
    document.getElementById(selector).appendChild(a);
  }, this);
}

document.addEventListener('DOMContentLoaded', function () {
 
});