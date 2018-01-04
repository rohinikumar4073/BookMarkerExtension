const loadBrowserDetails = 'http://localhost:5000/browserData';
const syncUpDateLimit = 15;
const fetchbrowserHistoryLimitDays = 100;

const Util = new function () {
  this.loadLinks = function (jsonData, selector) {
    jsonData.forEach(function (location) {
      let a = document.createElement('a');
      a.setAttribute('href', '#')
      a.innerHTML = JSON.stringify(location);
      a.onclick = function () {
        chrome.tabs.create({ active: true, url: location.url });
      };
      document.getElementById(selector).appendChild(a);
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
  this.IsCurDateExceedsSyncLimit= function (currentTime, lastSyncedDate, dateLimit) {
    return (currentTime > (lastSyncedDate + (dateLimit * 24 * 60 * 60 * 1000)));
  };
};



function loadBrowserHistory(startTime, endTime, browserId) {
  chrome.history.search({
    text: '', startTime: startTime, endTime: endTime, maxResults: 10000
  }, function (data) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', loadBrowserDetails, true);
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
    chrome.storage.sync.get('lastSyncedDate', function (items) {
      console.log("items",items);

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
console.log("running ")
chrome.storage.sync.get('browserId', function (items) { syncUpBrowserData(items); });
