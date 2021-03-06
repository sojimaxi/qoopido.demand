/* eslint no-unused-vars:0 */
/* global console */
(function(global, document) {
	'use strict';

	var target = document.getElementById('target');

	function log(action, module, state, details) {
		var row = document.createElement('tr');

		row.innerHTML = '<td class="' + state+ '">' + action + '</td><td>' + module + '</td><td>' + state + '</td><td>' + (details || '') + '</td>';

		target.appendChild(row);
	}

	function definition(demand, provide) {
		log('provide', '/app/js/main', 'resolved', 'module');

		// example: configuration
		demand.configure({
			pattern: {
				'/jquery':           '//cdn.jsdelivr.net/jquery/1.11.3/jquery.min',
				'/jquery/ui':        '//cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min.js',
				'/velocity':         '//cdn.jsdelivr.net/velocity/1.2.2/velocity.min.js',
				'/leaflet':          '//cdn.jsdelivr.net/leaflet/0.7.3/leaflet.js',
				'/velocity+leaflet': '//cdn.jsdelivr.net/g/velocity@1.2.2,leaflet@0.7.3'
			},
			modules: {
				'/demand/plugin/lzstring': {
					'/app/':    true,
					'/demand/': true
				},
				'/demand/plugin/cookie': {
					'/app/': true
				},
				'/demand/handler/legacy': {
					'/jquery': {
						probe: function() { return global.jQuery; }
					},
					'/jquery/ui': {
						probe:        function() { return global.jQuery.ui; },
						dependencies: [ 'legacy!/jquery' ]
					},
					'/velocity': {
						probe:        function() { return global.Velocity || (global.jQuery && global.jQuery.fn.velocity); },
						dependencies: [ 'legacy!/jquery' ]
					},
					'/leaflet': {
						probe: function() { return global.L; }
					}
				},
				'/demand/handler/bundle': {
					'/velocity+leaflet': [ 'legacy!/velocity', 'legacy!/leaflet' ]
				}
			}
		});

		// listening to demand events
		/*
		demand
			.on('cacheMiss',   function(loader) { console.log('cacheMiss', loader.path); })
			.on('cacheHit',    function(loader) { console.log('cacheHit', loader.path); })
			.on('cacheClear',  function(loader) { console.log('cacheExceed', loader.path); })
			.on('cacheExceed', function(loader) { console.log('cacheExceed', loader.path); })
			.on('preRequest',  function(loader) { console.log('preRequest', loader.path); })
			.on('postRequest', function(loader) { console.log('postRequest', loader.path); })
			.on('preProcess',  function(loader) { console.log('preProcess', loader.path); })
			.on('postProcess', function(loader) { console.log('postProcess', loader.path); })
			.on('preCache',    function(loader) { console.log('preCache', loader.path); })
			.on('postCache',   function(loader) { console.log('postCache', loader.path); })
		*/

		// load lzstring plugin to compress localStorage
		// content (see configuration above)
		demand('/demand/plugin/lzstring')
			.then(function() {
				// load cookie plugin to be able to track client
				// cache on server and eventually inline certain
				// parts (see configuration above)
				demand('/demand/plugin/cookie')
					.then(function() {
						// example: demand usage
						// providing a simple inline module without dependencies
						function definition1() {
							log('provide', '/app/js/example1', 'resolved', 'module');

							return function appJsExample1() {

							};
						}

						provide('example1', definition1);

						// providing an inline module with dependencies
						function definition2(appJsExample1) {
							log('provide', '/app/js/example2', 'resolved', 'module, with dependency');

							return function appJsExample2() {

							};
						}

						provide('example2', [ 'example1' ], definition2);

						// loading a single module without further dependencies
						// with a specific version and lifetime
						demand('@1.0.3#60!simple')
							.then(
								function(appJsSimple) { log('demand', '/app/js/simple', 'resolved', 'module, version 1.0.3, cache 60s, compress'); },
								function() { log('demand', '/app/js/simple', 'rejected'); }
							);

						// loading text (HTML in this case)
						demand('text!../html/dummy.html')
							.then(
								function(appHtmlDummy) { log('demand', '/app/html/dummy', 'resolved', 'text, cookie, compress'); },
								function() { log('demand', '/app/html/dummy', 'rejected'); }
							);

						// loading CSS with demand
						demand('css!../css/default')
							.then(
								function(appCssDefault) { log('demand', '/app/css/default', 'resolved', 'css, cookie, compress'); },
								function() { log('demand', '/app/css/default', 'rejected'); }
							);

						// load JSON data with caching disabled
						demand('!json!../json/dummy')
							.then(
								function(appJsonDummy) { log('demand', '/app/json/dummy', 'resolved', 'json, no cache'); },
								function() { log('demand', '/app/json/dummy', 'rejected'); }
							);

						// loading legacy scripts (with further dependencies, see configuration above)
						demand('legacy!/jquery/ui')
							.then(
								function(jQueryUI) { log('demand', '/jquery/ui', 'resolved', 'legacy, with dependency'); },
								function() { log('demand', '/jquery/ui', 'rejected'); }
							);

						// loading bundles with demand (see configuration above)
						demand('bundle!/velocity+leaflet')
							.then(
								function(velocity, leaflet) { log('demand', '/velocity+leaflet', 'resolved', 'bundle, with dependency'); },
								function() { log('demand', '/velocity+leaflet', 'rejected'); }
							);
					});
			});


		return true;
	}

	provide([ 'demand', 'provide' ], definition);
}(this, document));