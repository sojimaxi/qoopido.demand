/*! Qoopido.demand 2.0.1 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(e){"use strict";function n(n,t,r){return{matchType:t.matchType,onPreRequest:function(){var e=this,o=e.deferred,s=r[e.path]&&r[e.path].dependencies;s&&demand.apply(null,s).then(null,function(){o.reject(new n("error resolving",e.path,arguments))}),t.onPreRequest.call(this)},onPostRequest:t.onPostRequest,process:function(){var o,s,a=this,i=r[a.path]&&r[a.path].probe;t.process.call(a),i&&e(function(){o=a.deferred,"pending"===o.pledge.state&&((s=i())?provide(function(){return s}):o.reject(new n("error probing",a.path)))})}}}provide(["/demand/reason","/demand/handler/module","settings"],n)}(setTimeout);
//# sourceMappingURL=../handler/legacy.js.map