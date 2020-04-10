
User preferences may be local to the current device.
So we want manage two sort of user preferences:
	- globally for the user interface
	- of this current device.

First is stored in the Users collection, under a 'ronin.prefs' key.
It is read at startup, and stored in the global Ronin object, under a 'Ronin.prefs' key.
This key is automatically setup/cleared each time a user logs in/out.

Second item (preferences for the current device) is stored in the 'localStorage'.

From the management UI point of view, the prefsWindow is organized per tab.
Each tab is responsible for letting the user update its preferences for a given
domain. So each tab may update in Roney.prefs:
- a key
- a local.key
where each key may have any EJSON-able value.

API is as
    Ronin.prefs: the hash of the user prefs
    Ronin.prefs.save() : save the current content of the hash

User preferences are reactive, thanks to
- the Users collection reactivity built-in into Meteor
- the mdj:reactive-storage package.

The initial state is saved so that it can be restored if an unknown user try to
update global preferences.
