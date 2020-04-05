/*
 * /imports/startup/both/index.js
 *
 *  Both server and client common initialization code.
 */
import { Meteor } from 'meteor/meteor';
import { Ronin } from 'meteor/pwi:ronin-core';

import './collections-config.js';
import './collections-csfns.js';
import './misc.js';
