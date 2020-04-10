/*
 * 'header_nav' component.
 *
 *  pageLayout / windowLayout
 *  Display a navigation bar on top of the pages.
 *
 *  This area is a restricted resource. Its content depends of the available
 *  width:
 *  - always displayed:
 *      > the gear menu
 *      > at least a short title
 *      > the sign-in area (resp. a signed-in indicator)
 *  - depending of the available width:
 *      > a longer title
 *      > the layout menu, maybe with its label
 *      > zero to n badges
 *      > the email address of the signed-in user
 *
 * Breakpoints computing:
 *  gear menu: 54+16 = 70px
 *  short title: 100+16 = 116px -> 120px
 *  long title: 264+16 = 280px (+160px)
 *  badges: depending of the count of chars
 *  layout menu, icon only: 70px
 *  layout menu, icon+text: 160px (+90px)
 *  login infos: ~150px
 *
 *  At the very minimum:
 *  - gear menu + short title + login infos = 340px => first standard breakpoint is 360px
 *  Then, by priority order:
 *  - display all badges (or none) - Only relevant in pageLayout
 *  - layout menu, icon only
 *  - long title
 *  - layout menu, icon+text
 *
 *  Available buttons:
 *  - change the layout mode (desktop vs touchable device)
 *  - let the user sign in / sign out.
 */
import '/imports/client/components/gear_menu/gear_menu.js';
import '/imports/client/components/layout_select/layout_select.js';
import '/imports/client/components/menu_bar/menu_bar.js';
import '/imports/client/components/text_badge/text_badge.js';
import './header_nav.html';

Template.header_nav.fn = {
    // return the total count of chars of all badges
    badgesCount(){
        const hash = Session.get( 'header.badges' ) || {};
        let count = 0;
        Object.keys( hash ).forEach( name => {
            count += hash[name].toString().length;
        });
        return count;
    },
    init( self ){
        const fn = Template.header_nav.fn;
        const width = Ronin.ui.runWidth();
        let used = 0;
        // gear menu is always displayed
        used += 70;
        // at least a short title is dsplayed
        used += 120;
        self.ronin.dict.set( 'title', false );
        // logged-in/logged-out informations are always displayed
        used += Meteor.userId() ? 150 : 80;
        // evaluate the space required by the badges (all are displayed or none)
        self.ronin.dict.set( 'badges', false );
        if( Ronin.ui.runLayout() === R_LYT_PAGE ){
            const needed = 10 * fn.badgesCount();
            if( used+needed <= width ){
                self.ronin.dict.set( 'badges', true );
                used += needed;
            }
        }
        // try to display layout menu (icon only)
        self.ronin.dict.set( 'layout', 'none' );
        if( used+70 <= width ){
            self.ronin.dict.set( 'layout', 'icon' );
            used += 70;
        }
        // have a long title ?
        //  long title need 160, and is prioritary on layout menu label which only requires 90
        //  it is so possible to have the later without the former
        if( used+160 <= width ){
            self.ronin.dict.set( 'title', true );
            used += 160;
        }
        // try to display layout menu with text
        if( used+90 <= width ){
            self.ronin.dict.set( 'layout', 'text' );
            used += 90;
        }
    }
};

Template.header_nav.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict()
    };
    this.ronin.dict.set( 'title', false );
    this.ronin.dict.set( 'badges', false );
    this.ronin.dict.set( 'layout', 'none' );
});

Template.header_nav.helpers({
    // template helper
    //  only used in pageLayout
    badgesList(){
        return Object.keys( Session.get( 'header.badges' ) || {} );
    },
    // template helper
    //  only used in pageLayout
    badgeText( badge ){
        const hash = Session.get( 'header.badges' ) || {};
        return hash[badge] || '';
    },
    hasBadges(){
        return Template.instance().ronin.dict.get( 'badges' );
    },
    hasMenuBar(){
        return false; //Ronin.ui.runWidth() > 750;
    },
    hasLayout(){
        return Template.instance().ronin.dict.get( 'layout' ) !== 'none';
    },
    // console helper - debug accounts-ui
    layoutMode(){
        return Template.instance().ronin.dict.get( 'layout' );
    },
    // console helper - debug accounts-ui
    loginConsole(){
        //console.log( Accounts.ui );
    },
    // at the rendering very beginning, evaluate what we are able to display
    templateInit(){
        const self = Template.instance();
        Template.header_nav.fn.init( self );
    },
    // only change title on the page-based layout
    titleLabel(){
        let title = null;
        if( Ronin.ui.runLayout() === R_LYT_PAGE ){
            title = Session.get( 'header.title' );
        }
        if( !title ){
            const long = Template.instance().ronin.dict.get( 'title' );
            title = 'Ronin '+( long ? 'takes care of your thoughts' : 'rocks!' );
        }
        return title;
    }
});
