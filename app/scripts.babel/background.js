'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);

});
var loadBrowserDetails = 'http://localhost:5000/browserData';


chrome.history.search({text: '',maxResults:10000}, function(data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', loadBrowserDetails, true);
  //Send the proper header information along with the request
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.onreadystatechange = function() {//Call a function when the state changes.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      }
  }
  console.log(JSON.stringify(data));
  xhr.send(JSON.stringify({browserLogs:JSON.stringify(data)})); 
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
