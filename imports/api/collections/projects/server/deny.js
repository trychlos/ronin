import { Projects } from '../projects.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Projects.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

