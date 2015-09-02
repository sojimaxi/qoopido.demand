/*!
* Qoopido.demand
*
* version: 0.0.1
* date:    2015-09-02
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.demand
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(global) {
    "use strict";
    var document = global.document, setTimeout = global.setTimeout, arrayPrototypeSlice = Array.prototype.slice, arrayPrototypeConcat = Array.prototype.concat, target = document.getElementsByTagName("head")[0], resolver = document.createElement("a"), DEMAND_PREFIX = "[demand]", STRING_UNDEFINED = "undefined", LOCALSTORAGE_STATE = "[state]", LOCALSTORAGE_VALUE = "[value]", BOND_PENDING = "pending", BOND_RESOLVED = "resolved", BOND_REJECTED = "rejected", regexBase = /^/, regexIsAbsolute = /^\//i, regexMatchHandler = /^([-\w]+\/[-\w]+)!/, regexMatchSpecial = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, regexMatchCssUrl = /url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g, regexMatchProtocol = /^http(s?):/, regexMatchLsState = /^\[demand\]\[(.+?)\]\[state\]$/, localStorage = global.localStorage, remainingSpace = localStorage && typeof localStorage.remainingSpace !== STRING_UNDEFINED, defaults = {
        cache: true,
        version: "1.0.0",
        lifetime: 0,
        timeout: 5e3,
        base: "/"
    }, main = global.demand.main, settings = global.demand.settings, pattern = {}, handler = {}, modules = {}, base, cache, timeout, version, lifetime, queue, resolve, storage, JavascriptHandler, CssHandler;
    function demand() {
        var self = this || {}, module = isInstanceOf(self, Module) ? self : null, dependencies = arrayPrototypeSlice.call(arguments);
        dependencies.forEach(function(dependency, index) {
            var resolved = resolve.path(dependency, module), handler = resolved.handler, path = resolved.path, pointer = modules[handler] || (modules[handler] = {});
            this[index] = pointer[path] || (pointer[path] = new Loader(dependency, module).pledge);
        }, dependencies);
        return Pledge.all(dependencies);
    }
    function provide() {
        var path = arguments[0] && typeof arguments[0] === "string" && arguments[0] || null, factory = !path && arguments[0] || arguments[1], dependencies, loader;
        if (!path && queue.current) {
            loader = queue.current;
            path = loader.handler + "!" + loader.path;
        }
        if (path) {
            setTimeout(function() {
                var resolved = resolve.path(path), pointer = modules[resolved.handler], module, pledge, defered;
                if (!loader && pointer[resolved.path]) {
                    throw new Error("duplicate found for module", path);
                } else {
                    module = new Module(path, factory, dependencies || []);
                    pledge = modules[module.handler][module.path] = module.pledge;
                    if (loader) {
                        !loader.cached && loader.store();
                        defered = loader.defered;
                        pledge.then(function() {
                            defered.resolve.apply(null, arguments);
                        }, function() {
                            defered.reject(new Error("unable to resolve module", path, arguments));
                        });
                        queue.length > 0 && queue.next();
                    }
                }
            });
        } else {
            throw new Error("unspecified anonymous provide");
        }
        return {
            when: function() {
                dependencies = arrayPrototypeSlice.call(arguments);
            }
        };
    }
    function configure(aConfig) {
        var pointerTimeout = aConfig.timeout, pointerVersion = aConfig.version, pointerLifetime = aConfig.lifetime, pointerBase = aConfig.base, pointerPattern = aConfig.pattern, key;
        if (typeof aConfig.cache !== STRING_UNDEFINED) {
            cache = !!aConfig.cache;
        }
        if (pointerTimeout) {
            timeout = Math.min(Math.max(parseInt(pointerTimeout, 10), 2e3), 1e4);
        }
        if (pointerVersion) {
            version = pointerVersion;
        }
        if (pointerLifetime) {
            lifetime = Math.max(parseInt(pointerLifetime, 10), 0) * 1e3;
        }
        if (pointerBase) {
            base = pattern.base = new Pattern(regexBase, resolve.url(pointerBase).href);
        }
        if (pointerPattern) {
            for (key in pointerPattern) {
                key !== "base" && (pattern[key] = new Pattern(key, pointerPattern[key]));
            }
        }
        return true;
    }
    function addHandler(aType, aSuffix, aHandler) {
        if (!handler[aType]) {
            handler[aType] = {
                suffix: aSuffix,
                resolve: aHandler.resolve,
                modify: aHandler.modify
            };
            modules[aType] = {};
        }
    }
    function log(aMessage) {
        var type = isInstanceOf(aMessage, Error) ? "error" : "warn";
        if (typeof console !== STRING_UNDEFINED) {
            console[type](aMessage.toString());
        }
    }
    function escape(aValue) {
        return aValue.replace(regexMatchSpecial, "\\$&");
    }
    function isAbsolute(aPath) {
        return regexIsAbsolute.test(aPath);
    }
    function removeProtocol(url) {
        return url.replace(regexMatchProtocol, "");
    }
    function isInstanceOf(instance, module) {
        return instance instanceof module;
    }
    resolve = {
        url: function(aUrl) {
            resolver.href = aUrl;
            return resolver;
        },
        path: function(aPath, aParent) {
            var self = this, pointer = aPath.match(regexMatchHandler) || "application/javascript", isLoader = isInstanceOf(self, Loader), key, match;
            if (typeof pointer !== "string") {
                aPath = aPath.replace(new RegExp("^" + escape(pointer[0])), "");
                pointer = pointer[1];
            }
            if (isAbsolute(aPath)) {
                aPath = base.remove(resolve.url(base.url + aPath).href);
            } else {
                aPath = resolve.url((aParent && aParent.path + "/../" || "/") + aPath).pathname;
            }
            for (key in pattern) {
                pattern[key].matches(aPath) && (match = pattern[key]);
            }
            if (isLoader || isInstanceOf(self, Module)) {
                self.handler = pointer;
                self.path = aPath;
                isLoader && (self.url = removeProtocol(resolve.url(match.process(aPath)).href));
            } else {
                return {
                    handler: pointer,
                    path: aPath
                };
            }
        }
    };
    storage = {
        get: function(aPath, aUrl) {
            var id, state;
            if (localStorage && cache) {
                id = DEMAND_PREFIX + "[" + aPath + "]";
                state = JSON.parse(localStorage.getItem(id + LOCALSTORAGE_STATE));
                if (state && state.version === version && state.url === aUrl && (state.expires === 0 || state.expires > new Date().getTime())) {
                    return localStorage.getItem(id + LOCALSTORAGE_VALUE);
                } else {
                    storage.clear(aPath);
                }
            }
        },
        set: function(aPath, aValue, aUrl) {
            var id, spaceBefore;
            if (localStorage && cache) {
                id = DEMAND_PREFIX + "[" + aPath + "]";
                try {
                    spaceBefore = remainingSpace ? localStorage.remainingSpace : null;
                    localStorage.setItem(id + LOCALSTORAGE_VALUE, aValue);
                    localStorage.setItem(id + LOCALSTORAGE_STATE, JSON.stringify({
                        version: version,
                        expires: lifetime > 0 ? new Date().getTime() + lifetime : 0,
                        url: aUrl
                    }));
                    if (spaceBefore !== null && localStorage.remainingSpace === spaceBefore) {
                        throw "QuotaExceedError";
                    }
                } catch (error) {
                    log("unable to cache module " + aPath);
                }
            }
        },
        clear: function(aPath) {
            var id, key, match, state;
            if (localStorage && cache) {
                switch (typeof aPath) {
                  case "string":
                    id = DEMAND_PREFIX + "[" + aPath + "]";
                    localStorage.removeItem(id + LOCALSTORAGE_STATE);
                    localStorage.removeItem(id + LOCALSTORAGE_VALUE);
                    break;

                  case "boolean":
                    for (key in localStorage) {
                        match = key.match(regexMatchLsState);
                        if (match) {
                            state = JSON.parse(localStorage.getItem(DEMAND_PREFIX + "[" + match[1] + "]" + LOCALSTORAGE_STATE));
                            if (state && state.expires > 0 && state.expires <= new Date().getTime()) {
                                storage.clear(match[1]);
                            }
                        }
                    }
                    break;

                  case STRING_UNDEFINED:
                    for (key in localStorage) {
                        key.indexOf(DEMAND_PREFIX) === 0 && localStorage.removeItem(key);
                    }
                    break;
                }
            }
        }
    };
    function Pledge(executor) {
        var self = this, listener = {
            resolved: [],
            rejected: []
        };
        function resolve() {
            handle(BOND_RESOLVED, arguments);
        }
        function reject() {
            handle(BOND_REJECTED, arguments);
        }
        function handle(aState, aParameter) {
            if (self.state === BOND_PENDING) {
                self.state = aState;
                self.value = aParameter;
                listener[aState].forEach(function(aHandler) {
                    aHandler.apply(null, self.value);
                });
            }
        }
        self.then = function(aResolved, aRejected) {
            var self = this;
            if (self.state === BOND_PENDING) {
                aResolved && listener[BOND_RESOLVED].push(aResolved);
                aRejected && listener[BOND_REJECTED].push(aRejected);
            } else {
                switch (self.state) {
                  case BOND_RESOLVED:
                    aResolved.apply(null, self.value);
                    break;

                  case BOND_REJECTED:
                    aRejected.apply(null, self.value);
                    break;
                }
            }
        };
        executor(resolve, reject);
    }
    Pledge.prototype = {
        constructor: Pledge,
        state: BOND_PENDING,
        value: null,
        listener: null
    };
    Pledge.defer = function() {
        var self = {};
        self.pledge = new Pledge(function(aResolve, aReject) {
            self.resolve = aResolve;
            self.reject = aReject;
        });
        return self;
    };
    Pledge.all = function(aPledges) {
        var defered = Pledge.defer(), pledge = defered.pledge, resolved = [], rejected = [], countTotal = aPledges.length, countResolved = 0;
        aPledges.forEach(function(aPledge, aIndex) {
            aPledge.then(function() {
                resolved[aIndex] = arrayPrototypeSlice.call(arguments);
                countResolved++;
                countResolved === countTotal && defered.resolve.apply(null, arrayPrototypeConcat.apply([], resolved));
            }, function() {
                rejected.push(arrayPrototypeSlice.call(arguments));
                rejected.length + countResolved === countTotal && defered.reject.apply(null, arrayPrototypeConcat.apply([], rejected));
            });
        });
        return pledge;
    };
    Pledge.race = function(aPledges) {
        var defered = Pledge.defer();
        aPledges.forEach(function(aPledge) {
            aPledge.then(defered.resolve, defered.reject);
        });
        return defered.pledge;
    };
    function Error(aMessage, aModule, aStack) {
        var self = this;
        self.message = aMessage;
        self.module = aModule;
        aStack && (self.stack = arrayPrototypeSlice.call(aStack));
        return self;
    }
    Error.prototype = {
        toString: function() {
            var self = this, result = DEMAND_PREFIX + " " + self.message + " " + self.module;
            if (self.stack) {
                result = Error.traverse(self.stack, result, 1);
            }
            return result;
        }
    };
    Error.traverse = function(stack, value, depth) {
        var indention = new Array(depth + 1).join(" ");
        stack.forEach(function(item) {
            value += "\n" + indention + "> " + item.message + " " + item.module;
            if (item.stack) {
                value = Error.traverse(item.stack, value, depth + 1);
            }
        });
        return value;
    };
    function Pattern(aPattern, aUrl) {
        var self = this;
        self.url = resolve.url(aUrl).href;
        self.regexPattern = isInstanceOf(aPattern, RegExp) ? aPattern : new RegExp("^" + escape(aPattern));
        self.regexUrl = new RegExp("^" + escape(aUrl));
    }
    Pattern.prototype = {
        matches: function(aPath) {
            return this.regexPattern.test(aPath);
        },
        remove: function(aUrl) {
            return aUrl.replace(this.regexUrl, "");
        },
        process: function(aPath) {
            var self = this;
            return aPath.replace(self.regexPattern, self.url);
        }
    };
    function Queue() {
        var self = this;
        self.queue = [];
        self.current = null;
    }
    Queue.prototype = {
        length: 0,
        add: function(aItem) {
            var self = this, queue = self.queue;
            queue.push(aItem);
            self.length++;
            queue.length === 1 && self.next();
        },
        next: function() {
            var self = this, current = self.current, queue = self.queue, pointer;
            if (current) {
                self.current = null;
                queue.shift();
                self.length--;
            }
            if (queue.length) {
                current = self.current = self.queue[0];
                pointer = handler[current.handler];
                !current.cached && pointer.modify && (current.source = pointer.modify(current.url, current.source));
                pointer.resolve(current.path, current.source);
                setTimeout(function() {
                    current.defered.reject(new Error("timeout resolving module", current.path));
                }, timeout / 5);
            }
        }
    };
    function Loader(aPath, aParent) {
        var self = this, defered = Pledge.defer(), xhr = new XMLHttpRequest(), pointer;
        resolve.path.call(self, aPath, aParent);
        self.defered = defered;
        self.pledge = defered.pledge;
        pointer = handler[self.handler];
        if (!parent) {
            self.pledge.then(null, log);
        }
        if (pointer) {
            self.retrieve();
            if (self.cached) {
                queue.add(self);
            } else {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200 || xhr.status === 0 && xhr.responseText) {
                            self.source = xhr.responseText;
                            queue.add(self);
                        } else {
                            defered.reject(new Error("unable to load module", self.path));
                        }
                    }
                };
                xhr.open("GET", self.url + pointer.suffix, true);
                xhr.send();
                setTimeout(function() {
                    if (xhr.readyState < 4) {
                        xhr.abort();
                    }
                }, timeout);
            }
        } else {
            defered.reject(new Error('no handler "' + self.handler + '" for', self.path));
        }
        return self;
    }
    Loader.prototype = {
        store: function() {
            var self = this;
            storage.set(self.path, self.source, self.url);
        },
        retrieve: function() {
            var self = this, cache = storage.get(self.path, self.url), cached = self.cached = !!cache;
            cached && (self.source = cache);
        }
    };
    function Module(aPath, aFactory, aDependencies) {
        var self = this, defered = Pledge.defer();
        resolve.path.call(self, aPath);
        self.pledge = defered.pledge;
        self.pledge.then(null, function() {
            log(new Error("unable to resolve module", self.path, arguments));
        });
        if (aDependencies.length > 0) {
            demand.apply(self, aDependencies).then(function() {
                defered.resolve(aFactory.apply(null, arguments));
            }, function() {
                defered.reject(new Error("unable to resolve dependencies for", self.path, arguments));
            });
        } else {
            defered.resolve(aFactory());
        }
        return self;
    }
    JavascriptHandler = {
        resolve: function(aPath, aValue) {
            var script = document.createElement("script");
            script.type = "application/javascript";
            script.defer = script.async = true;
            script.text = aValue;
            script.setAttribute("demand-path", aPath);
            target.appendChild(script);
        }
    };
    CssHandler = {
        resolve: function(aPath, aValue) {
            var style = document.createElement("style"), sheet = style.styleSheet;
            style.type = "text/css";
            style.media = "only x";
            sheet && (sheet.cssText = aValue) || (style.innerHTML = aValue);
            style.setAttribute("demand-path", aPath);
            target.appendChild(style);
            setTimeout(function() {
                provide(function() {
                    return style;
                });
            });
        },
        modify: function(aUrl, aValue) {
            var base = resolve.url(aUrl + "/..").href, match;
            while (match = regexMatchCssUrl.exec(aValue)) {
                aValue = aValue.replace(match[0], "url(" + resolve.url(base + match[1]).pathname + ")");
            }
            return aValue;
        }
    };
    queue = new Queue();
    storage.clear(true);
    addHandler("application/javascript", ".js", JavascriptHandler);
    addHandler("text/css", ".css", CssHandler);
    configure(defaults) && settings && configure(settings);
    demand.configure = configure;
    demand.addHandler = addHandler;
    demand.clear = storage.clear;
    global.demand = demand;
    global.provide = provide;
    provide("/demand", function() {
        return demand;
    });
    provide("/provide", function() {
        return provide;
    });
    provide("/pledge", function() {
        return Pledge;
    });
    if (main) {
        demand(main);
    }
})(this);