
/* Smart HTML Elements v4.6.0 (2019-Oct) 
Copyright (c) 2011-2019 jQWidgets. 
License: https://htmlelements.com/license/ */

Smart("smart-multiline-text-box",class extends Smart.TextBox{static get properties(){return{autoCapitalize:{value:"none",allowedValues:["none","words","characters"],type:"string"},autoComplete:{value:"off",allowedValues:["on","off"],type:"string"},autoExpand:{value:!1,type:"boolean"},cols:{value:20,type:"number?"},enterKeyBehavior:{value:"newLine",allowedValues:["submit","clearOnSubmit","newLine"],type:"string"},horizontalScrollBarVisibility:{type:"string",value:"auto",allowedValues:["auto","disabled","hidden","visible"]},minLength:{value:0,type:"number"},resizable:{value:!1,type:"boolean"},rows:{value:5,type:"number?"},selectionDirection:{value:"none",allowedValues:["forward","backward","none"],type:"string"},selectionEnd:{value:0,reflectToAttribute:!1,type:"number"},selectionStart:{value:0,reflectToAttribute:!1,type:"number"},spellCheck:{value:!1,type:"boolean"},type:{value:"textarea",type:"string",defaultReflectToAttribute:!0,readonly:!0},verticalScrollBarVisibility:{type:"string",value:"auto",allowedValues:["auto","disabled","hidden","visible"]},wrap:{value:"soft",allowedValues:["hard","soft","off"],type:"string"}}}static get styleUrls(){return["smart.multilinetextbox.css"]}static get listeners(){return{"document.mousemove":"_documentSelectionOutsideHandler","container.resize":"_handleScrollbarsDisplay","document.move":"_resizeMoveHandler","document.up":"_upHandler",focus:"_focusHandler","horizontalScrollBar.change":"_horizontalScrollbarHandler",keydown:"_keyDownHandler",mouseenter:"_mouseEventsHandler",mouseleave:"_mouseEventsHandler",resize:"_handleScrollbarsDisplay","resizeElement.down":"_resizeDownHandler",styleChanged:"_handleScrollbarsDisplay","input.change":"_textBoxChangeHandler","input.focus":"_focusHandler","input.blur":"_blurHandler","input.keydown":"_textBoxKeyDownHandler","input.keyup":"_keyUpHandler","input.paste":"_textBoxChangeHandler","input.select":"_textBoxSelectHandler",wheel:"_mouseWheelHandler","verticalScrollBar.change":"_verticalScrollbarHandler"}}attached(){const a=this;super.attached(),a._scrollView||(a._scrollView=new Smart.Utilities.Scroll(a.$.input,a.$.horizontalScrollBar,a.$.verticalScrollBar))}detached(){const a=this;super.detached(),a._scrollView&&(a._scrollView.unlisten(),delete a._scrollView)}static get requires(){return{"Smart.ScrollBar":"smart.scrollbar.js"}}template(){return`<div id="container">
                    <span id="label" inner-h-t-m-l="[[label]]" class="smart-label"></span>
                    <div id="innerContainer" class="smart-inner-container">
                            <textarea class="smart-input" id="input"
                                autocapitalize="[[autoCapitalize]]"
                                autocomplete="off"
                                cols="[[cols]]"
                                disabled="[[disabled]]"
                                maxlength="[[maxLength]]"
                                minlength="[[minLength]]"
                                name="[[name]]"
                                placeholder="[[placeholder]]"
                                readonly="[[readonly]]"
                                required="[[required]]"
                                rows="[[rows]]"
                                spellcheck="[[spellCheck]]"
                                wrap="[[wrap]]"></textarea>
                            <smart-scroll-bar id="verticalScrollBar" animation="[[animation]]" disabled="[[disabled]]" orientation="vertical"></smart-scroll-bar>
                            <smart-scroll-bar id="horizontalScrollBar" animation="[[animation]]" disabled="[[disabled]]"></smart-scroll-bar>
                            <div id="resizeElement" class="smart-resize-element"></div>
                    </div>
                            <textarea id="textBoxHidden"
                                class="smart-text-box-hidden"
                                autocapitalize="[[autoCapitalize]]"
                                autocomplete="off"
                                cols="[[cols]]"
                                disabled="[[disabled]]"
                                inner-h-t-m-l="[[value]]"
                                maxlength="[[maxLength]]"
                                minlength="[[minLength]]"
                                name="[[name]]"
                                placeholder="[[placeholder]]"
                                readonly="[[readonly]]"
                                required="[[required]]"
                                rows="[[rows]]"
                                spellcheck="[[spellCheck]]"
                                wrap="[[wrap]]"></textarea>
                    <span id="hint" class="smart-hint"></span>
                </div>`}propertyChangedHandler(a,b,c){const d=this;switch(a){case"displayMode":d.$.input.value="escaped"===c?d._toEscapedDisplayMode(d.value):d.value=d._toDefaultDisplayMode(d.$.input.value);d._autoExpandUpdate(),d._handleScrollbarsDisplay();break;case"value":switch(d._preventProgramaticValueChange?(d._userValue="escaped"===d.displayMode?d._toDefaultDisplayMode(d.$.input.value):d.$.input.value,d._programmaticValue=c):d._userValue=d._programmaticValue=c,d.displayMode){case"escaped":d.$.input.value=d._toEscapedDisplayMode(d._userValue);break;default:d.$.input.value=d._userValue;}d._oldValue=b,d._autoExpandUpdate(),d._handleScrollbarsDisplay();break;case"horizontalScrollBarVisibility":case"verticalScrollBarVisibility":case"singleLine":case"wrap":case"resizable":case"placeholder":d._autoExpandUpdate(),d._handleScrollbarsDisplay();break;case"selectionEnd":case"selectionStart":d._handleSelectedText();break;case"rows":case"cols":d._updateSizeRowsCols();break;case"disabled":d._setFocusable();break;case"animation":case"readonly":break;default:super.propertyChangedHandler(a,b,c);}}selection(a){const b=this;let c=b.$.input.selectionStart,d=b.$.input.selectionEnd,e=b.value;return"escaped"===b.displayMode?(e=b.$.input.value.substring(c,d),"escaped"===a?e:b._toDefaultDisplayMode(e)):"escaped"===a?(e=e.substring(c,d),b._toEscapedDisplayMode(e)):(e=e.substring(c,d),e)}select(a,b){const c=this,d=Array.from(arguments).slice(0,2);let e,f;for(let c in d)d[c]=parseInt(d[c])||0;return(2===d.length?(e=Math.min([a,b]),f=Math.max([a,b])):e=d[0],2===d.length)?(e=parseInt(e),e=0<e?e<c.$.input.length?c.$.input.length:e:0,f<e?f=e:f>c.$.input.length&&(e=0),c.$.input.focus(),void c.$.input.setSelectionRange(e,f)):1===d.length?(c.$.input.focus(),void c.$.input.setSelectionRange(e,e+1)):void c.$.input.select()}_autoExpandUpdate(){const a=this;a.autoExpand&&(a.$.textBoxHidden.value=a.$.input.value,a.$.textBoxHidden.style.cssText="height:0px",a.$.input.style.cssText="height:"+a.$.textBoxHidden.scrollHeight+"px")}_blurHandler(){const a=this;a._outsideAutoScroll&&clearInterval(a._outsideAutoScroll),a.removeAttribute("focus"),a._preventProgramaticValueChange=!1,a._oldValue=a.value,a.value=a._userValue||a.value}_createElement(){const a=this;a.autoFocus&&(navigator.userAgent.match(/Edge/)?setTimeout(function(){a.$.input.focus(),a.setAttribute("focus","")},10):(a.$.input.focus(),a.setAttribute("focus","")));const b=a.$.input.innerHTML;a.value?a.$.input.innerHTML="escaped"===a.displayMode?a._toEscapedDisplayMode(a.value):a.value:0<b.length&&"escaped"===a.displayMode?(a.value=b,a.$.input.innerHTML=a._toEscapedDisplayMode(b)):0<b.length&&(a.value=b),a._setFocusable(),a._syncTextBoxContentOnInitialization(),a._scrollView=new Smart.Utilities.Scroll(a.$.input,a.$.horizontalScrollBar,a.$.verticalScrollBar),a._autoExpandUpdate(),a._handleScrollbarsDisplay(),a._initializationValue=a._oldValue=a.value,0<a.value.length?a.$.addClass("has-value"):a.$.removeClass("has-value"),a._handleHintContainer()}_handleScrollbarsDisplay(a){const b=this,c=b.$.input;setTimeout(function(){switch(b.horizontalScrollBarVisibility){case"disabled":b.$container.addClass("hscroll"),b.$.horizontalScrollBar.disabled=!0;break;case"hidden":b.$container.removeClass("hscroll");break;case"visible":b.$container.addClass("hscroll"),b._scrollView.scrollWidth=c.scrollWidth-c.clientWidth,b._scrollView.scrollTo(b.$.input.scrollLeft,!0),b.$.horizontalScrollBar.disabled=!1;break;default:c.scrollWidth>c.clientWidth?(b.$container.addClass("hscroll"),b._scrollView.scrollWidth=c.scrollWidth-c.clientWidth,a&&"resize"===a.type?b.$.input.scrollLeft=b._scrollView.scrollLeft:b._scrollView.scrollTo(b.$.input.scrollLeft,!0)):b.$container.removeClass("hscroll"),b.$.horizontalScrollBar.disabled=!1;}switch(b.verticalScrollBarVisibility){case"disabled":b.$container.addClass("vscroll"),b.$.verticalScrollBar.disabled=!0;break;case"hidden":b.$container.removeClass("vscroll");break;case"visible":b.$container.addClass("vscroll"),b._scrollView.scrollHeight=c.scrollHeight-c.clientHeight,b._scrollView.scrollTo(b.$.input.scrollTop),b.$.verticalScrollBar.disabled=!1;break;default:c.scrollHeight>c.clientHeight?(b.$container.addClass("vscroll"),b._scrollView.scrollHeight=c.scrollHeight-c.clientHeight,a&&"resize"===a.type?b.$.input.scrollTop=b._scrollView.scrollTop:b._scrollView.scrollTo(b.$.input.scrollTop)):b.$container.removeClass("vscroll"),b.$.verticalScrollBar.disabled=!1;}},0)}_focusHandler(a){const b=this;if(!b.disabled){if(a.target===b)return b.$.input.focus(),void(b._edgeSelect=!1);if(b.setAttribute("focus",""),b.selectAllOnFocus)if(navigator.userAgent.match(/Edge/)){const a=b.$.input.scrollTop;if(b._edgeSelect)return void(b._edgeSelect=!1);setTimeout(function(){b._edgeSelect=!0,b.$.input.select(),b.$.input.scrollTop=a},5)}else b.$.input.select()}}_horizontalScrollbarHandler(a){const b=this;b.disabled||"hidden"===b.horizontalScrollBarVisibility||"disabled"===b.horizontalScrollBarVisibility||(a.stopPropagation(),b.$.input.scrollLeft=a.detail.value)}_keyDownHandler(a){function b(b){let d=c.$.input.selectionStart,e=c.$.input.selectionEnd,f=c.$.input.value;a.preventDefault(),c.$.input.value=f.substring(0,d)+b+f.substring(e,f.length),c.value=c._toDefaultDisplayMode(c.$.input.value),c.$.input.selectionStart=d+2,c.$.input.selectionEnd=d+2}const c=this,d=a.key,e=a.shiftKey,f=a.ctrlKey,g=c.$.input.value;if(c.allowVerticalScrollbar&&c.$.input.selectionEnd>c.$.input.value.length-5&&c._scrollView.scrollTo(c._scrollView.scrollTop+(0>a.deltaY?-c.offsetHeight:c.offsetHeight)),-1<d.indexOf("Arrow"))return void a.stopPropagation();switch(d){case"Enter":{if("newLine"===c.enterKeyBehavior&&!f&&!e||"newLine"!==c.enterKeyBehavior&&(f||e)){"escaped"===c.displayMode&&b("\\n");break}a.preventDefault(),c._userValue="escaped"===c.displayMode?c._toDefaultDisplayMode(c.$.input.value):c.$.input.value,c.value=c._userValue,("submit"===c.enterKeyBehavior||"clearOnSubmit"===c.enterKeyBehavior||""!==g&&c._userValue!==c._oldValue)&&c.$.fireEvent("change",{oldValue:c._oldValue,value:g,type:"submit"}),"clearOnSubmit"===c.enterKeyBehavior&&(c.$.input.value=""),c._oldValue=c.value=c._toDefaultDisplayMode(c.$.input.value),c._submitted=!0,"escaped"!==c.displayMode||!(0>c.enterKeyBehavior.toLowerCase().indexOf("submit"))||f||e||b("\\n"),("submit"===c.enterKeyBehavior||"newLine"===c.enterKeyBehavior&&f)&&c.$.input.blur();break}case"Escape":if("none"===c.escKeyMode)return;switch(c.escKeyMode){case"none":break;case"clearValue":c.value=c.$.input.value="";break;case"previousValue":c.$.input.value="escaped"===c.displayMode?c._toEscapedDisplayMode(c._oldValue):c._oldValue;}break;case" ":"escaped"===c.displayMode&&b("\\s");break;case"Backspace":if("escaped"===c.displayMode&&c.$.input.selectionStart===c.$.input.selectionEnd){let a=c.$.input.selectionStart;"\\"===g[a-2]&&("s"===g[a-1]||"n"===g[a-1])&&(c.$.input.value=c.$.input.value.substring(0,a-2)+c.$.input.value.substring(a-2,c.$.input.value.length),c.$.input.selectionStart=a-2)}c._scrollView&&c._handleScrollbarsDisplay();}}_keyUpHandler(a){const b=this,c=a.key;"ArrowLeft"===c||"ArrowUp"===c||"ArrowDown"===c?b._handlePointerInEscapedSymbol():"ArrowRight"===c?b._handlePointerInEscapedSymbol("next"):void 0;b._autoExpandUpdate(),b._userValue="escaped"===b.displayMode?b._toDefaultDisplayMode(b.$.input.value):b.$.input.value,b._submitKeyUpHandler()}_textBoxKeyDownHandler(a){const b=this,c=a.key;b._scrollView&&b._handleScrollbarsDisplay(),b._autoExpandUpdate(),b.value&&0<b.value.length?b.$.addClass("has-value"):b.$.removeClass("has-value"),-1===["Enter","Escape"].indexOf(c)&&(b._preventProgramaticValueChange=!0),-1<["ArrowLeft","ArrowUp","ArrowDown","ArrowRight"].indexOf(c)&&b._scrollView.scrollTo(b.$.input.scrollTop),-1<["PageUp","PageDown"].indexOf(c)&&Smart.Utilities.Core.Browser.Chrome&&("PageUp"===a.key&&(b.$.input.setSelectionRange(0,0),b.$.input.scrollTop=0),"PageDown"===a.key&&(b.$.input.setSelectionRange(b.$.input.value.length,b.$.input.value.length),b.$.input.scrollTop=b._scrollView.verticalScrollBar.max),a.preventDefault())}_mouseWheelHandler(a){const b=this;b.disabled||b.$.verticalScrollBar.disabled||(b._scrollView.scrollTo(b._scrollView.scrollTop+(0>a.deltaY?-b.offsetHeight:b.offsetHeight)),b.$.input.scrollTop+=0>a.deltaY?-b.offsetHeight:b.offsetHeight,0<b.$.input.scrollTop&&a.preventDefault())}_syncTextBoxContentOnInitialization(){const a=this;let b;return b=""===a.value?a.innerHTML:a.value,"escaped"===a.displayMode?void(b.match(/\r\n|\n\r|\n|\r|\s|\t|\f|\r/g)?(a.value=a._initializationValue=b,a.$.input.value=a._toEscapedDisplayMode(b)):(a.value=a._initializationValue=a._toDefaultDisplayMode(b),a.$.input.value=b)):void(a.$.input.value=a.value=a._initializationValue=b)}_textBoxChangeHandler(a){const b=this,c=a.clipboardData||a.originalEvent&&a.originalEvent.clipboardData||window.clipboardData,d=b.value;if("escaped"===b.displayMode){const d=b.$.input.selectionStart,e=b.$.input.selectionEnd;if(c){let f=c.getData("text"),g=b.$.input.value;a.preventDefault(),f=b._toEscapedDisplayMode(f),b.$.input.value=g.substring(0,d)+f+g.substring(e,g.length)}b.value=b._toDefaultDisplayMode(b.$.input.value)}else b.value=b.$.input.value;b._handleScrollbarsDisplay(),0<b.value.length?b.$.addClass("has-value"):b.$.removeClass("has-value"),c||b.$.fireEvent("change",{value:b.value,oldValue:d,type:"blur"}),b._handleHintContainer()}_resizeDownHandler(){const a=this;a.disabled||!a.resizable||(a._resizeStarted=!0,a.$container.addClass("smart-resize"),!a.readonly&&a.$.input.setAttribute("readonly",""))}_resizeMoveHandler(a){const b=this;if(!b.disabled&&b.resizable&&b._resizeStarted){const c=b.getBoundingClientRect(),d={width:50,height:50},e=a.clientX-c.left,f=a.clientY-c.top;e>d.width&&(b.style.width=e+"px"),f>d.height&&(b.style.height=f+"px")}}_updateSizeRowsCols(){const a=this;a.$.container.removeAttribute("style"),setTimeout(function(){if("disabled"!==a.horizontalScrollBarVisibility&&"hidden"!==a.horizontalScrollBarVisibility||"disabled"!==a.verticalScrollBarVisibility&&"hidden"!==a.verticalScrollBarVisibility){const b=a.getBoundingClientRect();a.$.container.style.width=b.width+"px",a.$.container.style.height=b.height+"px"}},0)}_upHandler(a){const b=this;return b._selectionStarted=!1,b.disabled?void 0:a.originalEvent.target===b.$.input?void b._handlePointerInEscapedSymbol():void(b.$container.removeClass("smart-resize"),!b.readonly&&b.$.input.removeAttribute("readonly"),b._resizeStarted&&b.$.input.focus(),b._resizeStarted=!1)}_verticalScrollbarHandler(a){const b=this;b.disabled||"disabled"===b.verticalScrollBarVisibility||"hidden"===b.verticalScrollBarVisibility||(a.stopPropagation(),b.$.input.scrollTop=a.detail.value)}_documentDownHandler(a){const b=this;b._selectionStarted=!1;a.originalEvent&&b.$.input.contains(a.originalEvent.target)&&(b._selectionStarted=!0,b._selectionStartTime=new Date,b._pointerDown={pageX:a.pageX,pageY:a.pageY},b._edgeSelect=!1)}_documentSelectionOutsideHandler(a){function b(b){const c=d.getBoundingClientRect(),e=document.documentElement,f=b?c.left+e.scrollLeft-a.pageX:c.top+e.scrollTop-a.pageY,g=b?"Left":"Top";0<f?(d.$.input["scroll"+g]-=10,d._scrollView["scroll"+g]-=10):(d.$.input["scroll"+g]+=10,d._scrollView["scroll"+g]+=10)}var c=Math.abs;const d=this;if(clearInterval(d._outsideAutoScroll),!d._selectionStarted)return;const e=d.$.input.getBoundingClientRect(),f=e.y+10,g=e.y+e.height-10;if(a.pageY>f&&a.pageY<g)return;const h=300>new Date-d._selectionStartTime,i=!h&&(3<=c(d._pointerDown.pageX-a.pageX)||3<=c(d._pointerDown.pageY-a.pageY));i&&(d._outsideAutoScroll=setInterval(function(){b(),b(!0)},10))}_selectStartHandler(){}_styleChangedHandler(){}});