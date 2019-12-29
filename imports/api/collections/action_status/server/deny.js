import { ActionStatus } from '../action_status.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

ActionStatus.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

