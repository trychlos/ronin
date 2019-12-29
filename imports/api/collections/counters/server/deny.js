import { Counters } from '../counters.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Counters.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

