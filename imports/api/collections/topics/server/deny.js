import { Topics } from '../topics.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Topics.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

