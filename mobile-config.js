/*
 * Mobile (IOS/Android) configuration.
 *  See also
 *      https://docs.meteor.com/api/mobile-config.html
 *      https://forums.meteor.com/t/resolved-how-to-add-items-in-cordovas-config-xml-to-support-android-adaptive-icons/44126/2
 */

 // This section sets up some basic app metadata, the entire section is optional.
App.info({
    id: 'org.trychlos.ronin',
    name: 'Ronin',
    version: '20.03.15.2',
    description: 'Getting Things Done',
    author: 'Pierre Wieser',
    email: 'pwieser@trychlos.org',
    website: 'https://www.trychlos.org'
});

// Set up resources such as icons and launch screens.
App.icons({
    'iphone_2x': 'public/img/penseur-icon-120.png',
    'iphone_3x': 'public/img/penseur-icon-180.png',
    'android_mdpi': 'public/img/penseur-icon-48.png',
    'android_hdpi': 'public/img/penseur-icon-72.png',
    'android_xhdpi': 'public/img/penseur-icon-96.png',
    'android_xxhdpi': 'public/img/penseur-icon-144.png',
    'android_xxxhdpi': 'public/img/penseur-icon-192.png',
});

App.launchScreens({
    'iphone5': 'public/img/penseur-gauche-v2.png',
    'iphone6': 'public/img/penseur-gauche-v2.png',
    'iphone6p_portrait': 'public/img/penseur-gauche-v2.png',
    'iphone6p_landscape': 'public/img/penseur-gauche-v2.png',
    'iphoneX_portrait': 'public/img/penseur-gauche-v2.png',
    'iphoneX_landscape': 'public/img/penseur-gauche-v2.png',
    'ipad_portrait_2x': 'public/img/penseur-gauche-v2.png',
    'ipad_landscape_2x': 'public/img/penseur-gauche-v2.png',
    'iphone': 'public/img/penseur-gauche-v2.png',
    'iphone_2x': 'public/img/penseur-gauche-v2.png',
    'ipad_portrait': 'public/img/penseur-gauche-v2.png',
    'ipad_landscape': 'public/img/penseur-gauche-v2.png',
    'android_mdpi_portrait': 'public/img/penseur-gauche-v2.9.png',
    'android_mdpi_landscape': 'public/img/penseur-gauche-v2.9.png',
    'android_hdpi_portrait': 'public/img/penseur-gauche-v2.9.png',
    'android_hdpi_landscape': 'public/img/penseur-gauche-v2.9.png',
    'android_xhdpi_portrait': 'public/img/penseur-gauche-v2.9.png',
    'android_xhdpi_landscape': 'public/img/penseur-gauche-v2.9.png',
    'android_xxhdpi_portrait': 'public/img/penseur-gauche-v2.9.png',
    'android_xxhdpi_landscape': 'public/img/penseur-gauche-v2.9.png',
    'android_xxxhdpi_portrait': 'public/img/penseur-gauche-v2.9.png',
    'android_xxxhdpi_landscape': 'public/img/penseur-gauche-v2.9.png'
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

/*
 * According to https://cordova.apache.org/docs/en/latest/config_ref/images.html
 *  Only cordova v9.x is ready for Android adaptive icons
 *  As of 2020- 1-23, Meteor 1.9 is shipped with Cordova >7 but <9
 *
    <platform name="android">
        <edit-config file="app/src/main/AndroidManifest.xml"
            mode="merge"
            target="/manifest/application">
            <application
                android:icon="@mipmap/ic_launcher"
                android:roundIcon="@mipmap/ic_launcher_round"
                xmlns:android="http://schemas.android.com/apk/res/android"/>
        </edit-config>
    </platform>
*/
/*
    <platform name="android">
        <edit-config file="app/src/main/AndroidManifest.xml"
            mode="merge"
            target="/manifest/application">
            <application
                android:icon="@mipmap/ic_launcher"
                android:roundIcon="@mipmap/ic_launcher_round"
                xmlns:android="http://schemas.android.com/apk/res/android"/>
        </edit-config>
        <resource-file src="platforms/android/res/mipmap-anydpi-v26/ic_launcher.xml" target="app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml" />
        <resource-file src="platforms/android/res/mipmap-anydpi-v26/ic_launcher_round.xml" target="app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml" />
        <resource-file src="platforms/android/res/mipmap-hdpi/ic_launcher.png" target="app/src/main/res/mipmap-hdpi/ic_launcher.png" />
        <resource-file src="platforms/android/res/mipmap-hdpi/ic_launcher_background.png" target="app/src/main/res/mipmap-hdpi/ic_launcher_background.png" />
        <resource-file src="platforms/android/res/mipmap-hdpi/ic_launcher_foreground.png" target="app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png" />
        <resource-file src="platforms/android/res/mipmap-hdpi/ic_launcher_round.png" target="app/src/main/res/mipmap-hdpi/ic_launcher_round.png" />
        <resource-file src="platforms/android/res/mipmap-mdpi/ic_launcher.png" target="app/src/main/res/mipmap-mdpi/ic_launcher.png" />
        <resource-file src="platforms/android/res/mipmap-mdpi/ic_launcher_background.png" target="app/src/main/res/mipmap-mdpi/ic_launcher_background.png" />
        <resource-file src="platforms/android/res/mipmap-mdpi/ic_launcher_foreground.png" target="app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png" />
        <resource-file src="platforms/android/res/mipmap-mdpi/ic_launcher_round.png" target="app/src/main/res/mipmap-mdpi/ic_launcher_round.png" />
        <resource-file src="platforms/android/res/mipmap-xhdpi/ic_launcher.png" target="app/src/main/res/mipmap-xhdpi/ic_launcher.png" />
        <resource-file src="platforms/android/res/mipmap-xhdpi/ic_launcher_background.png" target="app/src/main/res/mipmap-xhdpi/ic_launcher_background.png" />
        <resource-file src="platforms/android/res/mipmap-xhdpi/ic_launcher_foreground.png" target="app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png" />
        <resource-file src="platforms/android/res/mipmap-xhdpi/ic_launcher_round.png" target="app/src/main/res/mipmap-xhdpi/ic_launcher_round.png" />
        <resource-file src="platforms/android/res/mipmap-xxhdpi/ic_launcher.png" target="app/src/main/res/mipmap-xxhdpi/ic_launcher.png" />
        <resource-file src="platforms/android/res/mipmap-xxhdpi/ic_launcher_background.png" target="app/src/main/res/mipmap-xxhdpi/ic_launcher_background.png" />
        <resource-file src="platforms/android/res/mipmap-xxhdpi/ic_launcher_foreground.png" target="app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png" />
        <resource-file src="platforms/android/res/mipmap-xxhdpi/ic_launcher_round.png" target="app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png" />
        <resource-file src="platforms/android/res/mipmap-xxxhdpi/ic_launcher.png" target="app/src/main/res/mipmap-xxxhdpi/ic_launcher.png" />
        <resource-file src="platforms/android/res/mipmap-xxxhdpi/ic_launcher_background.png" target="app/src/main/res/mipmap-xxxhdpi/ic_launcher_background.png" />
        <resource-file src="platforms/android/res/mipmap-xxxhdpi/ic_launcher_foreground.png" target="app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png" />
        <resource-file src="platforms/android/res/mipmap-xxxhdpi/ic_launcher_round.png" target="app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png" />
    </platform>
*/
