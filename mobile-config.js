/*
 * Mobile (IOS/Android) configuration.
 *  See also https://docs.meteor.com/api/mobile-config.html
 */

 // This section sets up some basic app metadata, the entire section is optional.
App.info({
    id: 'org.trychlos.ronin',
    name: 'Ronin',
    version: '0.1',
    description: 'Getting Things Done',
    author: 'Pierre Wieser',
    email: 'pwieser@trychlos.org',
    website: 'https://www.trychlos.org'
});

// Set up resources such as icons and launch screens.
App.icons({
    'iphone_2x': 'public/img/penseur1-96x96.png',
    'iphone_3x': 'public/img/penseur1-96x96.png',
    'android_xhdpi': 'public/img/penseur1-96x96.png'
});

App.launchScreens({
    'iphone5': 'public/img/penseur4.png',
    'iphone6': 'public/img/penseur4.png',
    'iphone6p_portrait': 'public/img/penseur4.png',
    'iphone6p_landscape': 'public/img/penseur4.png',
    'iphoneX_portrait': 'public/img/penseur4.png',
    'iphoneX_landscape': 'public/img/penseur4.png',
    'ipad_portrait_2x': 'public/img/penseur4.png',
    'ipad_landscape_2x': 'public/img/penseur4.png',
    'iphone': 'public/img/penseur4.png',
    'iphone_2x': 'public/img/penseur4.png',
    'ipad_portrait': 'public/img/penseur4.png',
    'ipad_landscape': 'public/img/penseur4.png',
    'android_mdpi_portrait': 'public/img/penseur4.9.png',
    'android_mdpi_landscape': 'public/img/penseur4.9.png',
    'android_hdpi_portrait': 'public/img/penseur4.9.png',
    'android_hdpi_landscape': 'public/img/penseur4.9.png',
    'android_xhdpi_portrait': 'public/img/penseur4.9.png',
    'android_xhdpi_landscape': 'public/img/penseur4.9.png',
    'android_xxhdpi_portrait': 'public/img/penseur4.9.png',
    'android_xxhdpi_landscape': 'public/img/penseur4.9.png',
    'android_xxxhdpi_portrait': 'public/img/penseur4.9.png',
    'android_xxxhdpi_landscape': 'public/img/penseur4.9.png'
});

// Set PhoneGap/Cordova preferences.
App.setPreference( 'BackgroundColor', '0xff0000ff' );
App.setPreference( 'HideKeyboardFormAccessoryBar', true );
App.setPreference( 'Orientation', 'default' );
App.setPreference( 'Orientation', 'all', 'ios' );

// https://guide.meteor.com/mobile.html#domain-whitelisting
App.accessRule('data:*', { type: 'navigation' });

// Pass preferences for a particular PhoneGap/Cordova plugin.
/*
App.configurePlugin('com.phonegap.plugins.facebookconnect', {
    APP_ID: '1234567890',
    API_KEY: 'supersecretapikey'
});
*/

// Add custom tags for a particular PhoneGap/Cordova plugin to the end of the
// generated config.xml. 'Universal Links' is shown as an example here.
/*
App.appendToConfig(`
    <universal-links>
      <host name="localhost:3000" />
    </universal-links>
`);
*/
