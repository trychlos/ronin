import { FS } from '../fs.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

FS.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
