/*
 * 'topics_grid' component.

 *  Display topics in a grid.
 *
 *  NB: this topics_grid is only displayed in windowLayout mode.
 *
 *  Rationale: see actions_grid.js
 *
 *  Parameters:
 *  - 'data' passed from setup_tabs:
 *      > gtd: the GTD item, here 'gtd-setup-contexts'
 *      > items: the cursor to the setup elements.
 *
 *  Session variables:
 *  - setup.tab.name: the current tab.
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/interfaces/igrid/igrid.js';
import './topics_grid.html';

Template.topics_grid.fn = {
    compare( a, b ){
        const ita = Topics.findOne({ _id: $( a ).attr( 'data-row-id' )});
        const itb = Topics.findOne({ _id: $( b ).attr( 'data-row-id' )});
        return compareUpdates( ita, itb );
    }
}

Template.topics_grid.onRendered( function(){
    //console.log( 'topics_grid.onRendered '+this.data.gtdid );
    this.$( '.js-grid' ).IGrid({
        sort: {
            compare: [
                {
                    column: 'created',
                    compare: Template.topics_grid.fn.compare
                }
            ]
        }
    });
});

Template.topics_grid.helpers({
    colorBackground(){
        const instance = Template.instance();
        let color = 'white';
        if( instance.view.isRendered ){
            const elt = instance.ronin.dom.backcolor;
            color = this.item ? this.item.backgroundColor : elt.spectrum( 'get' );
            elt.spectrum( 'set', color );
        }
        return color;
    },
    colorText(){
        const instance = Template.instance();
        let color = 'black';
        if( instance.view.isRendered ){
            const elt = instance.ronin.dom.textcolor;
            const color = this.item ? this.item.textColor : elt.spectrum( 'get' );
            elt.spectrum( 'set', color );
        }
        return color;
    },
    getCreated( it ){
        return moment( it.updatedAt ? it.updatedAt : it.createdAt ).format('DD/MM/GGGG');
    },
    items(){
        return Topics.find();
    },
    // do not specify the style if it is the default value
    styleItem( it ){
        // attribute helper as an object doesn't work oob
        // see https://github.com/meteor/blaze/issues/254
        //return {
        //    style: {
        //        color: it.textColor || Topics.fn.textColor,
        //        background: it.backgroundColor || Topics.fn.backgroundColor
        //    }
        //};
        // also unable to return the full 'style=...' string
        //  as the browser complains DOMException: "String contains an invalid character"
        //const style = 'style="..."'+
        let style = 'color:'+( it.textColor || Topics.fn.colorText )+';';
        if( it.backgroundColor && it.backgroundColor !== Topics.fn.colorBackground ){
            style += 'background-color:'+it.backgroundColor+';';
        }
        //console.log( style );
        return style;
    }
});
