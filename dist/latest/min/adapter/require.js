/*! Qoopido.demand 0.0.2, 2015-09-05 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(n){"use strict";function r(r,e){function u(){var n=arguments,e=Array.isArray(n[0])?n[0]:null,u=arguments[e?1:0];r.apply(null,e||[]).then(u)}function i(){var n=arguments,r="string"==typeof n[0]?n[0]:null,u=Array.isArray(n[r?1:0])?n[r?1:0]:null,i=n[r?u?2:1:u?1:0],l=e.apply(null,r?[r,i]:[i]);u&&l.when.apply(null,u)}return i.amd=!0,n.require=u,n.define=i,{require:u,define:i}}provide(r).when("/demand","/provide")}(this);