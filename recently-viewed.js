/**
 * # Recently Viewed
 *
 * Supports display of recently viewed Products, Pages and Categories
 * as required by any Theme in Evance.
 *
 * @type {{clear: RecentlyViewed.clear, show: RecentlyViewed.show, config: (function(): {fragment: null, wrapperId: string, templateId: string, storageLimit: number, displayLimit: number}), register: RecentlyViewed.register}}
 */
RecentlyViewed = (function() {

    var config = {
        displayLimit: 3,
        storageLimit: 10,
        wrapperId: 'recently-viewed',
        fragment: null,
        templateId: 'recently-viewed-template'
    };

    var searchUri = {
        category: '/category/search.json',
        page: '/page/search.json',
        product: '/product/search.json'
    }

    var template = null;
    var wrapper = null;

    var cookie = {
        config: {
            expires: 90,
            path: '/',
            domain: window.location.hostname
        },
        name: 'recently-viewed',
        read: function() {
            var recentlyViewed = {
                product: [],
                page: [],
                category: []
            };
            var cookieValue = $.cookie(this.name);
            if (cookieValue !== null) {
                recentlyViewed = JSON.parse(cookieValue);
            }
            return recentlyViewed;
        },
        destroy: function() {
            $.cookie(this.name, null, this.config);
        },
        remove: function(type, id) {
            var recentlyViewed = this.read();
            var position = $.inArray(id, recentlyViewed[type]);
            if (position !== -1) {
                recentlyViewed[type].splice(position, 1);
                this.write(recentlyViewed);
            }
        },
        write: function(recentlyViewed) {
            $.cookie(this.name, JSON.stringify(recentlyViewed), this.config);
        }
    };

    var localiseUri = function(uri) {
        var uriPrefix = $('meta[name="ev:locale:uri"]').attr('content');
        return uriPrefix + uri;
    }

    var draw = function(type, typeIds) {
        var data = {
            'id:in': typeIds.join(',')
        };
        if (config.fragment) {
            data.fragment = config.fragment;
        }

        $.ajax({
            dataType: 'json',
            url: localiseUri(searchUri[type]),
            data: data,
            success: function(data) {
                var rendered = renderObjects(data);
                var itemsRendered = 0;
                typeIds.forEach(function(id, i) {
                    if (!rendered[id]) {
                        cookie.remove(type, id);
                        return;
                    }
                    if (i >= config.displayLimit) {
                        return;
                    }
                    wrapper.append(rendered[id]);
                    ++itemsRendered;
                });
                if (config.onComplete) {
                    config.onComplete();
                }
            }
        });
    };

    var renderObjects = function(data) {
        var renderedObjects = {};
        var tpl = evance.template(template.html());
        data.results.forEach(function(objectData, i) {
            renderedObjects[objectData.id] = tpl({
                fragment: data.fragments[i],
                product: objectData
            });
        });
        return renderedObjects;
    };

    return {
        config: function() {
            return config;
        },
        clear: function() {
            cookie.destroy();
        },
        register: function(type, id) {
            var recentlyViewed = cookie.read();
            var position = jQuery.inArray(id, recentlyViewed[type]);
            if (position === -1) {
                recentlyViewed[type].unshift(id);
                recentlyViewed[type] = recentlyViewed[type].splice(0, config.storageLimit);
            } else {
                recentlyViewed[type].splice(position, 1);
                recentlyViewed[type].unshift(id);
            }
            cookie.write(recentlyViewed);
        },
        show: function(type, params) {
            var params = params || {};
            $.extend(config, params);

            var recentlyViewed = cookie.read();
            var typeIds = recentlyViewed[type];

            template = $('#' + config.templateId);
            wrapper = $('#' + config.wrapperId);

            config.displayLimit = Math.min(typeIds.length, config.displayLimit);
            if (config.displayLimit && template.length && wrapper.length) {
                draw(type, typeIds);
            }
        }
    };
})();
