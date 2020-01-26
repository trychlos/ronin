import { Articles } from '../articles.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Articles.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
