"use strict";!function(t){var r=(new Date).getTime(),n=[],o={},e=30,a=null,i=null,s=!1,f=null,l={useTransform:!0};function g(){return!0!==s&&void 0!==window.DeviceOrientationEvent}function m(t){if(!((new Date).getTime()<r+40)){r=(new Date).getTime();var l=null!=o.offset()?o.offset().left:0,m=null!=o.offset()?o.offset().top:0,c=t.pageX-l,u=t.pageY-m;if(function(t){if(0===t.offsetWidth||0===t.offsetHeight)return!1;for(var r=document.documentElement.clientHeight,n=t.getClientRects(),o=0,e=n.length;o<e;o++){var a=n[o];if(a.top>0?a.top<=r:a.bottom>0&&a.bottom<=r)return!0}return!1}(n[0].obj[0].parentNode)){if(g()){if(void 0===t.gamma)return void(s=!0);let r=function(t){let r=t.gamma,n=t.beta;if(90===Math.abs(window.orientation)){var o=r;r=n,n=o}return window.orientation<0&&(r=-r,n=-n),{x:r-(a=null===a?r:a),y:n-(i=null===i?n:i)}}(t);c=((c=(c=r.x/e)<-1?-1:c>1?1:c)+1)/2,u=((u=(u=r.y/e)<-1?-1:u>1?1:u)+1)/2}var d,p,b=c/(!0===g()?1:o.width()),v=u/(!0===g()?1:o.height());for(p=n.length;p--;)if(d=n[p],f.useTransform&&!d.background){let t=d.transformStartX+d.inversionFactor*(d.xRange*b),r=d.transformStartY+d.inversionFactor*(d.yRange*v),n=d.transformStartZ;d.obj.css({transform:"translate3d("+t+"px,"+r+"px,"+n+"px)"})}else{let t=d.startX+d.inversionFactor*(d.xRange*b),r=d.startY+d.inversionFactor*(d.yRange*v);d.background?d.obj.css("background-position",t+"px "+r+"px"):d.obj.css("left",t).css("top",r)}}}}t.fn.plaxify=function(r){return(f=t.extend({},l,r)).useTransform=!!f.useTransform&&function(){var t,r=document.createElement("p"),n={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};for(var o in document.body.insertBefore(r,null),n)void 0!==r.style[o]&&(r.style[o]="translate3d(1px,1px,1px)",t=window.getComputedStyle(r).getPropertyValue(n[o]));return document.body.removeChild(r),void 0!==t&&t.length>0&&"none"!==t}(),this.each((function(){for(var o=-1,e={xRange:t(this).data("xrange")||0,yRange:t(this).data("yrange")||0,zRange:t(this).data("zrange")||0,invert:t(this).data("invert")||!1,background:t(this).data("background")||!1},a=0;a<n.length;a++)this===n[a].obj.get(0)&&(o=a);for(var i in r)0==e[i]&&(e[i]=r[i]);if(e.inversionFactor=e.invert?-1:1,e.obj=t(this),e.background){if(pos=(e.obj.css("background-position")||"0px 0px").split(/ /),2!=pos.length)return;if(x=pos[0].match(/^((-?\d+)\s*px|0+\s*%|left)$/),y=pos[1].match(/^((-?\d+)\s*px|0+\s*%|top)$/),!x||!y)return;e.originX=e.startX=x[2]||0,e.originY=e.startY=y[2]||0,e.transformOriginX=e.transformStartX=0,e.transformOriginY=e.transformStartY=0,e.transformOriginZ=e.transformStartZ=0}else{var s=e.obj.position(),f=function(t){var r=[0,0,0],n=t.css("-webkit-transform")||t.css("-moz-transform")||t.css("-ms-transform")||t.css("-o-transform")||t.css("transform");if("none"!==n){var o=n.split("(")[1].split(")")[0].split(","),e=0,a=0,i=0;16==o.length?(e=parseFloat(o[o.length-4]),a=parseFloat(o[o.length-3]),i=parseFloat(o[o.length-2])):(e=parseFloat(o[o.length-2]),a=parseFloat(o[o.length-1]),i=0),r=[e,a,i]}return r}(e.obj);e.obj.css({transform:f.join()+"px",top:s.top,left:s.left,right:"",bottom:""}),e.originX=e.startX=s.left,e.originY=e.startY=s.top,e.transformOriginX=e.transformStartX=f[0],e.transformOriginY=e.transformStartY=f[1],e.transformOriginZ=e.transformStartZ=f[2]}e.startX-=e.inversionFactor*Math.floor(e.xRange/2),e.startY-=e.inversionFactor*Math.floor(e.yRange/2),e.transformStartX-=e.inversionFactor*Math.floor(e.xRange/2),e.transformStartY-=e.inversionFactor*Math.floor(e.yRange/2),e.transformStartZ-=e.inversionFactor*Math.floor(e.zRange/2),o>=0?n.splice(o,1,e):n.push(e)}))},t.plax={enable:function(r){r?(r.activityTarget&&(o=r.activityTarget||t(document.body)),"number"==typeof r.gyroRange&&r.gyroRange>0&&(e=r.gyroRange)):o=t(document.body),o.bind("mousemove.plax",(function(t){m(t)})),g()&&(window.ondeviceorientation=function(t){m(t)})},disable:function(r){if(t(document).unbind("mousemove.plax"),window.ondeviceorientation=void 0,r&&"boolean"==typeof r.restorePositions&&r.restorePositions)for(var o=n.length;o--;){let t=n[o];f.useTransform&&!t.background?t.obj.css("transform","translate3d("+t.transformOriginX+"px,"+t.transformOriginY+"px,"+t.transformOriginZ+"px)").css("top",t.originY):n[o].background?t.obj.css("background-position",t.originX+"px "+t.originY+"px"):t.obj.css("left",t.originX).css("top",t.originY)}r&&"boolean"==typeof r.clearLayers&&r.clearLayers&&(n=[])}},"undefined"!=typeof ender&&t.ender(t.fn,!0)}("undefined"!=typeof jQuery?jQuery:ender);
