'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);

});
var loadBrowserDetails = 'http://localhost:5000/browserData';

let todayDate = new Date();
let endTime = todayDate.getTime();
let startTime = todayDate.getTime() - (100 * 24 * 60 * 60 * 1000);
chrome.history.search({
  text: '', startTime: startTime, endTime: endTime, maxResults: 10000
}, function (data) {
  loadLinks(data,'container');
  var xhr = new XMLHttpRequest();
  xhr.open('POST', loadBrowserDetails, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
    }
  }
  console.log(JSON.stringify(data));
  xhr.send(JSON.stringify({ browserLogs: JSON.stringify(data) }));
});
function loadLinks(jsonData, selector) {
  jsonData.forEach(function (location) {
    let a = document.createElement('a');
    a.setAttribute('href', '#')
    a.innerHTML = JSON.stringify(location.url);
    a.onclick = function () {
      chrome.tabs.create({ active: true, url: location.url });
    };
    document.getElementById(selector).appendChild(a);
  }, this);
}
function getRandomToken() {
  var randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  var hex = '';
  for (var i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }
  return hex;
}
chrome.storage.sync.get('userid', function (items) {
  var userid = items.userid;
  if (userid) {
    useToken(userid);
  } else {
    userid = getRandomToken();
    chrome.storage.sync.set({ userid: userid }, function () {
      useToken(userid);
    });
  }
  function useToken(userid) {

  }
});
document.addEventListener('DOMContentLoaded', function () {

});
