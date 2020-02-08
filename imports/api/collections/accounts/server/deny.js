import '../accounts.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Accounts.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });
