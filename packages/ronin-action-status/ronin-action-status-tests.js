// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by ronin-action-status.js.
import { name as packageName } from "meteor/pwi:ronin-action-status";

// Write your tests here!
// Here is an example.
Tinytest.add('ronin-action-status - example', function (test) {
  test.equal(packageName, "ronin-action-status");
});
