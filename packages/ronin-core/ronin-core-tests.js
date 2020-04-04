// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by ronin-core.js.
import { name as packageName } from "meteor/pwi:ronin-core";

// Write your tests here!
// Here is an example.
Tinytest.add('ronin-core - example', function (test) {
  test.equal(packageName, "ronin-core");
});
