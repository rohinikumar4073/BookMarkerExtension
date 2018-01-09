const baseApi = 'http://localhost:5000';
const browserApi = baseApi + '/browserData';
const domselector = 'container';

const syncUpDateLimit = 15;
const fetchbrowserHistoryLimitDays = 100;

const Util = new function () {
  this.loadLinks = function (jsonData) {

    jsonData.forEach(function (location) {
      let a = document.createElement('a');
      a.setAttribute('href', '#')
      a.innerHTML = location;
      a.onclick = function () {
        chrome.tabs.create({ active: true, url: 'http:\\'+location });
      };
      document.getElementById(domselector).appendChild(a);
    }, this);
  };

  this.getRandomToken = function () {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
      hex += randomPool[i].toString(16);
    }
    return hex;
  };
  this.IsCurDateExceedsSyncLimit = function (currentTime, lastSyncedDate, dateLimit) {
    return (currentTime > (lastSyncedDate + (dateLimit * 24 * 60 * 60 * 1000)));
  };
};


function getLinksData(browserId) {
  var oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {

      var myArr = JSON.parse(this.responseText);
      Util.loadLinks(myArr);
    }
  }
  oReq.open('GET', browserApi + '?date=' + new Date().getTime() + '&browserId=' + browserId);
  oReq.send();
}

function loadBrowserHistory(startTime, endTime, browserId) {
  chrome.history.search({
    text: '', startTime: startTime, endTime: endTime, maxResults: 10000
  }, function (data) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', browserApi, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        console.log("Data got saved successfully !")
      }
    }
    xhr.send(JSON.stringify({ browserLogs: JSON.stringify(data), browserId: browserId }));
  });
}
function syncData(browserId) {
  let todayDate = new Date();
  let endTime = todayDate.getTime();
  let startTime = todayDate.getTime() - (fetchbrowserHistoryLimitDays * 24 * 60 * 60 * 1000);
  loadBrowserHistory(startTime, endTime, browserId);
}
function setLastSyncDate(browserId, cb) {
  chrome.storage.sync.set({ browserId: browserId, lastSyncedDate: new Date().getTime() }, cb);
}
function syncUpBrowserData(items) {
  let browserId = items.browserId;
  if (browserId) {
    getLinksData(browserId);
    chrome.storage.sync.get('lastSyncedDate', function (items) {
      console.log("items", items);

      let today = new Date();
      if (Util.IsCurDateExceedsSyncLimit(today.getTime, items.lastSyncedDate, syncUpDateLimit)) {
        setLastSyncDate(browserId, function () { syncData(browserId) })
      }
    });
  } else {
    browserId = Util.getRandomToken();
    setLastSyncDate(browserId, function () { syncData(browserId) })
  }

};
chrome.storage.sync.get('browserId', function (items) { syncUpBrowserData(items); });
