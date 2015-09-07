/*! Qoopido.demand 1.0.0, 2015-09-07 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(e){"use strict";function t(e){var t=this||{},n=p(t,w)?t:null,r=H.call(arguments);return r.forEach(function(e,t){var r=S.path(e,n),a=r.handler,u=r.path,l=ce[a]||(ce[a]={});this[t]=l[u]||(l[u]=new x(e,n).pledge)},r),m.all(r)}function n(e,t){var n,r;if(e=f(arguments[0],Q)&&arguments[0]||null,t=e?arguments[1]:arguments[0],!e&&E.current&&(n=E.current,e=n.handler+"!"+n.path),!e)throw new g("unspecified anonymous provide");return U(function(){var a,u,o,i=S.path(e),c=ce[i.handler];!n&&c[i.path]?l("duplicate found for module "+i.path):(a=new w(e,t,r||[]),u=ce[a.handler][a.path]=a.pledge,n&&(!n.cached&&n.store(),o=n.defered,u.then(function(){o.resolve.apply(null,arguments)},function(){o.reject(new g("unable to resolve module",e,arguments))}),E.length>0&&E.next()))}),{when:function(){r=H.call(arguments)}}}function r(e){var t,n=e.cache,r=e.debug,a=e.version,u=e.timeout,l=e.lifetime,o=e.base,i=e.pattern,c=e.probes;if(M=f(n,z)?n:M,O=f(r,z)?r:O,P=f(a,Q)?a:P,h(u)&&(A=1e3*Math.min(Math.max(u,2),10),D=Math.min(Math.max(A/5,1e3),5e3)),h(l)&&(R=1e3*l),f(o,Q)&&(q=se.base=new v("",S.url(o))),d(i))for(t in i)"base"!==t&&(se[t]=new v(t,i[t]));if(d(c))for(t in c)pe[t]=c[t];return!0}function a(e,t,n){fe[e]||(fe[e]={suffix:t,resolve:n.resolve,modify:n.modify},ce[e]={})}function u(e,t){n(e,function(){return t})}function l(e){var t=p(e,g)?"error":"warn";f(console,G)||!O&&"warn"===t||console[t](e.toString())}function o(e,t){return new RegExp(e,t)}function i(e){return e.replace(te,"\\$&")}function c(e){return e.replace(ae,"")}function s(e){return _.test(e)}function p(e,t){return e instanceof t}function f(e,t){return typeof e===t}function d(e){return e&&f(e,"object")}function h(e){return f(e,"number")&&isFinite(e)&&Math.floor(e)===e&&e>=0}function m(e){function t(){r(V,arguments)}function n(){r(W,arguments)}function r(e,t){a.state===K&&(a.state=e,a.value=t,u[e].forEach(function(e){e.apply(null,a.value)}))}var a=this,u={resolved:[],rejected:[]};a.then=function(e,t){if(a.state===K)e&&u[V].push(e),t&&u[W].push(t);else switch(a.state){case V:e.apply(null,a.value);break;case W:t.apply(null,a.value)}},e(t,n)}function g(e,t,n){var r=this;r.message=e,r.module=t,n&&(r.stack=H.call(n))}function v(e,t){var n=this;n.specificity=e.length,n.url=S.url(t),n.regexPattern=o("^"+i(e)),n.regexUrl=o("^"+i(t))}function y(){var e=this;e.current=null,e.queue=[]}function x(e,t){var n,r,a=this,u=m.defer();S.path.call(a,e,t),a.defered=u,a.pledge=u.pledge,r=fe[a.handler],t||a.pledge.then(null,l),r?(a.retrieve(),a.cached?E.add(a):(n=b.test(a.url)?new Y:new Z,n.onprogress=function(){},n.ontimeout=n.onerror=n.onabort=function(){u.reject(new g("unable to load module",a.path))},n.onload=function(){a.source=n.responseText,E.add(a)},n.open("GET",a.url+r.suffix,!0),n.send(),U(function(){n.readyState<4&&n.abort()},A))):u.reject(new g('no handler "'+a.handler+'" for',a.path))}function w(e,n,r){var a=this,u=m.defer();S.path.call(a,e),(a.pledge=u.pledge).then(null,function(){l(new g("unable to resolve module",a.path,arguments))}),r.length>0?t.apply(a,r).then(function(){u.resolve(n.apply(null,arguments))},function(){u.reject(new g("unable to resolve dependencies for",a.path,arguments))}):u.resolve(n())}var b,j,E,S,I,T,k,q,M,O,A,D,P,R,N=e.document,U=e.setTimeout,H=Array.prototype.slice,J=Array.prototype.concat,L=N.getElementsByTagName("head")[0],X=N.createElement("a"),$=e.localStorage,C="[demand]",B="[state]",F="[value]",G="undefined",Q="string",z="boolean",K="pending",V="resolved",W="rejected",Y=e.XMLHttpRequest,Z="XDomainRequest"in e&&e.XDomainRequest||Y,_=/^\//i,ee=/^([-\w]+\/[-\w]+)!/,te=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,ne=/\/\/#\s+sourceMappingURL\s*=\s*(.+?)\.map/g,re=/url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g,ae=/^http(s?):/,ue=$&&"remainingSpace"in $,le={cache:!0,debug:!1,version:"1.0.0",lifetime:0,timeout:5,base:"/"},oe=e.demand.main,ie=e.demand.settings,ce={},se={},pe={},fe={};S={url:function(e){return X.href=e,X.href},path:function(e,t){var n,r,a=this,u=e.match(ee)||"application/javascript",l=p(a,x);f(u,Q)||(e=e.replace(o("^"+i(u[0])),""),u=u[1]),s(e)||(e="/"+S.url((t&&t.path&&S.url(t.path+"/../")||"/")+e).replace(b,""));for(n in se)se[n].matches(e)&&(!r||r.specificity<se[n].specificity)&&(r=se[n]);return l||p(a,w)?(a.handler=u,a.path=e,l&&(a.url=c(S.url(r.process(e)))),void 0):{handler:u,path:e}}},I={get:function(e,t){var n,r;if($&&M){if(n=C+"["+e+"]",r=JSON.parse($.getItem(n+B)),r&&r.version===P&&r.url===t&&(0===r.expires||r.expires>(new Date).getTime()))return $.getItem(n+F);I.clear(e)}},set:function(e,t,n){var r,a;if($&&M){r=C+"["+e+"]";try{if(a=ue?$.remainingSpace:null,$.setItem(r+F,t),$.setItem(r+B,JSON.stringify({version:P,expires:R>0?(new Date).getTime()+R:0,url:n})),null!==a&&$.remainingSpace===a)throw"QuotaExceedError"}catch(u){l("unable to cache module "+e)}}},clear:function(e){var t,n,r,a;if($)switch(typeof e){case Q:t=C+"["+e+"]",$.removeItem(t+B),$.removeItem(t+F);break;case z:if(e)for(n in $)r=n.match(j),r&&(a=JSON.parse($.getItem(C+"["+r[1]+"]"+B)),a&&a.expires>0&&a.expires<=(new Date).getTime()&&I.clear(r[1]));break;case G:for(n in $)0===n.indexOf(C)&&$.removeItem(n)}}},T={resolve:function(e,t){var n=N.createElement("script");n.type="application/javascript",n.defer=n.async=!0,n.text=t,n.setAttribute("demand-path",e),L.appendChild(n)},modify:function(e,t){for(var n,r;n=ne.exec(t);)r=c(S.url(e+"/../"+n[1])),t=t.replace(n[0],"//# sourcemap="+r+".map");return t}},k={resolve:function(e,t){var r=N.createElement("style"),a=r.styleSheet;r.type="text/css",r.media="only x",a&&(a.cssText=t)||(r.innerHTML=t),r.setAttribute("demand-path",e),L.appendChild(r),U(function(){n(function(){return r})})},modify:function(e,t){for(var n,r=S.url(e+"/..");n=re.exec(t);)t=t.replace(n[0],"url("+S.url(r+n[1])+")");return t}},m.prototype={constructor:m,state:K,value:null,listener:null,then:null},m.defer=function(){var e={};return e.pledge=new m(function(t,n){e.resolve=t,e.reject=n}),e},m.all=function(e){var t=m.defer(),n=t.pledge,r=[],a=[],u=e.length,l=0;return e.forEach(function(e,n){e.then(function(){r[n]=H.call(arguments),l++,l===u&&t.resolve.apply(null,J.apply([],r))},function(){a.push(H.call(arguments)),a.length+l===u&&t.reject.apply(null,J.apply([],a))})}),n},m.race=function(e){var t=m.defer();return e.forEach(function(e){e.then(t.resolve,t.reject)}),t.pledge},g.prototype={message:null,module:null,stack:null,toString:function(){var e=this,t=C+" "+e.message+" "+e.module;return e.stack&&(t=g.traverse(e.stack,t,1)),t}},g.traverse=function(e,t,n){var r=new Array(n+1).join(" ");return e.forEach(function(e){t+="\n"+r+"> "+e.message+" "+e.module,e.stack&&(t=g.traverse(e.stack,t,n+1))}),t},v.prototype={specificity:0,url:null,regexPattern:null,regexUrl:null,matches:function(e){return this.regexPattern.test(e)},remove:function(e){return e.replace(this.regexUrl,"")},process:function(e){var t=this;return e.replace(t.regexPattern,t.url)}},y.prototype={current:null,queue:null,length:0,add:function(e){var t=this,n=t.queue;n.push(e),t.length++,1===n.length&&t.next()},next:function(){var e,t,n,r=this,a=r.current,u=r.queue;a&&(r.current=null,u.shift(),r.length--),u.length&&(a=r.current=r.queue[0],e=a.defered,t=a.path,n=fe[a.handler],!a.cached&&n.modify&&(a.source=n.modify(a.url,a.source)),n.resolve(t,a.source),pe[t]&&a.probe(),U(function(){e.reject(new g("timeout resolving module",t))},D))}},x.prototype={handler:null,path:null,url:null,defered:null,pledge:null,cached:!1,source:null,probe:function(){var e,t=this,r=t.path,a=t.pledge.state===K;a&&((e=pe[r]())?n(function(){return e}):U(t.probe,100))},store:function(){var e=this;I.set(e.path,e.source,e.url)},retrieve:function(){var e=this,t=I.get(e.path,e.url),n=e.cached=!!t;n&&(e.source=t)}},w.prototype={handler:null,path:null,pledge:null},b=o("^"+i(S.url("/"))),j=o("^"+i(C+"[(.+?)]"+B+"$")),E=new y,I.clear(!0),a("application/javascript",".js",T),a("text/css",".css",k),r(le)&&ie&&r(ie),t.configure=r,t.addHandler=a,t.clear=I.clear,e.demand=t,e.provide=n,u("/demand",t),u("/provide",n),u("/pledge",m),u("/validator/isTypeOf",f),u("/validator/isInstanceOf",p),u("/validator/isObject",d),u("/validator/isPositiveInteger",h),oe&&t(oe)}(this);
//# sourceMappingURL=demand.js.map