import { Actions } from '../actions.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Actions.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

