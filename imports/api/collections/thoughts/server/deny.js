import { Thoughts } from '../thoughts.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Thoughts.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

