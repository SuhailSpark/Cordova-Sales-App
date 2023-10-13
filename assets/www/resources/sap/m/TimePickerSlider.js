/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','./TimePickerSliderRenderer','sap/ui/core/IconPool'],function(q,C,T,I){"use strict";var a=C.extend("sap.m.TimePickerSlider",{metadata:{library:"sap.m",properties:{selectedValue:{type:"string",defaultValue:null},isCyclic:{type:"boolean",defaultValue:true},label:{type:"string",defaultValue:null},isExpanded:{type:"boolean",defaultValue:false}},aggregations:{items:{type:"sap.m.VisibleItem",multiple:true,singularName:"item"},_arrowUp:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_arrowDown:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{expanded:{}}},renderer:T.render});var S=sap.ui.getCore().getConfiguration().getAnimation()?200:0;var M=50;a.prototype.init=function(){this._bIsDrag=null;this._selectionOffset=0;this._mousedown=false;this._dragSession=null;this._iSelectedItemIndex=-1;this._animatingSnap=false;this._iSelectedIndex=-1;this._animating=false;this._intervalId=null;this._maxScrollTop=null;this._minScrollTop=null;this._marginTop=null;this._marginBottom=null;this._bOneTimeValueSelectionAnimation=false;if(sap.ui.Device.system.desktop){this._fnHandleTypeValues=t.call(this);}this._initArrows();};a.prototype.onAfterRendering=function(){if(sap.ui.Device.system.phone){q.sap.delayedCall(0,this,this._afterExpandCollapse);}else{this._afterExpandCollapse();}this._attachEvents();};a.prototype.onThemeChanged=function(e){this.invalidate();};a.prototype.fireTap=function(e){var s,i,g;if(!this.getIsExpanded()){if(sap.ui.Device.system.desktop){this.focus();}else{this.setIsExpanded(true);}}else{s=e.srcElement||e.originalTarget;if(s&&s.tagName.toLowerCase()==="li"){i=q(s).text();g=F.call(this,i);this._bOneTimeValueSelectionAnimation=true;this.setSelectedValue(g);}else{this._addSelectionStyle();this.focus();}}};a.prototype.setSelectedValue=function(v){var i=b(this._getVisibleItems(),function(E){return E.getKey()===v;}),e=this,g,s,h,j;if(i===-1){return this;}if(this.getDomRef()){s=this._getSliderContainerDomRef();h=this._getItemHeightInPx();j=this._getContentRepeat();if(i*h>=this._selectionOffset){g=this._getVisibleItems().length*Math.floor(j/2)+i;}else{g=this._getVisibleItems().length*Math.ceil(j/2)+i;}if(this._bOneTimeValueSelectionAnimation){this._animatingSnap=true;s.animate({scrollTop:g*h-this._selectionOffset},S,'linear',function(){s.clearQueue();e._animatingSnap=false;e._bOneTimeValueSelectionAnimation=false;});}else{s.scrollTop(g*h-this._selectionOffset);}this._removeSelectionStyle();this._iSelectedItemIndex=g;this._addSelectionStyle();}return this.setProperty("selectedValue",v,true);};a.prototype.setIsExpanded=function(v,s){this.setProperty("isExpanded",v,true);if(!this.getDomRef()){return this;}var $=this.$();if(v){$.addClass("sapMTPSliderExpanded");if(sap.ui.Device.system.phone){q.sap.delayedCall(0,this,function(){this._updateDynamicLayout(v);if(!s){this.fireExpanded({ctrl:this});}});}else{this._updateDynamicLayout(v);if(!s){this.fireExpanded({ctrl:this});}}}else{this._stopAnimation();if(this._animatingSnap===true){this._animatingSnap=false;this._getSliderContainerDomRef().stop(true);this._scrollerSnapped(this._iSelectedIndex);}$.removeClass("sapMTPSliderExpanded");this._updateMargins(v);if(sap.ui.Device.system.phone){q.sap.delayedCall(0,this,this._afterExpandCollapse);}else{this._afterExpandCollapse();}}return this;};a.prototype.setIsCyclic=function(v){if(this.getDomRef()){if(v){this.$().removeClass("sapMTimePickerSliderShort");}else{this.$().addClass("sapMTimePickerSliderShort");}}return this.setProperty("isCyclic",v,false);};a.prototype.onfocusin=function(e){if(sap.ui.Device.system.desktop&&!this.getIsExpanded()){this.setIsExpanded(true);}};a.prototype.onfocusout=function(e){var s=e.relatedTarget?e.relatedTarget.id:null,A=[this.getAggregation("_arrowUp").getId(),this.getAggregation("_arrowDown").getId()];if(s&&A.indexOf(s)!==-1){return;}if(sap.ui.Device.system.desktop&&this.getIsExpanded()){this.setIsExpanded(false);}};a.prototype._onmousewheel=function(e){e.preventDefault();e.stopPropagation();if(!this.getIsExpanded()){return false;}var O=e.originalEvent,D=O.detail?(-O.detail>0):(O.wheelDelta>0),r=D?Math.ceil:Math.floor,w=O.detail?(-O.detail/3):(O.wheelDelta/120),g=this,R;if(!w){return false;}if(!this._aWheelDeltas){this._aWheelDeltas=[];}g._aWheelDeltas.push(w);if(!this._bWheelScrolling){this._bWheelScrolling=true;this._intervalId=setInterval(function(){if(!g._aWheelDeltas.length){clearInterval(g._intervalId);g._bWheelScrolling=false;}else{R=g._aWheelDeltas[0];g._aWheelDeltas=[];R=r(R);if(R){g._offsetSlider(R);}}},150);}return false;};a.prototype.onsappageup=function(e){if(this.getIsExpanded()){var i=this._getVisibleItems()[0];this.setSelectedValue(i.getKey());}};a.prototype.onsappagedown=function(e){if(this.getIsExpanded()){var l=this._getVisibleItems()[this._getVisibleItems().length-1];this.setSelectedValue(l.getKey());}};a.prototype.onsapup=function(e){if(this.getIsExpanded()){this._offsetValue(-1);}};a.prototype.onsapdown=function(e){if(this.getIsExpanded()){this._offsetValue(1);}};a.prototype.onkeydown=function(e){var k=e.which||e.keyCode,K=q.sap.KeyCodes;if((k>=K.A&&k<=K.Z)||(k>=K.DIGIT_0&&k<=K.DIGIT_9)){this._fnHandleTypeValues(e.timeStamp,k);}};a.prototype._getSliderContainerDomRef=function(){return this.$().find(".sapMTimePickerSlider");};a.prototype._getContentRepeat=function(){var i;if(this.getIsCyclic()){i=Math.ceil(M/this._getVisibleItems().length);i=Math.max(i,3);}else{i=1;}return i;};a.prototype._getItemHeightInPx=function(){return this.$("content").find("li:not(.TPSliderItemHidden)").outerHeight();};a.prototype._updateSelectionFrameLayout=function(){var $,i,e,s,g;if(this.getDomRef()){g=this._getItemHeightInPx();$=this.$().find(".sapMTPPickerSelectionFrame");if(sap.ui.Device.system.phone){s=this.$().offset().top;i=(this.$().height()-g)/2+s;}else{e=this.$().parents(".sapUiSizeCompact").length>0?8:16;i=(this.$().height()-g)/2+e;}$.css("top",i);if(sap.ui.Device.system.phone){q.sap.delayedCall(0,this,this._afterExpandCollapse);}else{this._afterExpandCollapse();}}};a.prototype._updateStepAndValue=function(n,s){var v=0,$,i;for(i=0;i<this.getItems().length;i++){if(i%s!==0&&i!==n){this.getItems()[i].setVisible(false);}else{this.getItems()[i].setVisible(true);v++;}}if(v>2&&v<13&&this.getDomRef()){$=this.$().find(".sapMTimePickerSlider");$.className="";q($).addClass("sapMTimePickerSlider SliderValues"+v.toString());}this.setIsCyclic(v>2);this.setSelectedValue(n.toString());};a.prototype._updateMargins=function(i){var e,m,g,h,$;if(this.getDomRef()){e=this._getItemHeightInPx();$=this.$().find(".SliderValues3,.SliderValues4,.SliderValues5,.SliderValues6,.SliderValues7,.SliderValues8,.SliderValues9,.SliderValues10,.SliderValues11,.SliderValues12");if(!$.length){return;}if(i){m=(this.$().height()-this._getVisibleItems().length*e)/2;g=m;q.each($.prevAll().filter(f),function(j,k){g-=q(k).height();});g=Math.max(g,0);h=m;q.each($.nextAll().filter(f),function(j,k){h-=q(k).height();});h=Math.max(h,0);if(h===0&&g===0){return;}}else{g=0;h=0;}$.css("margin-top",g);$.css("margin-bottom",h);}};a.prototype._updateDynamicLayout=function(i){this._updateMargins(i);this._updateSelectionFrameLayout();};function f(){return q(this).css("display")!=="none";}a.prototype._getSelectionFrameTopOffset=function(){var $=this._getSliderContainerDomRef().find(".sapMTPPickerSelectionFrame"),e=$.offset();return e.top;};a.prototype._animateScroll=function(s){var $=this._getSliderContainerDomRef(),p=$.scrollTop(),e=25,g=$.height(),h=this.$("content").height(),D=200,i=g+D,j=this._getContentRepeat(),k=this.getIsCyclic(),l=0.9,m=0.05,n=this;this._intervalId=setInterval(function(){n._animating=true;p=p-s*e;if(k){p=n._getUpdatedCycleScrollTop(g,h,p,i,j);}else{if(p>n._maxScrollTop){p=n._maxScrollTop;s=0;}if(p<n._minScrollTop){p=n._minScrollTop;s=0;}}$.scrollTop(p);s*=l;if(Math.abs(s)<m){var r=n._getItemHeightInPx();var O=n._selectionOffset?(n._selectionOffset%r):0;var u=Math.round((p+O)/r)*r-O;clearInterval(n._intervalId);n._animating=null;n._iSelectedIndex=Math.round((p+n._selectionOffset)/r);n._animatingSnap=true;$.animate({scrollTop:u},S,'linear',function(){$.clearQueue();n._animatingSnap=false;n._scrollerSnapped(n._iSelectedIndex);});}},e);};a.prototype._stopAnimation=function(){if(this._animating){clearInterval(this._intervalId);this._animating=null;}};a.prototype._startDrag=function(p){if(!this._dragSession){this._dragSession={};this._dragSession.positions=[];}this._dragSession.pageY=p;this._dragSession.startTop=this._getSliderContainerDomRef().scrollTop();};a.prototype._doDrag=function(p,e){if(this._dragSession){this._dragSession.offsetY=p-this._dragSession.pageY;this._dragSession.positions.push({pageY:p,timeStamp:e});if(this._dragSession.positions.length>20){this._dragSession.positions.splice(0,10);}if(this._bIsDrag){this._getSliderContainerDomRef().scrollTop(this._dragSession.startTop-this._dragSession.offsetY);}}};a.prototype._endDrag=function(p,e){if(this._dragSession){var O,g;for(var i=this._dragSession.positions.length-1;i>=0;i--){O=e-this._dragSession.positions[i].timeStamp;g=p-this._dragSession.positions[i].pageY;if(O>100){break;}}var s=(g/O);if(this._animating){clearInterval(this._intervalId);this._intervalId=null;this._animating=null;}this._dragSession=null;this._animateScroll(s);}};a.prototype._afterExpandCollapse=function(){var s=this.getSelectedValue(),e=this._getSelectionFrameTopOffset(),$=this._getSliderContainerDomRef(),g=$.offset(),i,l,L,h;this._selectionOffset=e-g.top;if(!this.getIsCyclic()){l=q("#"+this.getId()+"-content");h=this._getItemHeightInPx();L=this.$().height();if(this.getIsExpanded()){this._minScrollTop=0;this._marginTop=e-g.top;this._maxScrollTop=h*(this._getVisibleItems().length-1);i=$.height();this._marginBottom=i-this._marginTop-h;if(this._marginBottom<0){this._marginBottom=L-this._marginTop-h;}l.css("margin-top",this._marginTop);l.css("margin-bottom",this._marginBottom);}else{this._marginBottom=L-h;l.css("margin-top",0);l.css("margin-bottom",this._marginBottom);}this._selectionOffset=0;}if(!this.getIsExpanded()){this._selectionOffset=0;}this.$().attr('aria-expanded',this.getIsExpanded());this.setSelectedValue(s);};a.prototype._getUpdatedCycleScrollTop=function(i,e,g,D,h){var j=e-g-i;while(j<D){g=g-e/h;j=e-g-i;}while(g<D){g=g+e/h;}return g;};a.prototype._scrollerSnapped=function(i){var s=i,e=this._getVisibleItems().length,n;while(s>=e){s=s-e;}if(!this.getIsCyclic()){s=i;}n=this._getVisibleItems()[s].getKey();this.setSelectedValue(n);};a.prototype._updateScroll=function(){var s=this.getSelectedValue();if(s!==this._getVisibleItems()[0].getKey()&&this._getSliderContainerDomRef().scrollTop()+(this._selectionOffset?this._selectionOffset:0)===0){this.setSelectedValue(s);}};a.prototype._addSelectionStyle=function(){var $=this.$("content").find("li:not(.TPSliderItemHidden)"),s=$.eq(this._iSelectedItemIndex).text(),A;if(!s){return;}A=F.call(this,s);$.eq(this._iSelectedItemIndex).addClass("sapMTimePickerItemSelected");document.getElementById(this.getId()+"-valDescription").innerHTML=A;};a.prototype._removeSelectionStyle=function(){var $=this.$("content").find("li:not(.TPSliderItemHidden)");$.eq(this._iSelectedItemIndex).removeClass("sapMTimePickerItemSelected").attr("aria-selected","false");};a.prototype._attachEvents=function(){var e=this._getSliderContainerDomRef()[0],D=sap.ui.Device;if(D.system.combi){e.addEventListener("touchstart",q.proxy(o,this),false);e.addEventListener("touchmove",q.proxy(c,this),false);document.addEventListener("touchend",q.proxy(d,this),false);e.addEventListener("mousedown",q.proxy(o,this),false);document.addEventListener("mousemove",q.proxy(c,this),false);document.addEventListener("mouseup",q.proxy(d,this),false);}else{if(D.system.phone||D.system.tablet){e.addEventListener("touchstart",q.proxy(o,this),false);e.addEventListener("touchmove",q.proxy(c,this),false);document.addEventListener("touchend",q.proxy(d,this),false);}else{e.addEventListener("mousedown",q.proxy(o,this),false);document.addEventListener("mousemove",q.proxy(c,this),false);document.addEventListener("mouseup",q.proxy(d,this),false);}}};a.prototype._detachEvents=function(){var e=this.getDomRef(),D=sap.ui.Device;if(D.system.combi){e.removeEventListener("touchstart",q.proxy(o,this),false);e.removeEventListener("touchmove",q.proxy(c,this),false);document.removeEventListener("touchend",q.proxy(d,this),false);e.removeEventListener("mousedown",q.proxy(o,this),false);document.removeEventListener("mousemove",q.proxy(c,this),false);document.removeEventListener("mouseup",q.proxy(d,this),false);}else{if(D.system.phone||D.system.tablet){e.removeEventListener("touchstart",q.proxy(o,this),false);e.removeEventListener("touchmove",q.proxy(c,this),false);document.removeEventListener("touchend",q.proxy(d,this),false);}else{e.removeEventListener("mousedown",q.proxy(o,this),false);document.removeEventListener("mousemove",q.proxy(c,this),false);document.removeEventListener("mouseup",q.proxy(d,this),false);}}};a.prototype._offsetValue=function(i){var s=this._getSliderContainerDomRef(),e=s.scrollTop(),g=this._getItemHeightInPx(),h=e+i*g,j=this.getIsCyclic(),k=this,l=this._iSelectedItemIndex+i;if(!j){if(l<0||l>=this._getVisibleItems().length){return;}if(h>this._maxScrollTop){h=this._maxScrollTop;}if(h<this._minScrollTop){h=this._minScrollTop;}}this._animatingSnap=true;s.animate({scrollTop:h},S,'linear',function(){s.clearQueue();k._animatingSnap=false;k._scrollerSnapped(l);});};a.prototype._offsetSlider=function(O){var s=this._getSliderContainerDomRef().scrollTop(),e=this,$=e._getSliderContainerDomRef().height(),g=e.$("content").height(),D=200,i=$+D,h=e._getContentRepeat(),j=e.getIsCyclic(),k=e._getItemHeightInPx();s=s-O*k;if(j){s=e._getUpdatedCycleScrollTop($,g,s,i,h);}else{if(s>e._maxScrollTop){s=e._maxScrollTop;}if(s<e._minScrollTop){s=e._minScrollTop;}}e._getSliderContainerDomRef().scrollTop(s);e._iSelectedIndex=Math.round((s+e._selectionOffset)/k);e._scrollerSnapped(e._iSelectedIndex);};a.prototype._initArrows=function(){var e=this,A,g;A=new sap.m.Button({icon:I.getIconURI("slim-arrow-up"),press:function(E){e._offsetValue(-1);},type:'Transparent'});A.addEventDelegate({onAfterRendering:function(){A.$().attr("tabindex",-1);}});this.setAggregation("_arrowUp",A);g=new sap.m.Button({icon:I.getIconURI("slim-arrow-down"),press:function(E){e._offsetValue(1);},type:'Transparent'});g.addStyleClass("sapMTimePickerItemArrowDown");g.addEventDelegate({onAfterRendering:function(){g.$().attr("tabindex",-1);}});this.setAggregation("_arrowDown",g);};function b(A,p){if(A==null){throw new TypeError('findIndex called with null or undefined array');}if(typeof p!=='function'){throw new TypeError('predicate must be a function');}var l=A.length;var e=arguments[1];var v;for(var i=0;i<l;i++){v=A[i];if(p.call(e,v,i,A)){return i;}}return-1;}var o=function(e){var p=e.touches&&e.touches.length?e.touches[0].pageY:e.pageY;this._bIsDrag=false;if(!this.getIsExpanded()){return;}this._stopAnimation();this._startDrag(p);e.preventDefault();this._mousedown=true;};var c=function(e){var p=e.touches&&e.touches.length?e.touches[0].pageY:e.pageY;if(!this._mousedown||!this.getIsExpanded()){return;}if(!this._bIsDrag&&this._dragSession&&this._dragSession.positions.length){var g=this._dragSession.positions.some(function(h){return Math.abs(h.pageY-p)>5;});if(g){this._bIsDrag=true;}}this._doDrag(p,e.timeStamp);this._mousedown=true;};var d=function(e){var p=e.changedTouches&&e.changedTouches.length?e.changedTouches[0].pageY:e.pageY;if(this._bIsDrag===false){this.fireTap(e);this._dragSession=null;}this._bIsDrag=true;if(!this.getIsExpanded()){this._dragSession=null;return;}this._endDrag(p,e.timeStamp);this._mousedown=false;};var F=function(s){var i=this._getVisibleItems();var e=b(i,function(g){return g.getText()===s;});return i[e].getKey();};var t=function(){var l=-1,L=-1,w=1000,s="",e=function(i,k){var m;if(l+w<i){s="";}else{if(L!==-1){q.sap.clearDelayedCall(L);L=-1;}}s+=String.fromCharCode(k).toLowerCase();m=this._getVisibleItems().filter(function(g){return g.getKey().indexOf(s)===0;});if(m.length>1){L=q.sap.delayedCall(w,this,function(){this.setSelectedValue(s);s="";L=-1;});}else if(m.length===1){this.setSelectedValue(m[0].getKey());s="";}l=i;};return e;};a.prototype._getVisibleItems=function(){return this.getItems().filter(function(i){return i.getVisible();});};return a;},false);
