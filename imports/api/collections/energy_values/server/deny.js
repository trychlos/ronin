import { EnergyValues } from '../energy_values.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

EnergyValues.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

