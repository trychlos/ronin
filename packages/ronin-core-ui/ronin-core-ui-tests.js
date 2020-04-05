// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by ronin-core-ui.js.
import { name as packageName } from "meteor/pwi:ronin-core-ui";

// Write your tests here!
// Here is an example.
Tinytest.add('ronin-core-ui - example', function (test) {
  test.equal(packageName, "ronin-core-ui");
});
