import { PriorityValues } from '../priority_values.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

PriorityValues.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

