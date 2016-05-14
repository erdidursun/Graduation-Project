angular.module('sakaryarehberi.directives', [])
.directive("multiBg", function () {
    return {
        scope: { multiBg: "=", interval: "=", helperClass: "@" },
        controller: ["$scope", "$element", "$attrs",
            function (e, t, o) {
                e.loaded = false;
                var i = this;
                this.animateBg = function () {
                    t.css({
                        "background-image": "url(" + e.bg_img + ")"
                    })
                    e.loaded = true;
                    console.log(e.loaded);
                };
                this.setBackground = function (n) {
                    e.bg_img = n
                };
                if (!_.isUndefined(e.multiBg) && _.isArray(e.multiBg) && e.multiBg.length > 0)
                    i.setBackground(e.multiBg[0])
            }],
        templateUrl: "views/common/multi-bg.html",
        restrict: "A", replace: true, transclude: true
    }
})
.directive("bg", function () {
    return {
        restrict: "A",
        require: "^multiBg",
        scope: { ngSrc: "@" },
        link: function (n, e, t, o) {
            e.on("load", function () {
                o.animateBg()
            })
        }
    }
})
.directive("myTabs", function () {
    return {
        restrict: "E",
        transclude: !0,
        scope: {},
        controller: ["$scope", function (n) {
            var e = n.tabs = [];
            n.select = function (t) {
                angular.forEach(e, function (n) { n.selected = !1 }), t.selected = !0, n.$emit("my-tabs-changed", t)
            }, this.addTab = function (t) { 0 === e.length && n.select(t), e.push(t) }
        }], templateUrl: "views/common/my-tabs.html"
    }
})
.directive("myTab", function () {
     return {
         require: "^myTabs",
         restrict: "E",
         transclude: !0,
         scope: { title: "@" },
         link: function (n, e, t, o) {
             o.addTab(n)
         },
         templateUrl: "views/common/my-tab.html"
     }
 })
.directive("showHideContainer", function () {
    return {
        scope: {},
        controller: ["$scope", "$element", "$attrs", function (n, e, t) {
            n.show = !1, n.toggleType = function (e) {
                e.stopPropagation();
                e.preventDefault();
                n.show = !n.show;
                n.$broadcast("toggle-type", n.show)
            }
        }],
        templateUrl: "views/common/show-hide-password.html",
        restrict: "A",
        replace: !1,
        transclude: !0
    }
})
.directive("showHideInput", function () {
    return {
        scope: {},
        link: function (n, e, t) {
            n.$on("toggle-type", function (n, t) {
                { var o = e[0]; o.getAttribute("type") } t || o.setAttribute("type", "password"), t && o.setAttribute("type", "text")
            })
        },
        require: "^showHideContainer", restrict: "A", replace: !1, transclude: !1
    }
})