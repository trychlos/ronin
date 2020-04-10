// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by ronin-ui-prefs.js.
import { name as packageName } from "meteor/pwi:ronin-ui-prefs";

// Write your tests here!
// Here is an example.
Tinytest.add('ronin-ui-prefs - example', function (test) {
  test.equal(packageName, "ronin-ui-prefs");
});
