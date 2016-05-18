angular.module("sakaryarehberi.controllers", [])
    .controller("AuthCtrl", ["$scope", "$ionicConfig", function (n, e) { }])
    .controller("AppCtrl", ["$scope", "$ionicConfig", function (n, e) { }])
    .controller("LoginCtrl", ["$scope", "$state", "$templateCache", "$q", "$rootScope", function (n, e, t, o, i) {
        n.doLogIn = function () {
            e.go("app.feeds-categories")
        };
        n.user = {},
        n.user.email = "john@doe.com",
        n.user.pin = "12345",
        n.selected_tab = "",
        n.$on("my-tabs-changed", function (e, t) {
            n.selected_tab = t.title
        })
    }])
    .controller("SignupCtrl", ["$scope", "$state", function (n, e) {
        n.user = {},
        n.user.email = "john@doe.com",
        n.doSignUp = function () {
            e.go("app.feeds-categories")
        }
    }])
    .controller("ForgotPasswordCtrl", ["$scope", "$state", function (n, e) {
        n.recoverPassword = function () {
            e.go("app.feeds-categories")
        },
        n.user = {}
    }])
    .controller("RateApp", ["$scope", function (n) {
        n.rateApp = function () {
            if (ionic.Platform.isIOS()) {
                AppRate.preferences.storeAppURL.ios = "1234555553>"
                AppRate.promptForRating(true);
            }
            else if (ionic.Platform.isAndroid())
                AppRate.preferences.storeAppURL.android = "market://details?id=ionFB";
                AppRate.promptForRating(true)
        }
    }])
    .controller("SendMailCtrl", ["$scope", function (n) { n.sendMail = function () { 
			cordova.plugins.email.isAvailable(function (n) { 
					cordova.plugins.email.open(
					{
						to: "envato@startapplabs.com",
						cc: "hello@startapplabs.com",
						subject: "Greetings", 
						body: "How are you? Nice greetings from IonFullApp" 
						})
						}) }
						
						// }])
						// }])

    .controller("MapsCtrl", ["$scope", "$ionicLoading", function (n, e) {
        n.info_position = { lat: 43.07493, lng: -89.381388 },
        n.center_position = { lat: 43.07493, lng: -89.381388 },
        n.my_location = "";
        n.$on("mapInitialized", function (e, t) {
            n.map = t
        });
        n.centerOnMe = function () {
            n.positions = [];
            e.show({ template: "Loading..." });
            navigator.geolocation.getCurrentPosition(function (t) {
                var o = new google.maps.LatLng(t.coords.latitude, t.coords.longitude);
                n.current_position = { lat: o.G, lng: o.K };
                n.my_location = o.G + ", " + o.K, n.map.setCenter(o);
                e.hide();
            })
        }
    }])

    .controller("FeedsCategoriesCtrl", ["$scope", "$http", function (n, e) { n.feeds_categories = [], e.get("feeds-categories.json").success(function (e) { n.feeds_categories = e }) }]).controller("CategoryFeedsCtrl", ["$scope", "$http", "$stateParams", function (n, e, t) { n.category_sources = [], n.categoryId = t.categoryId, e.get("feeds-categories.json").success(function (e) { var t = _.find(e, { id: n.categoryId }); n.categoryTitle = t.title, n.category_sources = t.feed_sources }) }]).controller("FeedEntriesCtrl", ["$scope", "$stateParams", "$http", "FeedList", "$q", "$ionicLoading", "BookMarkService", function (n, e, t, o, i, s, a) { n.feed = []; var r = e.categoryId, l = e.sourceId; n.doRefresh = function () { t.get("feeds-categories.json").success(function (e) { s.show({ template: "Loading entries..." }); var t = _.find(e, { id: r }), i = _.find(t.feed_sources, { id: l }); n.sourceTitle = i.title, o.get(i.url).then(function (e) { n.feed = e.feed, s.hide(), n.$broadcast("scroll.refreshComplete") }, function (e) { s.hide(), n.$broadcast("scroll.refreshComplete") }) }) }, n.doRefresh(), n.bookmarkPost = function (n) { s.show({ template: "Post Saved!", noBackdrop: !0, duration: 1e3 }), a.bookmarkFeedPost(n) } }]).controller("SettingsCtrl", ["$scope", "$ionicActionSheet", "$state", function (n, e, t) { n.airplaneMode = !0, n.wifi = !1, n.bluetooth = !0, n.personalHotspot = !0, n.checkOpt1 = !0, n.checkOpt2 = !0, n.checkOpt3 = !1, n.radioChoice = "B", n.showLogOutMenu = function () { e.show({ destructiveText: "Logout", titleText: "Are you sure you want to logout? This app is awsome so I recommend you to stay.", cancelText: "Cancel", cancel: function () { }, buttonClicked: function (n) { return !0 }, destructiveButtonClicked: function () { t.go("auth.walkthrough") } }) } }]).controller("TinderCardsCtrl", ["$scope", "$http", function (n, e) { n.cards = [], n.addCard = function (e, t) { var o = { image: e, name: t }; o.id = Math.random(), n.cards.unshift(angular.extend({}, o)) }, n.addCards = function (t) { e.get("http://api.randomuser.me/?results=" + t).then(function (e) { angular.forEach(e.data.results, function (e) { n.addCard(e.user.picture.large, e.user.name.first + " " + e.user.name.last) }) }) }, n.addFirstCards = function () { n.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png", "Nope"), n.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes") }, n.addFirstCards(), n.addCards(5), n.cardDestroyed = function (e) { n.cards.splice(e, 1), n.addCards(1) }, n.transitionOut = function (n) { console.log("card transition out") }, n.transitionRight = function (n) { console.log("card removed to the right"), console.log(n) }, n.transitionLeft = function (n) { console.log("card removed to the left"), console.log(n) } }])
    .controller("BookMarksCtrl", ["$scope", "$rootScope", "BookMarkService", "$state", function (n, e, t, o) { n.bookmarks = t.getBookmarks(), e.$on("new-bookmark", function (e) { n.bookmarks = t.getBookmarks() }), n.goToFeedPost = function (n) { window.open(n, "_blank", "location=yes") }, n.goToWordpressPost = function (n) { o.go("app.post", { postId: n }) } }]).controller("WordpressCtrl", ["$scope", "$http", "$ionicLoading", "PostService", "BookMarkService", function (n, e, t, o, i) { n.posts = [], n.page = 1, n.totalPages = 1, n.doRefresh = function () { t.show({ template: "Loading posts..." }), o.getRecentPosts(1).then(function (e) { n.totalPages = e.pages, n.posts = o.shortenPosts(e.posts), t.hide(), n.$broadcast("scroll.refreshComplete") }) }, n.loadMoreData = function () { n.page += 1, o.getRecentPosts(n.page).then(function (e) { n.totalPages = e.pages; var t = o.shortenPosts(e.posts); n.posts = n.posts.concat(t), n.$broadcast("scroll.infiniteScrollComplete") }) }, n.moreDataCanBeLoaded = function () { return n.totalPages > n.page }, n.bookmarkPost = function (n) { t.show({ template: "Post Saved!", noBackdrop: !0, duration: 1e3 }), i.bookmarkWordpressPost(n) }, n.doRefresh() }]).controller("WordpressPostCtrl", ["$scope", "post_data", "$ionicLoading", function (n, e, t) { n.post = e.post, t.hide(), n.sharePost = function (n) { window.plugins.socialsharing.share("Check this post here: ", null, null, n) } }])
    .controller("ImagePickerCtrl", ["$scope", "$rootScope", "$cordovaCamera", function (n, e, t) {
        n.images = [],
        n.selImages = function () {
            window.imagePicker.getPictures(function (e) {
                for (var t = 0; t < e.length; t++) {
                    console.log("Image URI: " + e[t]);
                    n.images.push(e[t]);
                    if (!n.$$phase)
                        n.$apply(function (n) { console.log("Error: " + n) });

                }

            })
        };
        n.removeimage = function (e) {
            n.images = _.without(n.images, e)
        };
        n.shareImage = function (n) {
            window.plugins.socialsharing.share(null, null, n)
        },
        n.shareAll = function () {
            window.plugins.socialsharing.share(null, null, n.images)
        };
    }]);
