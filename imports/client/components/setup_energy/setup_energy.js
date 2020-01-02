/*
 * 'setup_energy' component.
 *  Edit, create, delete and list energy values.
 *  This component itself embeds two other UI components:
 *  - energy_value_edit
 *  - energy_values_list.
 * 
 *  Session variables:
 *  - 'setup.energy_values.obj': the edited object, selected in energy_values_list.
 */
import { EnergyValues } from '/imports/api/collections/energy_values/energy_values.js';
import '/imports/client/components/energy_value_edit/energy_value_edit.js';
import '/imports/client/components/energy_values_list/energy_values_list.js';
import './setup_energy.html';

Template.setup_energy.onCreated( function(){
    this.subscribe('energy_values.all');
});

Template.setup_energy.helpers({
    energies(){
        return EnergyValues.find({}, { sort:{ createdAt: -1 }});
    },
});
