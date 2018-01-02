function syncData(browserId) {
  const loadBrowserDetails = 'http://localhost:5000/browserData';
  let todayDate = new Date();
  let endTime = todayDate.getTime();
  let startTime = todayDate.getTime() - (100 * 24 * 60 * 60 * 1000);
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
    console.log("browserId",browserId)

    xhr.send(JSON.stringify({ browserLogs: JSON.stringify(data) ,browserId:browserId}));
  });
}
function getRandomToken() {
  var randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  var hex = '';
  for (var i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }
  return hex;
};
function handleBrowserId(items) {
    let browserId = items.browserId;
    if (browserId) {
      console.log('browserId id exists ', browserId);
      syncData(browserId);
    } else {
      browserId = getRandomToken();
      chrome.storage.sync.set({ browserId: browserId }, function () {
        console.log('browserId id generated ', browserId);
        syncData(browserId);
      });
    }
  
};
console.log("running ")
    chrome.storage.sync.get('browserId', function (items) { handleBrowserId(items); });
  