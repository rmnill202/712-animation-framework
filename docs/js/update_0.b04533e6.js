(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["update_0"],{"0f6e":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("h1",[t._v("Assignment 0 - Animation Framework")]),n("h2",[t._v("Results")]),n("AnimationFramework"),n("h2",[t._v("Summary")]),t._m(0)],1)},r=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{"text-align":"left"}},[n("div",{staticClass:"update-text"},[t._v("The framework itself is fairly simple, and will need some additional work to be extensible to more complex scenes and controls.\n      A rudimentary system for restarting the animation has been implemented, and a basic object notation exists such that objects move at\n      a constant rate for the duration of the animation. This isn't suitable for anything like keyframing or motion tweening, but the groundwork\n      for updating each object at a given timestamp of the animation exists so it should be fairly simple to extend that functionality.\n    ")])])}],a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticStyle:{width:"500px",height:"500px",margin:"auto"},attrs:{id:"three-js-div"}}),n("div",[t._v("Some details:")]),n("div",[t._v("Current time: "+t._s((.001*t.lastFrameTime).toFixed(2)))]),n("button",{on:{click:function(e){return t.restart()}}},[t._v("Reset")])])},o=[],s=(n("ac4d"),n("8a81"),n("ac6a"),n("7fed")),c={data:function(){return{camera:null,scene:null,renderer:null,mesh:null,sceneObjects:[],originTime:0,lastFrameTime:0,endTime:2e4,isPaused:!1}},methods:{init_threejs:function(){var t=document.getElementById("three-js-div");this.scene=new s["Scene"],this.camera=new s["PerspectiveCamera"](75,t.clientWidth/t.clientHeight,5,1e3),this.camera.position.z=200,this.setupScene(),this.renderer=new s["WebGLRenderer"]({antialias:!0}),this.renderer.setSize(t.clientWidth,t.clientHeight),this.originTime=performance.now(),this.lastFrameTime=this.originTime,t.appendChild(this.renderer.domElement)},setupScene:function(){var t=new s["BoxGeometry"](30,30,30),e=new s["MeshNormalMaterial"],n=new s["Mesh"](t,e),i={mesh:n,anim:{x:5,y:5,z:0,rX:0,rY:18*Math.PI/180,rZ:0}};this.sceneObjects.push(i);var r=!0,a=!1,o=void 0;try{for(var c,u=this.sceneObjects[Symbol.iterator]();!(r=(c=u.next()).done);r=!0){var l=c.value;this.scene.add(l.mesh)}}catch(f){a=!0,o=f}finally{try{r||null==u.return||u.return()}finally{if(a)throw o}}},updateScene:function(t){var e=.001*t,n=!0,i=!1,r=void 0;try{for(var a,o=this.sceneObjects[Symbol.iterator]();!(n=(a=o.next()).done);n=!0){var s=a.value;s.mesh.position.x+=e*s.anim.x||0,s.mesh.position.y+=e*s.anim.y||0,s.mesh.position.z+=e*s.anim.z||0,s.mesh.rotation.x+=e*s.anim.rX||0,s.mesh.rotation.y+=e*s.anim.rY||0,s.mesh.rotation.z+=e*s.anim.rZ||0}}catch(c){i=!0,r=c}finally{try{n||null==o.return||o.return()}finally{if(i)throw r}}},animationLoop:function(t){if(requestAnimationFrame(this.animationLoop),!this.isPaused){var e=t-this.originTime-this.lastFrameTime;t-this.originTime>=this.endTime?(this.isPaused=!0,e=this.endTime-this.lastFrameTime,this.lastFrameTime=this.endTime):this.lastFrameTime=t-this.originTime,this.updateScene(e)}this.renderer.render(this.scene,this.camera)},restart:function(){this.originTime=performance.now(),this.lastFrameTime=0,this.isPaused=!1;var t=!0,e=!1,n=void 0;try{for(var i,r=this.sceneObjects[Symbol.iterator]();!(t=(i=r.next()).done);t=!0){var a=i.value;a.mesh.position.x=0,a.mesh.position.y=0,a.mesh.position.z=0,a.mesh.rotation.x=0,a.mesh.rotation.y=0,a.mesh.rotation.z=0}}catch(o){e=!0,n=o}finally{try{t||null==r.return||r.return()}finally{if(e)throw n}}}},mounted:function(){this.init_threejs(),this.animationLoop()}},u=c,l=n("2877"),f=Object(l["a"])(u,a,o,!1,null,null,null),m=f.exports,h={components:{AnimationFramework:m}},d=h,p=(n("6f7c"),Object(l["a"])(d,i,r,!1,null,null,null));e["default"]=p.exports},1169:function(t,e,n){var i=n("2d95");t.exports=Array.isArray||function(t){return"Array"==i(t)}},"11e9":function(t,e,n){var i=n("52a7"),r=n("4630"),a=n("6821"),o=n("6a99"),s=n("69a8"),c=n("c69a"),u=Object.getOwnPropertyDescriptor;e.f=n("9e1e")?u:function(t,e){if(t=a(t),e=o(e,!0),c)try{return u(t,e)}catch(n){}if(s(t,e))return r(!i.f.call(t,e),t[e])}},"37c8":function(t,e,n){e.f=n("2b4c")},"3a72":function(t,e,n){var i=n("7726"),r=n("8378"),a=n("2d00"),o=n("37c8"),s=n("86cc").f;t.exports=function(t){var e=r.Symbol||(r.Symbol=a?{}:i.Symbol||{});"_"==t.charAt(0)||t in e||s(e,t,{value:o.f(t)})}},"67ab":function(t,e,n){var i=n("ca5a")("meta"),r=n("d3f4"),a=n("69a8"),o=n("86cc").f,s=0,c=Object.isExtensible||function(){return!0},u=!n("79e5")(function(){return c(Object.preventExtensions({}))}),l=function(t){o(t,i,{value:{i:"O"+ ++s,w:{}}})},f=function(t,e){if(!r(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!a(t,i)){if(!c(t))return"F";if(!e)return"E";l(t)}return t[i].i},m=function(t,e){if(!a(t,i)){if(!c(t))return!0;if(!e)return!1;l(t)}return t[i].w},h=function(t){return u&&d.NEED&&c(t)&&!a(t,i)&&l(t),t},d=t.exports={KEY:i,NEED:!1,fastKey:f,getWeak:m,onFreeze:h}},"6f7c":function(t,e,n){"use strict";var i=n("b071"),r=n.n(i);r.a},"7bbc":function(t,e,n){var i=n("6821"),r=n("9093").f,a={}.toString,o="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(t){try{return r(t)}catch(e){return o.slice()}};t.exports.f=function(t){return o&&"[object Window]"==a.call(t)?s(t):r(i(t))}},"8a81":function(t,e,n){"use strict";var i=n("7726"),r=n("69a8"),a=n("9e1e"),o=n("5ca1"),s=n("2aba"),c=n("67ab").KEY,u=n("79e5"),l=n("5537"),f=n("7f20"),m=n("ca5a"),h=n("2b4c"),d=n("37c8"),p=n("3a72"),y=n("d4c0"),b=n("1169"),v=n("cb7c"),S=n("d3f4"),g=n("4bf8"),w=n("6821"),T=n("6a99"),O=n("4630"),x=n("2aeb"),L=n("7bbc"),j=n("11e9"),P=n("2621"),F=n("86cc"),_=n("0d58"),E=j.f,k=F.f,M=L.f,N=i.Symbol,A=i.JSON,C=A&&A.stringify,z="prototype",D=h("_hidden"),G=h("toPrimitive"),I={}.propertyIsEnumerable,R=l("symbol-registry"),V=l("symbols"),H=l("op-symbols"),J=Object[z],W="function"==typeof N&&!!P.f,Y=i.QObject,B=!Y||!Y[z]||!Y[z].findChild,K=a&&u(function(){return 7!=x(k({},"a",{get:function(){return k(this,"a",{value:7}).a}})).a})?function(t,e,n){var i=E(J,e);i&&delete J[e],k(t,e,n),i&&t!==J&&k(J,e,i)}:k,$=function(t){var e=V[t]=x(N[z]);return e._k=t,e},q=W&&"symbol"==typeof N.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof N},X=function(t,e,n){return t===J&&X(H,e,n),v(t),e=T(e,!0),v(n),r(V,e)?(n.enumerable?(r(t,D)&&t[D][e]&&(t[D][e]=!1),n=x(n,{enumerable:O(0,!1)})):(r(t,D)||k(t,D,O(1,{})),t[D][e]=!0),K(t,e,n)):k(t,e,n)},Z=function(t,e){v(t);var n,i=y(e=w(e)),r=0,a=i.length;while(a>r)X(t,n=i[r++],e[n]);return t},Q=function(t,e){return void 0===e?x(t):Z(x(t),e)},U=function(t){var e=I.call(this,t=T(t,!0));return!(this===J&&r(V,t)&&!r(H,t))&&(!(e||!r(this,t)||!r(V,t)||r(this,D)&&this[D][t])||e)},tt=function(t,e){if(t=w(t),e=T(e,!0),t!==J||!r(V,e)||r(H,e)){var n=E(t,e);return!n||!r(V,e)||r(t,D)&&t[D][e]||(n.enumerable=!0),n}},et=function(t){var e,n=M(w(t)),i=[],a=0;while(n.length>a)r(V,e=n[a++])||e==D||e==c||i.push(e);return i},nt=function(t){var e,n=t===J,i=M(n?H:w(t)),a=[],o=0;while(i.length>o)!r(V,e=i[o++])||n&&!r(J,e)||a.push(V[e]);return a};W||(N=function(){if(this instanceof N)throw TypeError("Symbol is not a constructor!");var t=m(arguments.length>0?arguments[0]:void 0),e=function(n){this===J&&e.call(H,n),r(this,D)&&r(this[D],t)&&(this[D][t]=!1),K(this,t,O(1,n))};return a&&B&&K(J,t,{configurable:!0,set:e}),$(t)},s(N[z],"toString",function(){return this._k}),j.f=tt,F.f=X,n("9093").f=L.f=et,n("52a7").f=U,P.f=nt,a&&!n("2d00")&&s(J,"propertyIsEnumerable",U,!0),d.f=function(t){return $(h(t))}),o(o.G+o.W+o.F*!W,{Symbol:N});for(var it="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),rt=0;it.length>rt;)h(it[rt++]);for(var at=_(h.store),ot=0;at.length>ot;)p(at[ot++]);o(o.S+o.F*!W,"Symbol",{for:function(t){return r(R,t+="")?R[t]:R[t]=N(t)},keyFor:function(t){if(!q(t))throw TypeError(t+" is not a symbol!");for(var e in R)if(R[e]===t)return e},useSetter:function(){B=!0},useSimple:function(){B=!1}}),o(o.S+o.F*!W,"Object",{create:Q,defineProperty:X,defineProperties:Z,getOwnPropertyDescriptor:tt,getOwnPropertyNames:et,getOwnPropertySymbols:nt});var st=u(function(){P.f(1)});o(o.S+o.F*st,"Object",{getOwnPropertySymbols:function(t){return P.f(g(t))}}),A&&o(o.S+o.F*(!W||u(function(){var t=N();return"[null]"!=C([t])||"{}"!=C({a:t})||"{}"!=C(Object(t))})),"JSON",{stringify:function(t){var e,n,i=[t],r=1;while(arguments.length>r)i.push(arguments[r++]);if(n=e=i[1],(S(e)||void 0!==t)&&!q(t))return b(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!q(e))return e}),i[1]=e,C.apply(A,i)}}),N[z][G]||n("32e9")(N[z],G,N[z].valueOf),f(N,"Symbol"),f(Math,"Math",!0),f(i.JSON,"JSON",!0)},9093:function(t,e,n){var i=n("ce10"),r=n("e11e").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,r)}},ac4d:function(t,e,n){n("3a72")("asyncIterator")},ac6a:function(t,e,n){for(var i=n("cadf"),r=n("0d58"),a=n("2aba"),o=n("7726"),s=n("32e9"),c=n("84f2"),u=n("2b4c"),l=u("iterator"),f=u("toStringTag"),m=c.Array,h={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},d=r(h),p=0;p<d.length;p++){var y,b=d[p],v=h[b],S=o[b],g=S&&S.prototype;if(g&&(g[l]||s(g,l,m),g[f]||s(g,f,b),c[b]=m,v))for(y in i)g[y]||a(g,y,i[y],!0)}},b071:function(t,e,n){},d4c0:function(t,e,n){var i=n("0d58"),r=n("2621"),a=n("52a7");t.exports=function(t){var e=i(t),n=r.f;if(n){var o,s=n(t),c=a.f,u=0;while(s.length>u)c.call(t,o=s[u++])&&e.push(o)}return e}}}]);
//# sourceMappingURL=update_0.b04533e6.js.map