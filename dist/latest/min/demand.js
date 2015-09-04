/*! Qoopido.demand 0.0.1, 2015-09-04 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(e){"use strict";function t(){var e=this||{},t=s(e,m)?e:null,n=A.call(arguments);return n.forEach(function(e,n){var r=I.path(e,t),a=r.handler,u=r.path,l=ne[a]||(ne[a]={});this[n]=l[u]||(l[u]=new h(e,t).pledge)},n),i.all(n)}function n(){var e,t,n=arguments[0]&&"string"==typeof arguments[0]&&arguments[0]||null,r=!n&&arguments[0]||arguments[1];if(!n&&S.current&&(t=S.current,n=t.handler+"!"+t.path),!n)throw new p("unspecified anonymous provide");return M(function(){var a,l,o,c=I.path(n),s=ne[c.handler];!t&&s[c.path]?u("duplicate found for module "+c.path):(a=new m(n,r,e||[]),l=ne[a.handler][a.path]=a.pledge,t&&(!t.cached&&t.store(),o=t.defered,l.then(function(){o.resolve.apply(null,arguments)},function(){o.reject(new p("unable to resolve module",n,arguments))}),S.length>0&&S.next()))}),{when:function(){e=A.call(arguments)}}}function r(e){var t,n=e.timeout,r=e.version,a=e.lifetime,u=e.base,l=e.pattern,o=e.probes;if(typeof e.cache!==H&&(y=!!e.cache),typeof e.debug!==H&&(x=!!e.debug),n&&(w=1e3*Math.min(Math.max(parseInt(n,10),2),10),b=Math.min(Math.max(w/5,1e3),5e3)),r&&(E=r),a&&(j=1e3*Math.max(parseInt(a,10),0)),u&&(v=re.base=new f(G,I.url(u))),l)for(t in l)"base"!==t&&(re[t]=new f(t,l[t]));if(o)for(t in o)ae[t]=o[t];return!0}function a(e,t,n){ue[e]||(ue[e]={suffix:t,resolve:n.resolve,modify:n.modify},ne[e]={})}function u(e){var t=s(e,p)?"error":"warn";typeof console===H||!x&&"warn"===t||console[t](e.toString())}function l(e){return e.replace(F,"\\$&")}function o(e){return Q.test(e)}function c(e){return e.replace(V,"")}function s(e,t){return e instanceof t}function i(e){function t(){r($,arguments)}function n(){r(C,arguments)}function r(e,t){a.state===X&&(a.state=e,a.value=t,u[e].forEach(function(e){e.apply(null,a.value)}))}var a=this,u={resolved:[],rejected:[]};a.then=function(e,t){var n=this;if(n.state===X)e&&u[$].push(e),t&&u[C].push(t);else switch(n.state){case $:e.apply(null,n.value);break;case C:t.apply(null,n.value)}},e(t,n)}function p(e,t,n){var r=this;return r.message=e,r.module=t,n&&(r.stack=A.call(n)),r}function f(e,t){var n=this;n.url=I.url(t),n.regexPattern=s(e,RegExp)?e:new RegExp("^"+l(e)),n.regexUrl=new RegExp("^"+l(t))}function d(){var e=this;e.current=null,e.queue=[]}function h(e,t){var n,r,a=this,l=i.defer();return I.path.call(a,e,t),a.defered=l,a.pledge=l.pledge,r=ue[a.handler],parent||a.pledge.then(null,u),r?(a.retrieve(),a.cached?S.add(a):(n=g.test(a.url)?new L:new B,n.onprogress=function(){},n.onreadystatechange=function(){4===n.readyState&&(200===n.status||0===n.status&&n.responseText?(a.source=n.responseText,S.add(a)):l.reject(new p("unable to load module",a.path)))},n.open("GET",a.url+r.suffix,!0),n.send(),M(function(){n.readyState<4&&n.abort()},w))):l.reject(new p('no handler "'+a.handler+'" for',a.path)),a}function m(e,n,r){var a=this,l=i.defer();return I.path.call(a,e),(a.pledge=l.pledge).then(null,function(){u(new p("unable to resolve module",a.path,arguments))}),r.length>0?t.apply(a,r).then(function(){l.resolve(n.apply(null,arguments))},function(){l.reject(new p("unable to resolve dependencies for",a.path,arguments))}):l.resolve(n()),a}var g,v,y,x,w,b,E,j,S,I,T,k,q,R=e.document,M=e.setTimeout,A=Array.prototype.slice,D=Array.prototype.concat,N=R.getElementsByTagName("head")[0],O=R.createElement("a"),P="[demand]",H="undefined",J="[state]",U="[value]",X="pending",$="resolved",C="rejected",L=e.XMLHttpRequest,B="XDomainRequest"in e&&e.XDomainRequest||L,G=/^/,Q=/^\//i,z=/^([-\w]+\/[-\w]+)!/,F=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,K=/url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g,V=/^http(s?):/,W=/^\[demand\]\[(.+?)\]\[state\]$/,Y=e.localStorage,Z=Y&&typeof Y.remainingSpace!==H,_={cache:!0,debug:!1,version:"1.0.0",lifetime:0,timeout:5,base:"/"},ee=e.demand.main,te=e.demand.settings,ne={},re={},ae={},ue={};I={url:function(e){return O.href=e,O.href},path:function(e,t){var n,r,a=this,u=e.match(z)||"application/javascript",i=s(a,h);"string"!=typeof u&&(e=e.replace(new RegExp("^"+l(u[0])),""),u=u[1]),e=o(e)?v.remove(I.url(v.url+e)):"/"+I.url((t&&t.path&&I.url(t.path+"/../")||"/")+e).replace(g,"");for(n in re)re[n].matches(e)&&(r=re[n]);return i||s(a,m)?(a.handler=u,a.path=e,i&&(a.url=c(I.url(r.process(e)))),void 0):{handler:u,path:e}}},T={get:function(e,t){var n,r;if(Y&&y){if(n=P+"["+e+"]",r=JSON.parse(Y.getItem(n+J)),r&&r.version===E&&r.url===t&&(0===r.expires||r.expires>(new Date).getTime()))return Y.getItem(n+U);T.clear(e)}},set:function(e,t,n){var r,a;if(Y&&y){r=P+"["+e+"]";try{if(a=Z?Y.remainingSpace:null,Y.setItem(r+U,t),Y.setItem(r+J,JSON.stringify({version:E,expires:j>0?(new Date).getTime()+j:0,url:n})),null!==a&&Y.remainingSpace===a)throw"QuotaExceedError"}catch(l){u("unable to cache module "+e)}}},clear:function(e){var t,n,r,a;if(Y&&y)switch(typeof e){case"string":t=P+"["+e+"]",Y.removeItem(t+J),Y.removeItem(t+U);break;case"boolean":for(n in Y)r=n.match(W),r&&(a=JSON.parse(Y.getItem(P+"["+r[1]+"]"+J)),a&&a.expires>0&&a.expires<=(new Date).getTime()&&T.clear(r[1]));break;case H:for(n in Y)0===n.indexOf(P)&&Y.removeItem(n)}}},i.prototype={constructor:i,state:X,value:null,listener:null,then:null},i.defer=function(){var e={};return e.pledge=new i(function(t,n){e.resolve=t,e.reject=n}),e},i.all=function(e){var t=i.defer(),n=t.pledge,r=[],a=[],u=e.length,l=0;return e.forEach(function(e,n){e.then(function(){r[n]=A.call(arguments),l++,l===u&&t.resolve.apply(null,D.apply([],r))},function(){a.push(A.call(arguments)),a.length+l===u&&t.reject.apply(null,D.apply([],a))})}),n},i.race=function(e){var t=i.defer();return e.forEach(function(e){e.then(t.resolve,t.reject)}),t.pledge},p.prototype={message:null,module:null,stack:null,toString:function(){var e=this,t=P+" "+e.message+" "+e.module;return e.stack&&(t=p.traverse(e.stack,t,1)),t}},p.traverse=function(e,t,n){var r=new Array(n+1).join(" ");return e.forEach(function(e){t+="\n"+r+"> "+e.message+" "+e.module,e.stack&&(t=p.traverse(e.stack,t,n+1))}),t},f.prototype={url:null,regexPattern:null,regexUrl:null,matches:function(e){return this.regexPattern.test(e)},remove:function(e){return e.replace(this.regexUrl,"")},process:function(e){var t=this;return e.replace(t.regexPattern,t.url)}},d.prototype={current:null,queue:null,length:0,add:function(e){var t=this,n=t.queue;n.push(e),t.length++,1===n.length&&t.next()},next:function(){var e,t,n,r=this,a=r.current,u=r.queue;a&&(r.current=null,u.shift(),r.length--),u.length&&(a=r.current=r.queue[0],e=a.defered,t=a.path,n=ue[a.handler],!a.cached&&n.modify&&(a.source=n.modify(a.url,a.source)),n.resolve(t,a.source),ae[t]&&a.probe(),M(function(){e.reject(new p("timeout resolving module",t))},b))}},h.prototype={handler:null,path:null,url:null,defered:null,pledge:null,cached:!1,source:null,probe:function(){var e,t=this,r=t.path,a=t.pledge.state===X;a&&((e=ae[r]())?n(function(){return e}):M(t.probe,100))},store:function(){var e=this;T.set(e.path,e.source,e.url)},retrieve:function(){var e=this,t=T.get(e.path,e.url),n=e.cached=!!t;n&&(e.source=t)}},m.prototype={handler:null,path:null,pledge:null},k={resolve:function(e,t){var n=R.createElement("script");n.type="text/javascript",n.defer=n.async=!0,n.text=t,n.setAttribute("demand-path",e),N.appendChild(n)}},q={resolve:function(e,t){var r=R.createElement("style"),a=r.styleSheet;r.type="text/css",r.media="only x",a&&(a.cssText=t)||(r.innerHTML=t),r.setAttribute("demand-path",e),N.appendChild(r),M(function(){n(function(){return r})})},modify:function(e,t){for(var n,r=I.url(e+"/..");n=K.exec(t);)t=t.replace(n[0],"url("+I.url(r+n[1])+")");return t}},g=new RegExp("^"+l(I.url("/"))),S=new d,T.clear(!0),a("application/javascript",".js",k),a("text/css",".css",q),r(_)&&te&&r(te),t.configure=r,t.addHandler=a,t.clear=T.clear,e.demand=t,e.provide=n,n("/demand",function(){return t}),n("/provide",function(){return n}),n("/pledge",function(){return i}),ee&&t(ee)}(this);