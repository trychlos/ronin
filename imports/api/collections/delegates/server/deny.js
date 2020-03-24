import { Delegates } from '../delegates.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Delegates.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

