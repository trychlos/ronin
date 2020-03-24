import { References } from '../references.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

References.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

