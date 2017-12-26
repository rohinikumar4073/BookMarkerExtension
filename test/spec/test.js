suite('Bookmarker Links', function () {
  setup(function () {
  });

  suite('#should load the dom with suggeste links', function () {
    test('No of links equal to json input', function () {
      let jsonData = ["https://www.google.com", "https://www.cricbuzz.com"];
      loadLinks(jsonData, "mocha");
      assert(document.getElementById("mocha").childElementCount, 2)
    });
  });
});
