(this.webpackJsonpsquiggler=this.webpackJsonpsquiggler||[]).push([[0],{24:function(e,t,n){e.exports={app:"App_app__1kX79",header:"App_header__3ZZ1n",headerText:"App_headerText__1Yih3",main:"App_main__3ZkGI"}},25:function(e,t,n){e.exports={container:"Main_container__1DBl6",buttonContainer:"Main_buttonContainer__3A4h2",drawingArea:"Main_drawingArea__1z_pU",canvas:"Main_canvas__38O29"}},59:function(e,t,n){},67:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),r=n(10),c=n.n(r),o=(n(59),n(18)),s=n(24),u=n.n(s),d=n(105),l=n(106),h=n(99),v=n(96),j=n(46),b=n.n(j),g=n(25),p=n.n(g),x=n(4);function f(e){return Math.floor(Math.random()*e)}function O(e){return Math.floor(Math.random()*e/2)+e/4}function m(e,t,n){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=a.startX,r=void 0===i?null:i,c=a.startY,o=void 0===c?null:c;r||(r=O(t)),o||(o=O(n)),e.moveTo(r,o);var s=O(t),u=O(n);return e.lineTo(s,u),{startX:s,startY:u}}function w(e,t,n){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=a.startX,r=void 0===i?null:i,c=a.startY,o=void 0===c?null:c,s=a.startBezierX,u=a.startBezierY;r||(r=O(t)),o||(o=O(n)),e.moveTo(r,o);var d=O(t),l=O(n);s||(s=r<d?r+f(t/2):r-f(t/2)),u||(u=o<l?o+f(t/2):o-f(t/2));var h=r<d?d-f(t/2):d+f(t/2),v=o<l?l-f(t/2):l+f(t/2);return e.bezierCurveTo(s,u,h,v,d,l),{startX:d,startY:l,startBezierX:2*d-h,startBezierY:2*l-v}}function C(e,t){var n=t.a,a=t.b,i=t.c,r=t.d;e.beginPath(),e.moveTo(a.x,a.y);var c=function(e){var t=e.a,n=e.b,a=e.c;return{x:n.x+(a.x-t.x)/6,y:n.y+(a.y-t.y)/6}}({a:n,b:a,c:i}),o=function(e){var t=e.b,n=e.c,a=e.d;return{x:n.x+(t.x-a.x)/6,y:n.y+(t.y-a.y)/6}}({b:a,c:i,d:r});e.bezierCurveTo(c.x,c.y,o.x,o.y,i.x,i.y),e.strokeStyle="black",e.lineWidth=3,e.lineCap="smooth",e.stroke()}function y(e,t,n){var a=e.current.getBoundingClientRect(),i=a.top;return{x:t-a.left-window.pageXOffset,y:n-i-window.pageYOffset}}function _(){var e=Object(a.useState)(!1),t=Object(o.a)(e,2),n=t[0],i=t[1],r=Object(a.useState)({}),c=Object(o.a)(r,2),s=c[0],u=c[1],d=Object(a.useRef)(),l=Object(a.useCallback)((function(){var e=d.current,t=function(){var e=d.current,t=e.getBoundingClientRect(),n=t.width,a=t.height;return e.setAttribute("width",n),e.setAttribute("height",a),{width:n,height:a}}(),n=t.width,a=t.height,i=e.getContext("2d");i.clearRect(0,0,n,a),function(e,t,n){var a;e.beginPath();for(var i=0;i<f(5)+2;i++)a=Math.random()>.5?w(e,t,n,a):m(e,t,n,a);e.lineWidth=5,e.lineCap="round",e.stroke()}(i,n,a)}),[d]);Object(a.useEffect)((function(){l()}),[l]);var j=function(e){if(n){var t={a:s.b,b:s.c,c:s.d,d:y(d,e.pageX,e.pageY)};C(d.current.getContext("2d"),t),u(t)}},g=function(e){if(!(e.touches.length>1)&&n){var t,a,i,r,c=null===e||void 0===e||null===(t=e.changedTouches)||void 0===t||null===(a=t[0])||void 0===a?void 0:a.pageX,o=null===e||void 0===e||null===(i=e.changedTouches)||void 0===i||null===(r=i[0])||void 0===r?void 0:r.pageY,l={a:s.b,b:s.c,c:s.d,d:y(d,c,o)};C(d.current.getContext("2d"),l),u(l)}};return Object(x.jsxs)(v.a,{className:p.a.container,children:[Object(x.jsx)("div",{className:p.a.drawingArea,children:Object(x.jsx)("canvas",{ref:d,className:p.a.canvas,onMouseDown:function(e){i(!0);var t=y(d,e.pageX,e.pageY);u({b:t,c:t,d:t})},onMouseMove:j,onMouseUp:function(e){j(e),j(e),i(!1)},onTouchStart:function(e){var t,n,a,r;i(!0);var c=null===e||void 0===e||null===(t=e.changedTouches)||void 0===t||null===(n=t[0])||void 0===n?void 0:n.pageX,o=null===e||void 0===e||null===(a=e.changedTouches)||void 0===a||null===(r=a[0])||void 0===r?void 0:r.pageY,s=y(d,c,o);u({b:s,c:s,d:s})},onTouchMove:g,onTouchEnd:function(e){g(e),g(e),i(!1)}})}),Object(x.jsx)("div",{className:p.a.buttonContainer,children:Object(x.jsxs)(h.a,{variant:"extended",color:"secondary",onClick:l,children:[Object(x.jsx)(b.a,{}),"New Squiggle"]})})]})}function T(){return Object(x.jsx)("svg",{width:"18",height:"20",viewBox:"0 0 18 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:Object(x.jsx)("path",{d:"M17.0934 2.94646C17.0934 2.94646 10.2988 1.42683 8.75689 4.67678C7.46154 7.40707 12.4104 10.0948 10.4488 12.2908C8.4618 14.5152 5.81458 8.5606 3.48503 10.3313C1.03328 12.1949 3.04302 18.7009 3.04302 18.7009",stroke:"#4DD0E1",strokeWidth:"2"})})}var k=n(107),M=n(47),S=n.n(M),B=n(108),X=n(101),Y=n(100),A=n(102),D=n(69),N=n(5),z=n(103),I=n.p+"static/media/instructions1.2156b3f2.svg",E=n.p+"static/media/instructions2.90be4561.svg",F=Object(N.a)({root:{padding:0}})(Y.a),q=Object(N.a)((function(){return{root:{padding:0}}}))(X.a);function W(e){var t=e.isOpen,n=e.setIsOpen,i=Object(a.useState)(1),r=Object(o.a)(i,2),c=r[0],s=r[1];Object(a.useEffect)((function(){localStorage.getItem("instructionsShown")||n(!0)}));var u=I,d="Welcome to Squiggler!",l="Kickstart your creativity with simple design exercises that will open your mind and test your imagination";return 2===c&&(u=E,d="How it Works.",l="It's simple! Generate a line and then use your creative power to finish the picture. Draw whatever comes to mind. There are no rules."),Object(x.jsxs)(B.a,{open:t,onBackdropClick:function(){return n(!1)},children:[Object(x.jsx)(F,{children:Object(x.jsx)("img",{style:{marginTop:"-20px"},src:u,width:"100%",alt:"instructions"})}),Object(x.jsxs)(A.a,{disableSpacing:!0,children:[Object(x.jsxs)("div",{children:[Object(x.jsx)(q,{children:d}),Object(x.jsx)(D.a,{gutterBottom:!0,style:{fontSize:".9rem"},children:l})]}),Object(x.jsx)("div",{children:Object(x.jsx)(z.a,{variant:"contained",color:"secondary",onClick:function(){1===c?s(2):(localStorage.setItem("instructionsShown",!0),n(!1),setTimeout((function(){s(1)}),500))},children:"Continue"})})]})]})}var P=n(48),R=n(104),Z=Object(P.a)({palette:{primary:{main:"#4DD0E1",dark:"#00ACC1"},secondary:{main:"#FFEB3B",dark:"#FDD835"}}});function G(){var e=Object(a.useState)(!1),t=Object(o.a)(e,2),n=t[0],i=t[1];return Object(x.jsxs)(R.a,{theme:Z,children:[Object(x.jsxs)("div",{className:u.a.app,children:[Object(x.jsx)("div",{className:u.a.header,children:Object(x.jsx)(d.a,{color:"transparent",position:"relative",children:Object(x.jsxs)(l.a,{children:[Object(x.jsxs)("div",{className:u.a.headerText,children:[Object(x.jsx)(T,{}),"squiggler"]}),Object(x.jsx)(k.a,{onClick:function(){return i(!0)},children:Object(x.jsx)(S.a,{})})]})})}),Object(x.jsx)("div",{className:u.a.main,children:Object(x.jsx)(_,{})})]}),Object(x.jsx)(W,{isOpen:n,setIsOpen:i})]})}var J=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,109)).then((function(t){var n=t.getCLS,a=t.getFID,i=t.getFCP,r=t.getLCP,c=t.getTTFB;n(e),a(e),i(e),r(e),c(e)}))};c.a.render(Object(x.jsx)(i.a.StrictMode,{children:Object(x.jsx)(G,{})}),document.getElementById("root")),J()}},[[67,1,2]]]);
//# sourceMappingURL=main.7341ba9a.chunk.js.map