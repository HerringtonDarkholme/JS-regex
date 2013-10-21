(function () {
  "use strict";

  if (process && process.argv.length === 2) {
    console.log("Available Argument:\n --true, --false, --rails");
  }

  var r = require("./js-regex");

  function log(str) {
    var write = function (str) {
      document.write(str + "<br/>")
    };
    (console && console.log || write)(str);
  }

  function testReg (name, str, pattern) {
    log("Test Name: " + name);
    log("Testing String: " + str);
    log("Testing Pattern: " + pattern.toString());
    if (pattern.test(str)) {
      log("Test Result: "+ "\x1B[32m"+ "True"+ "\x1B[39m")
    } else {
      log("Test Result: "+ "\x1B[31m"+ "False"+ "\x1B[39m")
    }
    log(""); // newline
  }

  var testTrue = [
    {
      name    : "IDCARD",
      str     : "230103196007175511", // FangBinxing
      pattern : r.IDCARD
    },
    {
      name    : "alpha-numeric",
      str     : "user123",
      pattern : r.ALPHNUM
    },
    {
      name    : "username",
      str     : "Herrington_Darkholme",
      pattern : r.USERNAME
    },
    {
      name    : "password",
      str     : "Sh123456",
      pattern : r.PASSWORD
    },
    {
      name    : "strong password",
      str     : "Sh@1234567",
      pattern : r.STRONG_PASSWORD
    },
    {
      name    : "url",
      str     : "http://www.google.com",
      pattern : r.URL
    },
    {
      name    : "strict_url",
      str     : "https://www.google.com/search?q=s%20",
      pattern : r.STRICT_URL
    },
    {
      name    : "email",
      str     : "someone@some.domain",
      pattern : r.EMAIL
    },
    {
      name    : "phone number",
      str     : "13838384380",
      pattern : r.PHONE
    },
    {
      name    : "telephone",
      str     : "021-31319200",
      pattern : r.TEL
    },
    {
      name    : "mongoid",
      str     : "525f5c48421aa9b0ea000002",
      pattern : r.MONGOID
    },
    {
      name    : "Internet Protocol version 4",
      str     : "192.168.12.221",
      pattern : r.IPV4
    },
    {
      name    : "中文",
      str     : "轻拢慢捻抹复挑初为霓裳后六幺",
      pattern : r.CHINESE
    },
    {
      name    : "中文和标点",
      str     : "轻拢慢捻抹复挑，初为《霓裳》后《六幺》",
      pattern : r.CHINESE_EXT
    }
  ];

  var testCase = {};
  var i = 0, l = 0;
  if (!process || process.argv.indexOf("--true") !== -1) {
    for (i = 0, l = testTrue.length; i < l; ++i) {
      testCase = testTrue[i];
      testReg(testCase.name,
          testCase.str,
          testCase.pattern)
    }
  }
  var testFalse = [
    {
      name    : "IDCARD",
      str     : "11000006600717551X", // FangBinxing
      pattern : r.IDCARD
    },
    {
      name    : "alpha-numeric",
      str     : "user123$",
      pattern : r.ALPHNUM
    },
    {
      name    : "username",
      str     : "ssdfasdfacc--sdfss",
      pattern : r.USERNAME
    },
    {
      name    : "password",
      str     : "123456",
      pattern : r.PASSWORD
    },
    {
      name    : "strong password",
      str     : "h@1234567",
      pattern : r.STRONG_PASSWORD
    },
    {
      name    : "url",
      str     : "mailto://www.google..com",
      pattern : r.URL
    },
    {
      name    : "strict_url",
      str     : "mailto:/www.google..com:3000/search?q=s%20",
      pattern : r.STRICT_URL
    },
    {
      name    : "email",
      str     : "someone@some.domain<123>",
      pattern : r.EMAIL
    },
    {
      name    : "phone number",
      str     : "12338384380",
      pattern : r.PHONE
    },
    {
      name    : "telephone",
      str     : "86213131a200",
      pattern : r.TEL
    },
    {
      name    : "mongoid",
      str     : "525f5c4r8421aa9b0ea000002r",
      pattern : r.MONGOID
    },
    {
      name    : "Internet Protocol version 4",
      str     : "256.000.12.221",
      pattern : r.IPV4
    },
    {
      name    : "中文",
      str     : "轻拢慢捻抹复挑，初为《霓裳》后《六幺》",
      pattern : r.CHINESE
    },
    {
      name    : "中文和标点",
      str     : "轻拢慢捻抹复挑,初为<霓裳>后<六幺>",
      pattern : r.CHINESE_EXT
    }
  ];


  if (!process || process.argv.indexOf("--false") !== -1) {
    log("====================================");
    for (i = 0, l = testFalse.length; i < l; ++i) {
      testCase = testFalse[i];
      testReg(testCase.name,
          testCase.str,
          testCase.pattern)
    }
  }

  var railsRoute = [
      // root
      "plato.dev/",
      // single controller
      "http://plato.dev/cabins",
      // namespace
      "plato.dev/course/admin/collections",
      // ctrl, id, act
      "http://plato.dev/cabins/51358b480bdb820fc2000001/edit",
      // show
      "http://plato.dev/cabins/51f8d23d0bdb821c35000001",
      // query
      "http://plato.dev/course/admin/collections?access_status=unapproved",
      // full
      "http://plato.dev/course/admin/cabins/522430f30bdb820740000001/edit"
    ];

  if (!process || process.argv.indexOf("--rails") !== -1) {
    log("====================================");
    for (i = 0, l = railsRoute.length; i < l; ++i) {
      log(railsRoute[i]);
      log(r.railsRoute(railsRoute[i]));
      log("");
    }
  }

}());
