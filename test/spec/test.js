suite('Bookmarker Links', function () {
  setup(function () {
  });

  suite('#should load the dom with suggeste links', function () {
    test('No of links equal to json input', function () {
      let jsonData = ["https://www.google.com", "https://www.cricbuzz.com"];
      Util.loadLinks(jsonData, "mocha");
      assert(document.getElementById("mocha").childElementCount, 2)
    });
    test('Check for Date exceeded', function () {
      assert.equal(true, Util.IsCurDateExceedsSyncLimit(1514766670000,1483230670000,30));
      assert.equal(false, Util.IsCurDateExceedsSyncLimit(1514766670000,1513729870000,30));
    });
   
  });
});
