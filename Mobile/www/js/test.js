angular.module("underscore",[]).factory("_",function(){return window._}),angular.module("your_app_name",["ionic","angularMoment","your_app_name.controllers","your_app_name.directives","your_app_name.filters","your_app_name.services","your_app_name.factories","your_app_name.config","your_app_name.views","underscore","ngMap","ngResource","ngCordova","slugifier","ionic.contrib.ui.tinderCards","youtube-embed"]).run(["$ionicPlatform","PushNotificationsService","$rootScope","$ionicConfig","$timeout",function(n,e,t,o,i){n.on("deviceready",function(){window.cordova&&window.cordova.plugins.Keyboard&&cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),window.StatusBar&&StatusBar.styleDefault(),e.register()}),t.$on("$stateChangeStart",function(n,e,t,s,a){e.name.indexOf("auth.walkthrough")>-1&&i(function(){o.views.transition("android"),o.views.swipeBackEnabled(!1),console.log("setting transition to android and disabling swipe back")},0)}),t.$on("$stateChangeSuccess",function(n,e,t,i,s){e.name.indexOf("app.feeds-categories")>-1&&(o.views.transition("platform"),ionic.Platform.isIOS()&&o.views.swipeBackEnabled(!0),console.log("enabling swipe back and restoring transition to platform default",o.views.transition()))}),n.on("resume",function(){e.register()})}]).config(["$stateProvider","$urlRouterProvider","$ionicConfigProvider",function(n,e,t){n.state("auth",{url:"/auth",templateUrl:"views/auth/auth.html","abstract":!0,controller:"AuthCtrl"}).state("auth.walkthrough",{url:"/walkthrough",templateUrl:"views/auth/walkthrough.html"}).state("auth.login",{url:"/login",templateUrl:"views/auth/login.html",controller:"LoginCtrl"}).state("auth.signup",{url:"/signup",templateUrl:"views/auth/signup.html",controller:"SignupCtrl"}).state("auth.forgot-password",{url:"/forgot-password",templateUrl:"views/auth/forgot-password.html",controller:"ForgotPasswordCtrl"}).state("app",{url:"/app","abstract":!0,templateUrl:"views/app/side-menu.html",controller:"AppCtrl"}).state("app.miscellaneous",{url:"/miscellaneous",views:{menuContent:{templateUrl:"views/app/miscellaneous/miscellaneous.html"}}}).state("app.maps",{url:"/miscellaneous/maps",views:{menuContent:{templateUrl:"views/app/miscellaneous/maps.html",controller:"MapsCtrl"}}}).state("app.image-picker",{url:"/miscellaneous/image-picker",views:{menuContent:{templateUrl:"views/app/miscellaneous/image-picker.html",controller:"ImagePickerCtrl"}}}).state("app.layouts",{url:"/layouts",views:{menuContent:{templateUrl:"views/app/layouts/layouts.html"}}}).state("app.tinder-cards",{url:"/layouts/tinder-cards",views:{menuContent:{templateUrl:"views/app/layouts/tinder-cards.html",controller:"TinderCardsCtrl"}}}).state("app.slider",{url:"/layouts/slider",views:{menuContent:{templateUrl:"views/app/layouts/slider.html"}}}).state("app.feeds-categories",{url:"/feeds-categories",views:{menuContent:{templateUrl:"views/app/feeds/feeds-categories.html",controller:"FeedsCategoriesCtrl"}}}).state("app.category-feeds",{url:"/category-feeds/:categoryId",views:{menuContent:{templateUrl:"views/app/feeds/category-feeds.html",controller:"CategoryFeedsCtrl"}}}).state("app.feed-entries",{url:"/feed-entries/:categoryId/:sourceId",views:{menuContent:{templateUrl:"views/app/feeds/feed-entries.html",controller:"FeedEntriesCtrl"}}}).state("app.wordpress",{url:"/wordpress",views:{menuContent:{templateUrl:"views/app/wordpress/wordpress.html",controller:"WordpressCtrl"}}}).state("app.post",{url:"/wordpress/:postId",views:{menuContent:{templateUrl:"views/app/wordpress/wordpress_post.html",controller:"WordpressPostCtrl"}},resolve:{post_data:["PostService","$ionicLoading","$stateParams",function(n,e,t){e.show({template:"Loading post ..."});var o=t.postId;return n.getPost(o)}]}}).state("app.settings",{url:"/settings",views:{menuContent:{templateUrl:"views/app/settings.html",controller:"SettingsCtrl"}}}).state("app.forms",{url:"/forms",views:{menuContent:{templateUrl:"views/app/forms.html"}}}).state("app.profile",{url:"/profile",views:{menuContent:{templateUrl:"views/app/profile.html"}}}).state("app.bookmarks",{url:"/bookmarks",views:{menuContent:{templateUrl:"views/app/bookmarks.html",controller:"BookMarksCtrl"}}}),e.otherwise("/auth/walkthrough")}]),angular.module("your_app_name.controllers",[]).controller("AuthCtrl",["$scope","$ionicConfig",function(n,e){}]).controller("AppCtrl",["$scope","$ionicConfig",function(n,e){}]).controller("LoginCtrl",["$scope","$state","$templateCache","$q","$rootScope",function(n,e,t,o,i){n.doLogIn=function(){e.go("app.feeds-categories")},n.user={},n.user.email="john@doe.com",n.user.pin="12345",n.selected_tab="",n.$on("my-tabs-changed",function(e,t){n.selected_tab=t.title})}]).controller("SignupCtrl",["$scope","$state",function(n,e){n.user={},n.user.email="john@doe.com",n.doSignUp=function(){e.go("app.feeds-categories")}}]).controller("ForgotPasswordCtrl",["$scope","$state",function(n,e){n.recoverPassword=function(){e.go("app.feeds-categories")},n.user={}}]).controller("RateApp",["$scope",function(n){n.rateApp=function(){ionic.Platform.isIOS()?(AppRate.preferences.storeAppURL.ios="1234555553>",AppRate.promptForRating(!0)):ionic.Platform.isAndroid()&&(AppRate.preferences.storeAppURL.android="market://details?id=ionFB",AppRate.promptForRating(!0))}}]).controller("SendMailCtrl",["$scope",function(n){n.sendMail=function(){cordova.plugins.email.isAvailable(function(n){cordova.plugins.email.open({to:"envato@startapplabs.com",cc:"hello@startapplabs.com",subject:"Greetings",body:"How are you? Nice greetings from IonFullApp"})})}}]).controller("MapsCtrl",["$scope","$ionicLoading",function(n,e){n.info_position={lat:43.07493,lng:-89.381388},n.center_position={lat:43.07493,lng:-89.381388},n.my_location="",n.$on("mapInitialized",function(e,t){n.map=t}),n.centerOnMe=function(){n.positions=[],e.show({template:"Loading..."}),navigator.geolocation.getCurrentPosition(function(t){var o=new google.maps.LatLng(t.coords.latitude,t.coords.longitude);n.current_position={lat:o.G,lng:o.K},n.my_location=o.G+", "+o.K,n.map.setCenter(o),e.hide()})}}]).controller("AdsCtrl",["$scope","$ionicActionSheet","AdMob","iAd",function(n,e,t,o){n.manageAdMob=function(){e.show({buttons:[{text:"Show Banner"},{text:"Show Interstitial"}],destructiveText:"Remove Ads",titleText:"Choose the ad to show",cancelText:"Cancel",cancel:function(){},destructiveButtonClicked:function(){return console.log("removing ads"),t.removeAds(),!0},buttonClicked:function(n,e){return"Show Banner"==e.text&&(console.log("show banner"),t.showBanner()),"Show Interstitial"==e.text&&(console.log("show interstitial"),t.showInterstitial()),!0}})},n.manageiAd=function(){e.show({buttons:[{text:"Show iAd Banner"},{text:"Show iAd Interstitial"}],destructiveText:"Remove Ads",titleText:"Choose the ad to show - Interstitial only works in iPad",cancelText:"Cancel",cancel:function(){},destructiveButtonClicked:function(){return console.log("removing ads"),o.removeAds(),!0},buttonClicked:function(n,e){return"Show iAd Banner"==e.text&&(console.log("show iAd banner"),o.showBanner()),"Show iAd Interstitial"==e.text&&(console.log("show iAd interstitial"),o.showInterstitial()),!0}})}}]).controller("FeedsCategoriesCtrl",["$scope","$http",function(n,e){n.feeds_categories=[],e.get("feeds-categories.json").success(function(e){n.feeds_categories=e})}]).controller("CategoryFeedsCtrl",["$scope","$http","$stateParams",function(n,e,t){n.category_sources=[],n.categoryId=t.categoryId,e.get("feeds-categories.json").success(function(e){var t=_.find(e,{id:n.categoryId});n.categoryTitle=t.title,n.category_sources=t.feed_sources})}]).controller("FeedEntriesCtrl",["$scope","$stateParams","$http","FeedList","$q","$ionicLoading","BookMarkService",function(n,e,t,o,i,s,a){n.feed=[];var r=e.categoryId,l=e.sourceId;n.doRefresh=function(){t.get("feeds-categories.json").success(function(e){s.show({template:"Loading entries..."});var t=_.find(e,{id:r}),i=_.find(t.feed_sources,{id:l});n.sourceTitle=i.title,o.get(i.url).then(function(e){n.feed=e.feed,s.hide(),n.$broadcast("scroll.refreshComplete")},function(e){s.hide(),n.$broadcast("scroll.refreshComplete")})})},n.doRefresh(),n.bookmarkPost=function(n){s.show({template:"Post Saved!",noBackdrop:!0,duration:1e3}),a.bookmarkFeedPost(n)}}]).controller("SettingsCtrl",["$scope","$ionicActionSheet","$state",function(n,e,t){n.airplaneMode=!0,n.wifi=!1,n.bluetooth=!0,n.personalHotspot=!0,n.checkOpt1=!0,n.checkOpt2=!0,n.checkOpt3=!1,n.radioChoice="B",n.showLogOutMenu=function(){e.show({destructiveText:"Logout",titleText:"Are you sure you want to logout? This app is awsome so I recommend you to stay.",cancelText:"Cancel",cancel:function(){},buttonClicked:function(n){return!0},destructiveButtonClicked:function(){t.go("auth.walkthrough")}})}}]).controller("TinderCardsCtrl",["$scope","$http",function(n,e){n.cards=[],n.addCard=function(e,t){var o={image:e,name:t};o.id=Math.random(),n.cards.unshift(angular.extend({},o))},n.addCards=function(t){e.get("http://api.randomuser.me/?results="+t).then(function(e){angular.forEach(e.data.results,function(e){n.addCard(e.user.picture.large,e.user.name.first+" "+e.user.name.last)})})},n.addFirstCards=function(){n.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png","Nope"),n.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png","Yes")},n.addFirstCards(),n.addCards(5),n.cardDestroyed=function(e){n.cards.splice(e,1),n.addCards(1)},n.transitionOut=function(n){console.log("card transition out")},n.transitionRight=function(n){console.log("card removed to the right"),console.log(n)},n.transitionLeft=function(n){console.log("card removed to the left"),console.log(n)}}]).controller("BookMarksCtrl",["$scope","$rootScope","BookMarkService","$state",function(n,e,t,o){n.bookmarks=t.getBookmarks(),e.$on("new-bookmark",function(e){n.bookmarks=t.getBookmarks()}),n.goToFeedPost=function(n){window.open(n,"_blank","location=yes")},n.goToWordpressPost=function(n){o.go("app.post",{postId:n})}}]).controller("WordpressCtrl",["$scope","$http","$ionicLoading","PostService","BookMarkService",function(n,e,t,o,i){n.posts=[],n.page=1,n.totalPages=1,n.doRefresh=function(){t.show({template:"Loading posts..."}),o.getRecentPosts(1).then(function(e){n.totalPages=e.pages,n.posts=o.shortenPosts(e.posts),t.hide(),n.$broadcast("scroll.refreshComplete")})},n.loadMoreData=function(){n.page+=1,o.getRecentPosts(n.page).then(function(e){n.totalPages=e.pages;var t=o.shortenPosts(e.posts);n.posts=n.posts.concat(t),n.$broadcast("scroll.infiniteScrollComplete")})},n.moreDataCanBeLoaded=function(){return n.totalPages>n.page},n.bookmarkPost=function(n){t.show({template:"Post Saved!",noBackdrop:!0,duration:1e3}),i.bookmarkWordpressPost(n)},n.doRefresh()}]).controller("WordpressPostCtrl",["$scope","post_data","$ionicLoading",function(n,e,t){n.post=e.post,t.hide(),n.sharePost=function(n){window.plugins.socialsharing.share("Check this post here: ",null,null,n)}}]).controller("ImagePickerCtrl",["$scope","$rootScope","$cordovaCamera",function(n,e,t){n.images=[],n.selImages=function(){window.imagePicker.getPictures(function(e){for(var t=0;t
<e.length;t++)console.log( "Image URI: "+e[t]),n.images.push(e[t]);n.$$phase||n.$apply()},function(n){console.log( "Error: "+n)})},n.removeImage=function(e){n.images=_.without(n.images,e)},n.shareImage=function(n){window.plugins.socialsharing.share(null,null,n)},n.shareAll=function(){window.plugins.socialsharing.share(null,null,n.images)}}]),angular.module( "your_app_name.directives",[]).directive( "myTabs",function(){return{restrict: "E",transclude:!0,scope:{},controller:[ "$scope",function(n){var e=n.tabs=[];n.select=function(t){angular.forEach(e,function(n){n.selected=!1}),t.selected=!0,n.$emit( "my-tabs-changed",t)},this.addTab=function(t){0===e.length&&n.select(t),e.push(t)}}],templateUrl: "views/common/my-tabs.html"}}).directive( "myTab",function(){return{require: "^myTabs",restrict: "E",transclude:!0,scope:{title: "@"},link:function(n,e,t,o){o.addTab(n)},templateUrl: "views/common/my-tab.html"}}).directive( "validPin",[ "$http",function(n){return{require: "ngModel",link:function(n,e,t,o){n.$watch(t.ngModel,function(n){ "12345"==n?o.$setValidity( "valid-pin",!0):o.$setValidity( "valid-pin",!1)})}}}]).directive( "showHideContainer",function(){return{scope:{},controller:[ "$scope", "$element", "$attrs",function(n,e,t){n.show=!1,n.toggleType=function(e){e.stopPropagation(),e.preventDefault(),n.show=!n.show,n.$broadcast( "toggle-type",n.show)}}],templateUrl: "views/common/show-hide-password.html",restrict: "A",replace:!1,transclude:!0}}).directive( "showHideInput",function(){return{scope:{},link:function(n,e,t){n.$on( "toggle-type",function(n,t){{var o=e[0];o.getAttribute( "type")}t||o.setAttribute( "type", "password"),t&&o.setAttribute( "type", "text")})},require: "^showHideContainer",restrict: "A",replace:!1,transclude:!1}}).directive( "biggerText",[ "$ionicGesture",function(n){return{restrict: "A",link:function(e,t,o){n.on( "touch",function(n){n.stopPropagation(),n.preventDefault();var e=document.querySelector(o.biggerText),t=document.querySelector( ".menu-content"),i=window.getComputedStyle(e,null).getPropertyValue( "font-size"),s=parseFloat(i),a=Math.min(s+2,24),r=a+ "px";t.classList.remove( "post-size-"+i),t.classList.add( "post-size-"+r)},t)}}}]).directive( "smallerText",[ "$ionicGesture",function(n){return{restrict: "A",link:function(e,t,o){n.on( "touch",function(n){n.stopPropagation(),n.preventDefault();var e=document.querySelector(o.smallerText),t=document.querySelector( ".menu-content"),i=window.getComputedStyle(e,null).getPropertyValue( "font-size"),s=parseFloat(i),a=Math.max(s-2,12),r=a+ "px";t.classList.remove( "post-size-"+i),t.classList.add( "post-size-"+r)},t)}}}]).directive( "ionicYoutubeVideo",[ "$timeout", "$ionicPlatform", "youtubeEmbedUtils",function(n,e,t){return{restrict: "E",scope:{videoId: "@"},controller:[ "$scope", "$element", "$attrs",function(n,o,i){n.playerVars={rel:0,showinfo:0},e.on( "pause",function(){var e=t.ready;e&&n.yt_video.stopVideo()})}],templateUrl: "views/common/ionic-youtube-video.html",replace:!1}}]).directive( "postContent",[ "$timeout", "_", "$compile",function(n,e,t){return{restrict: "A",scope:{},link:function(o,i,s){function a(n){var e=/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11,})(?:\S+)?$/gim;return n.match(e)?RegExp.$1:!1}n(function(){var n=i.find( "iframe");n.length>0&&angular.forEach(n,function(n){var i=angular.element(n),s=i.length>0&&!e.isUndefined(i[0].src)?a(i[0].src):!1;if(s!==!1){var r=t("
    <ionic-youtube-video video-id='"+s+"'></ionic-youtube-video>")(o);i.parent().append(r),i.remove()}})},10)}}}]).directive("dynamicAnchorFix",["$ionicGesture","$timeout","$cordovaInAppBrowser",function(n,e,t){return{scope:{},link:function(n,o,i){e(function(){var n=o.find("a");n.length>0&&angular.forEach(n,function(n){var e=angular.element(n);e.bind("click",function(n){n.preventDefault(),n.stopPropagation();var e=n.currentTarget.href,o={};t.open(e,"_blank",o).then(function(n){})["catch"](function(n){})})})},10)},restrict:"A",replace:!1,transclude:!1}}]).directive("multiBg",["_",function(n){return{scope:{multiBg:"=",interval:"=",helperClass:"@"},controller:["$scope","$element","$attrs",function(e,t,o){e.loaded=!1;var i=this;this.animateBg=function(){e.$apply(function(){e.loaded=!0,t.css({"background-image":"url("+e.bg_img+")"})})},this.setBackground=function(n){e.bg_img=n},n.isUndefined(e.multiBg)||i.setBackground(n.isArray(e.multiBg)&&e.multiBg.length>1&&!n.isUndefined(e.interval)&&n.isNumber(e.interval)?e.multiBg[0]:e.multiBg[0])}],templateUrl:"views/common/multi-bg.html",restrict:"A",replace:!0,transclude:!0}}]).directive("bg",function(){return{restrict:"A",require:"^multiBg",scope:{ngSrc:"@"},link:function(n,e,t,o){e.on("load",function(){o.animateBg()})}}}).directive("preImg",function(){return{restrict:"E",transclude:!0,scope:{ratio:"@",helperClass:"@"},controller:["$scope",function(n){n.loaded=!1,this.hideSpinner=function(){n.$apply(function(){n.loaded=!0})}}],templateUrl:"views/common/pre-img.html"}}).directive("spinnerOnLoad",function(){return{restrict:"A",require:"^preImg",scope:{ngSrc:"@"},link:function(n,e,t,o){e.on("load",function(){o.hideSpinner()})}}}),angular.module("your_app_name.filters",[]).filter("rawHtml",["$sce",function(n){return function(e){return n.trustAsHtml(e)}}]).filter("parseDate",function(){return function(n){return Date.parse(n)}}),angular.module("your_app_name.services",[]).service("FeedList",["$rootScope","FeedLoader","$q",function(n,e,t){this.get=function(n){var o=t.defer();return e.fetch({q:n,num:20},{},function(n){o.resolve(n.responseData)}),o.promise}}]).service("PushNotificationsService",["$rootScope","$cordovaPush","NodePushServer","GCM_SENDER_ID",function(n,e,t,o){this.register=function(){var i={};ionic.Platform.isAndroid()&&(i={senderID:o},e.register(i).then(function(n){console.log("$cordovaPush.register Success"),console.log(n)},function(n){console.log("$cordovaPush.register Error"),console.log(n)}),n.$on("$cordovaPush:notificationReceived",function(n,e){switch(console.log(JSON.stringify([e])),e.event){case"registered":e.regid.length>0&&(console.log("registration ID = "+e.regid),t.storeDeviceToken("android",e.regid));break;case"message":console.log("1"==e.foreground?"Notification received when app was opened (foreground = true)":"1"==e.coldstart?"Notification received when app was closed (not even in background, foreground = false, coldstart = true)":"Notification received when app was in background (started but not focused, foreground = false, coldstart = false)"),console.log("message = "+e.message);break;case"error":console.log("GCM error = "+e.msg);break;default:console.log("An unknown GCM event has occurred")}})),ionic.Platform.isIOS()&&(i={badge:!0,sound:!0,alert:!0},e.register(i).then(function(n){console.log("result: "+n),t.storeDeviceToken("ios",n)},function(n){console.log("Registration error: "+n)}),n.$on("$cordovaPush:notificationReceived",function(n,e){console.log(e.alert,"Push Notification Received")}))}}]).service("BookMarkService",["_","$rootScope",function(n,e){this.bookmarkFeedPost=function(t){var o=n.isUndefined(window.localStorage.ionFullApp_feed_bookmarks)?[]:JSON.parse(window.localStorage.ionFullApp_feed_bookmarks),i=n.find(o,function(n){return n.link==t.link});i||o.push({link:t.link,title:t.title,date:t.publishedDate,excerpt:t.contentSnippet}),window.localStorage.ionFullApp_feed_bookmarks=JSON.stringify(o),e.$broadcast("new-bookmark")},this.bookmarkWordpressPost=function(t){var o=n.isUndefined(window.localStorage.ionFullApp_wordpress_bookmarks)?[]:JSON.parse(window.localStorage.ionFullApp_wordpress_bookmarks),i=n.find(o,function(n){return n.id==t.id});i||o.push({id:t.id,title:t.title,date:t.date,excerpt:t.excerpt}),window.localStorage.ionFullApp_wordpress_bookmarks=JSON.stringify(o),e.$broadcast("new-bookmark")},this.getBookmarks=function(){return{feeds:JSON.parse(window.localStorage.ionFullApp_feed_bookmarks||"[]"),wordpress:JSON.parse(window.localStorage.ionFullApp_wordpress_bookmarks||"[]")}}}]).service("PostService",["$rootScope","$http","$q","WORDPRESS_API_URL",function(n,e,t,o){this.getRecentPosts=function(n){var i=t.defer();return e.jsonp(o+"get_recent_posts/?page="+n+"&callback=JSON_CALLBACK").success(function(n){i.resolve(n)}).error(function(n){i.reject(n)}),i.promise},this.getPost=function(n){var i=t.defer();return e.jsonp(o+"get_post/?post_id="+n+"&callback=JSON_CALLBACK").success(function(n){i.resolve(n)}).error(function(n){i.reject(n)}),i.promise},this.shortenPosts=function(n){var e=500;return _.map(n,function(n){if(n.content.length>e){var t=n.content.substr(0,e);t=t.substr(0,Math.min(t.length,t.lastIndexOf("</p>"))),n.content=t}return n})},this.sharePost=function(n){window.plugins.socialsharing.share("Check this post here: ",null,null,n)}}]),angular.module("your_app_name.factories",[]).factory("FeedLoader",["$resource",function(n){return n("https://ajax.googleapis.com/ajax/services/feed/load",{},{fetch:{method:"JSONP",params:{v:"1.0",callback:"JSON_CALLBACK"}}})}]).factory("NodePushServer",["$http",function(n){var e="http://192.168.1.102:8000";return{storeDeviceToken:function(t,o){var i={user:"user"+Math.floor(1e7*Math.random()+1),type:t,token:o};console.log("Post token for registered device with data "+JSON.stringify(i)),n.post(e+"/subscribe",JSON.stringify(i)).success(function(n,e){console.log("Token stored, device is successfully subscribed to receive push notifications.")}).error(function(n,e){console.log("Error storing device token."+n+" "+e)})},removeDeviceToken:function(t){var o={token:t};n.post(e+"/unsubscribe",JSON.stringify(o)).success(function(n,e){console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.")}).error(function(n,e){console.log("Error removing device token."+n+" "+e)})}}}]).factory("AdMob",["$window",function(n){var e=n.AdMob;if(e){document.addEventListener("onAdFailLoad",function(n){console.log("error: "+n.error+", reason: "+n.reason+", adNetwork:"+n.adNetwork+", adType:"+n.adType+", adEvent:"+n.adEvent)}),document.addEventListener("onAdLoaded",function(n){console.log("onAdLoaded: "+n)}),document.addEventListener("onAdPresent",function(n){console.log("onAdPresent: "+n)}),document.addEventListener("onAdLeaveApp",function(n){console.log("onAdLeaveApp: "+n)}),document.addEventListener("onAdDismiss",function(n){console.log("onAdDismiss: "+n)});var t={position:e.AD_POSITION.BOTTOM_CENTER,bgColor:"black",isTesting:!0},o={};ionic.Platform.isAndroid()&&(o={banner:"ca-app-pub-6869992474017983/9375997553",interstitial:"ca-app-pub-6869992474017983/1657046752"}),ionic.Platform.isIOS()&&(o={banner:"ca-app-pub-6869992474017983/4806197152",interstitial:"ca-app-pub-6869992474017983/7563979554"}),e.setOptions(t),e.prepareInterstitial({adId:o.interstitial,autoShow:!1,success:function(){console.log("interstitial prepared")},error:function(){console.log("failed to prepare interstitial")}})}else console.log("No AdMob?");return{showBanner:function(){e&&e.createBanner({adId:o.banner,position:e.AD_POSITION.BOTTOM_CENTER,autoShow:!0,success:function(){console.log("banner created")},error:function(){console.log("failed to create banner")}})},showInterstitial:function(){e&&e.showInterstitial()},removeAds:function(){e&&e.removeBanner()}}}]).factory("iAd",["$window",function(n){var e=n.iAd;return e?e.prepareInterstitial({autoShow:!1}):console.log("No iAd?"),{showBanner:function(){e&&e.createBanner({position:e.AD_POSITION.BOTTOM_CENTER,autoShow:!0})},showInterstitial:function(){e&&e.showInterstitial()},removeAds:function(){e&&e.removeBanner()}}}]),angular.module("your_app_name.views",[]).run(["$templateCache",function(n){n.put("views/app/bookmarks.html",'
    <ion-view class="bookmarks-view">\n
        <ion-nav-title>\n <span>Bookmarks</span>\n </ion-nav-title>\n
        <ion-content>\n
            <div ng-if="(bookmarks.wordpress.length == 0 && bookmarks.feeds.length == 0)" class="row bookmarks-container">\n
                <div class="col col-center">\n
                    <div class="empty-results">\n <i class="icon ion-bookmark"></i>\n
                        <h3 class="no-bookmarks">There\'s nothing here yet. Start exploring!</h3>\n </div>\n </div>\n </div>\n
            <ul ng-if="(bookmarks.wordpress.length > 0 || bookmarks.feeds.length > 0)" class="bookmarks-list">\n
                <div ng-if="bookmarks.feeds.length > 0" class="item item-divider">\n Feeds Bookmarks\n </div>\n
                <li class="bookmark-item" ng-repeat="bookmark in bookmarks.feeds">\n <a ng-click=goToFeedPost(bookmark.link)>\n          <h2 class="post-title" ng-bind-html="bookmark.title | rawHtml"></h2>\n          <p class="post-date">Posted <span class="post-time" am-time-ago="bookmark.date"></span></p>\n        </a>\n </li>\n
                <div ng-if="bookmarks.wordpress.length > 0" class="item item-divider">\n Wordpress bookmarks\n </div>\n
                <li class="bookmark-item" ng-repeat="bookmark in bookmarks.wordpress">\n <a ng-click=goToWordpressPost(bookmark.id)>\n          <h2 class="post-title" ng-bind-html="bookmark.title | rawHtml"></h2>\n          <p class="post-date">Posted <span class="post-time" am-time-ago="bookmark.date"></span></p>\n        </a>\n </li>\n </ul>\n </ion-content>\n</ion-view>\n'),n.put("views/app/forms.html",'
    <ion-view class="forms-view">\n
        <ion-nav-buttons side="left">\n
            <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>\n </ion-nav-buttons>\n
        <ion-nav-title>\n <span>Forms</span>\n </ion-nav-title>\n
        <ion-content>\n
            <ul class="list">\n\n
                <div class="item item-divider">Inline Labels</div>\n \n
                <label class="item item-input">\n <span class="input-label">First Name</span>\n
                    <input type="text">\n </label>\n
                <label class="item item-input">\n <span class="input-label">Last Name</span>\n
                    <input type="text">\n </label>\n
                <label class="item item-input">\n <span class="input-label">Email</span>\n
                    <input type="email">\n </label>\n\n
                <div class="item item-divider">Floating Labels</div>\n\n
                <label class="item item-input item-floating-label">\n <span class="input-label">Telephone</span>\n
                    <input type="tel" placeholder="Your phone">\n </label>\n
                <label class="item item-input item-floating-label">\n <span class="input-label">Number</span>\n
                    <input type="number" placeholder="Some number">\n </label>\n\n
                <div class="item item-divider">Stacked Labels</div>\n\n
                <label class="item item-input item-stacked-label">\n <span class="input-label">Birth date</span>\n
                    <input type="date">\n </label>\n
                <label class="item item-input item-stacked-label">\n <span class="input-label">Month</span>\n
                    <input type="month">\n </label>\n\n
                <div class="item item-divider">Placeholder Labels</div>\n\n
                <label class="item item-input">\n
                    <textarea placeholder="Description"></textarea>\n </label>\n
                <label class="item item-input">\n
                    <input type="password" placeholder="Your password">\n </label>\n\n
                <div class="item item-divider">Inset Inputs</div>\n\n
                <div class="item item-input-inset">\n
                    <label class="item-input-wrapper">\n
                        <input type="text" placeholder="Search...">\n </label>\n
                    <button class="button button-small">\n Submit\n </button>\n </div>\n </ul>\n </ion-content>\n</ion-view>\n'),n.put("views/app/profile.html",'
    <ion-view class="profile-view">\n
        <ion-nav-title>\n <span>Profile</span>\n </ion-nav-title>\n
        <ion-content>\n
            <div class="top-content row">\n
                <div class="profile-container">\n
                    <div class="user-image-container">\n
                        <pre-img ratio="_1_1" helper-class="rounded-image">\n <img class="user-image" ng-src="https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg" spinner-on-load>\n </pre-img>\n </div>\n
                    <div class="user-name">Brynn Evans</div>\n
                    <div class="user-twitter">@brynn</div>\n </div>\n
                <div class="user-background-image-outer">\n
                    <div multi-bg="[\'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg\']"></div>\n </div>\n </div>\n
            <div class="bottom-content">\n
                <div class="user-bio">\n
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>\n </div>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/app/settings.html",'
    <ion-view class="settings-view">\n
        <ion-nav-buttons side="left">\n
            <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>\n </ion-nav-buttons>\n
        <ion-nav-title>\n <span>Settings</span>\n </ion-nav-title>\n
        <ion-content>\n
            <ul class="list">\n\n
                <div class="item item-divider">TOGGLE</div>\n\n
                <ion-toggle ng-model="airplaneMode" toggle-class="toggle-assertive">Airplane Mode</ion-toggle>\n
                <ion-toggle ng-model="wifi" toggle-class="toggle-positive">Wi-Fi</ion-toggle>\n
                <ion-toggle ng-model="bluetooth" toggle-class="toggle-calm">Bluetooth</ion-toggle>\n
                <ion-toggle ng-model="personalHotspot" toggle-class="toggle-dark">Personal Hotspot</ion-toggle>\n\n
                <div class="item item-divider">CHECKBOXES</div>\n\n
                <ion-checkbox ng-model="checkOpt1">Option 1</ion-checkbox>\n
                <ion-checkbox ng-model="checkOpt2">Option 2</ion-checkbox>\n
                <ion-checkbox ng-model="checkOpt3">Option 3</ion-checkbox>\n\n
                <div class="item item-divider">RADIO</div>\n\n
                <ion-radio ng-model="radioChoice" ng-value="\'A\'">Choose A</ion-radio>\n
                <ion-radio ng-model="radioChoice" ng-value="\'B\'">Choose B</ion-radio>\n
                <ion-radio ng-model="radioChoice" ng-value="\'C\'">Choose C</ion-radio>\n\n
                <div class="item item-divider">RANGES</div>\n\n
                <div class="range">\n <i class="icon ion-volume-low"></i>\n
                    <input type="range" name="volume">\n <i class="icon ion-volume-high"></i>\n </div>\n
                <div class="item range range-positive">\n <i class="icon ion-ios-sunny-outline"></i>\n
                    <input type="range" name="volume" min="0" max="100" value="33">\n <i class="icon ion-ios-sunny"></i>\n </div>\n\n
                <div class="item item-divider"></div>\n\n
                <button class="button button-block button-assertive" ng-click="showLogOutMenu()">\n Logout\n </button>\n </ul>\n </ion-content>\n</ion-view>\n'),n.put("views/app/side-menu.html",'
    <ion-side-menus enable-menu-with-back-views="false">\n
        <ion-side-menu-content class="post-size-14px">\n
            <ion-nav-bar class="bar app-top-bar">\n
                <ion-nav-back-button>\n </ion-nav-back-button>\n
                <ion-nav-buttons side="left">\n
                    <button class="button button-icon button-clear ion-navicon" menu-toggle="left">\n </button>\n </ion-nav-buttons>\n </ion-nav-bar>\n
            <ion-nav-view name="menuContent"></ion-nav-view>\n </ion-side-menu-content>\n\n
        <ion-side-menu side="left" class="main-menu" expose-aside-when="large">\n
            <ion-content>\n
                <ion-list>\n
                    <ion-item class="heading-item item item-avatar" nav-clear menu-close ui-sref="app.profile">\n
                        <div class="user-image-container">\n
                            <pre-img ratio="_1_1" helper-class="rounded-image">\n <img class="user-image" ng-src="https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg" spinner-on-load>\n </pre-img>\n </div>\n
                        <h2 class="greeting">Hi Brynn</h2>\n
                        <p class="message">Welcome back</p>\n </ion-item>\n
                    <ion-item class="item-icon-left" nav-clear menu-close ui-sref="app.bookmarks">\n <i class="icon ion-bookmark"></i>\n
                        <h2 class="menu-text">Saved for later</h2>\n </ion-item>\n
                    <ion-item class="item-icon-left" nav-clear menu-close ui-sref="app.feeds-categories">\n <i class="icon ion-radio-waves"></i>\n
                        <h2 class="menu-text">Feeds</h2>\n </ion-item>\n
                    <ion-item class="item-icon-left" nav-clear menu-close ui-sref="app.wordpress">\n <i class="icon ion-social-wordpress"></i>\n
                        <h2 class="menu-text">Wordpress</h2>\n </ion-item>\n
                    <ion-item class="item-icon-left" nav-clear menu-close ui-sref="app.layouts">\n <i class="icon ion-wand"></i>\n
                        <h2 class="menu-text">Layouts</h2>\n </ion-item>\n
                    <ion-item class="item-icon-left" nav-clear menu-close ui-sref="app.miscellaneous">\n <i class="icon ion-asterisk"></i>\n
                        <h2 class="menu-text">Miscellaneous</h2>\n </ion-item>\n
                    <ion-item class="item-icon-left" nav-clear menu-close ui-sref="app.forms">\n <i class="icon ion-document"></i>\n
                        <h2 class="menu-text">Forms</h2>\n </ion-item>\n
                    <ion-item class="item-icon-left" nav-clear menu-close ui-sref="app.settings">\n <i class="icon ion-gear-a"></i>\n
                        <h2 class="menu-text">Settings</h2>\n </ion-item>\n\n </ion-list>\n </ion-content>\n </ion-side-menu>\n</ion-side-menus>\n'), n.put("views/auth/auth.html",'
    <ion-nav-view class="auth-outer">\n
        <div multi-bg="[\'img/bg-gif.gif\']"></div>\n
        <!-- <div multi-bg="[\'img/bg-img.jpg\']"></div> -->\n</ion-nav-view>\n'),n.put("views/auth/forgot-password.html",'
    <ion-view class="forgot-password-view auth-view" cache-view="false">\n
        <ion-content scroll="false">\n
            <div class="row">\n
                <div class="col col-center">\n
                    <div class="card forgot-password-container">\n
                        <form name="forgot_password_form" class="" novalidate>\n
                            <div class="item item-body">\n
                                <label class="item item-input">\n
                                    <input type="email" placeholder="Email" name="user_email" ng-model="user.email" required>\n </label>\n </div>\n
                            <div class="item item-body bottom-content">\n
                                <button type="submit" class="button button-positive button-block" ng-click="recoverPassword()" ng-disabled="forgot_password_form.$invalid">\n Recover it\n </button>\n </div>\n </form>\n </div>\n
                    <div class="alternative-actions">\n <a class="log-in button button-small button-clear button-light" ui-sref="auth.login">\n            Log In\n          </a>\n <a class="sign-up button button-small button-clear button-light" ui-sref="auth.signup">\n            Sign Up\n          </a>\n </div>\n </div>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/auth/login.html",'
    <ion-view class="login-view auth-view" cache-view="false">\n
        <ion-content scroll="false">\n
            <div class="row">\n
                <div class="col col-center">\n
                    <div class="card login-container" content-tabs tabsdata=\ 'tabsdata\'>\n
                        <form name="login_form" class="" novalidate ng-cloak>\n
                            <my-tabs>\n
                                <my-tab title="Email">\n
                                    <div class="list">\n
                                        <label class="item item-input">\n
                                            <input type="email" placeholder="Email" name="user_email" ng-model="user.email" required>\n </label>\n
                                        <label class="item item-input" show-hide-container>\n
                                            <input type="password" placeholder="Password" name="user_password" ng-model="user.password" required show-hide-input>\n </label>\n </div>\n </my-tab>\n
                                <my-tab title="Phone">\n
                                    <div class="list">\n
                                        <label class="item item-input">\n
                                            <input type="text" placeholder="Phone number" name="user_phone" ng-model="user.phone" required>\n </label>\n
                                        <label class="item item-input" show-hide-container>\n
                                            <input type="password" placeholder="PIN" name="user_pin" ng-model="user.pin" required valid-pin="user.pin" show-hide-input>\n </label>\n </div>\n </my-tab>\n </my-tabs>\n
                            <div class="item item-body bottom-content">\n
                                <button type="submit" class="button button-positive button-block" ng-click="doLogIn()" ng-disabled="(selected_tab==\'Email\') ? (login_form.user_email.$invalid || login_form.user_password.$invalid) : ((selected_tab==\'Phone\') ? (login_form.user_phone.$invalid || login_form.user_pin.$invalid) : false)">\n Log In\n </button>\n </div>\n </form>\n </div>\n
                    <div class="alternative-actions">\n <a class="forgot-password button button-small button-clear button-light" ui-sref="auth.forgot-password">\n            Forgot Password?\n          </a>\n <a class="sign-up button button-small button-clear button-light" ui-sref="auth.signup">\n            Sign Up\n          </a>\n </div>\n </div>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/auth/signup.html",'
    <ion-view class="signup-view auth-view" cache-view="false">\n
        <ion-content scroll="false">\n
            <div class="row">\n
                <div class="col col-center">\n
                    <div class="card sign-up-container">\n
                        <form name="signup_form" class="" novalidate>\n
                            <div class="item item-body">\n
                                <label class="item item-input">\n
                                    <input type="email" placeholder="Email" name="user_email" ng-model="user.email" required>\n </label>\n
                                <label class="item item-input" show-hide-container>\n
                                    <input type="password" placeholder="Password" name="user_password" ng-model="user.password" required show-hide-input>\n </label>\n </div>\n
                            <div class="item item-body bottom-content">\n
                                <button type="submit" class="button button-assertive button-block" ng-click="doSignUp()" ng-disabled="signup_form.$invalid">\n Sign Up\n </button>\n </div>\n </form>\n </div>\n
                    <div class="alternative-actions">\n <a class="log-in button button-small button-clear button-light" ui-sref="auth.login">\n            Log In\n          </a>\n </div>\n </div>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/auth/walkthrough.html",'
    <ion-view class="walkthrough-view" cache-view="false">\n
        <ion-content scroll="false">\n
            <div class="top-content row">\n
                <div class="col col-center">\n <img ng-src="img/logo.png">\n </div>\n </div>\n
            <div class="bottom-content row">\n
                <div class="col col-center">\n <a class="login button button-block button-stable" ui-sref="auth.login">\n          Log In\n        </a>\n <a class="sign-up button button-block button-stable" ui-sref="auth.signup">\n          Sign Up\n        </a>\n </div>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/common/ionic-youtube-video.html",'
    <youtube-video video-id="videoId" player="yt_video" player-vars="playerVars"></youtube-video>\n'),n.put("views/common/multi-bg.html",'
    <div class="multi-bg-outer" ng-class="{ \'finish-loading\': loaded }">\n <img bg class="multi-bg {{ helperClass }}" ng-src="{{ bg_img }}" />\n <span class="bg-overlay"></span>\n
        <ion-spinner ng-show="!loaded" class="spinner-on-load"></ion-spinner>\n
        <!-- <span ng-show="!loaded" class="spinner-on-load ion-load-c"></span> -->\n
        <ng-transclude></ng-transclude>\n</div>\n'),n.put("views/common/my-tab.html",'
    <div class="tab-content ng-cloak ng-hide" ng-cloak ng-show="selected" ng-transclude></div>\n'),n.put("views/common/my-tabs.html",'
    <div class="item item-divider card-heding">\n
        <div class="tabs-striped">\n
            <div class="tabs">\n <a ng-repeat="tab in tabs" ng-click="select(tab)" ng-class="{ active: tab.selected }" class="tab-item">{{tab.title}}</a>\n </div>\n </div>\n</div>\n
    <div class="item item-body">\n
        <div class="tabs-content" ng-transclude></div>\n</div>\n'),n.put("views/common/pre-img.html",'
    <div class="pre-img {{ratio}} {{ helperClass }}" ng-class="{ \'finish-loading\': loaded }">\n
        <ion-spinner ng-show="!loaded" class="spinner-on-load"></ion-spinner>\n
        <!-- <span ng-show="!loaded" class="spinner-on-load ion-load-c"></span> -->\n
        <ng-transclude></ng-transclude>\n</div>\n'),n.put("views/common/show-hide-password.html",'
    <div class="show-hide-input" ng-transclude>\n</div>\n<a class="toggle-view-anchor" on-touch="toggleType($event)">\n	<span class="ion-eye-disabled" ng-show="show"></span>\n	<span class="ion-eye" ng-show="!show"></span>\n</a>\n'),n.put("views/app/feeds/category-feeds.html",'
    <ion-view class="category-feeds-view">\n
        <ion-nav-title>\n <span>{{categoryTitle}} feeds</span>\n </ion-nav-title>\n
        <ion-content>\n
            <div class="list category-feeds">\n <a ng-repeat="source in category_sources" class="item item-icon-right" ui-sref="app.feed-entries({categoryId: categoryId, sourceId: (source.title | slugify)})">\n        <div class="thumbnail-outer">\n          <pre-img ratio="_1_1" helper-class="">\n            <img class="thumbnail" ng-src="{{source.image}}" spinner-on-load>\n          </pre-img>\n        </div>\n        <div>\n          <span class="title">{{source.title}}</span>\n          <p class="description">{{source.description}}</p>\n        </div>\n        <i class="icon ion-arrow-right-c"></i>\n      </a>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/app/feeds/feed-entries.html",'
    <ion-view class="feed-entries-view">\n
        <ion-nav-title>\n <span>{{sourceTitle}}</span>\n </ion-nav-title>\n
        <ion-content>\n
            <!-- Refresh to get the new posts -->\n
            <ion-refresher pulling-text="Pull to refresh..." on-refresh="doRefresh()">\n </ion-refresher>\n\n
            <div class="entries-list">\n
                <div ng-repeat="entry in feed.entries" class="list card entry-item">\n
                    <div class="entry-heading item item-text-wrap">\n
                        <h2 class="entry-title" ng-bind-html="entry.title | rawHtml"></h2>\n
                        <p class="entry-author">\n Published <span>{{ entry.publishedDate | parseDate | amTimeAgo }}</span>\n </p>\n </div>\n
                    <div class="entry-content item item-text-wrap">\n
                        <p class="entry-excerpt" dynamic-anchor-fix ng-bind-html="entry.contentSnippet | rawHtml"></p>\n
                        <div class="entry-actions row">\n
                            <div class="actions col col-center col-66">\n
                                <a class="button button-icon icon ion-bookmark" ng-click="bookmarkPost(entry)"></a>\n </div>\n
                            <div class="read-more col col-center col-33" dynamic-anchor-fix>\n <a class="button button-small button-block button-assertive" ng-href="{{entry.link}}">\n                Read more\n              </a>\n </div>\n </div>\n </div>\n </div>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/app/feeds/feeds-categories.html",'
    <ion-view class="feeds-categories-view">\n
        <ion-nav-buttons side="left">\n
            <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>\n </ion-nav-buttons>\n
        <ion-nav-title>\n <span>Feeds Categories</span>\n </ion-nav-title>\n
        <ion-content>\n
            <div class="row categories-list">\n
                <div ng-repeat="category in feeds_categories" class="col col-50">\n <a class="feed-category" ui-sref="app.category-feeds({categoryId: (category.title | slugify)})">\n          <pre-img ratio="_1_1" helper-class="square-image">\n            <img class="category-image" ng-src="{{category.image}}" spinner-on-load>\n          </pre-img>\n          <div class="category-bg"></div>\n          <span class="category-title">{{category.title}}</span>\n        </a>\n </div>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/app/layouts/layouts.html",'
    <ion-view class="layouts-view">\n
        <ion-nav-buttons side="left">\n
            <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>\n </ion-nav-buttons>\n
        <ion-nav-title>\n <span>Layouts</span>\n </ion-nav-title>\n
        <ion-content>\n
            <div class="list layouts-functionalities">\n <a class="item item-icon-left item-icon-right" ui-sref="app.tinder-cards">\n        <i class="icon ion-happy-outline"></i>\n        <div>\n          <span class="title">Tinder Cards</span>\n          <p class="description">Awesome Tinder Cards</p>\n        </div>\n        <i class="icon ion-arrow-right-c"></i>\n      </a>\n <a class="item item-icon-left item-icon-right" ui-sref="app.slider">\n        <i class="icon ion-arrow-swap"></i>\n        <div>\n          <span class="title">Slider</span>\n          <p class="description">Example of sliding cards</p>\n        </div>\n        <i class="icon ion-arrow-right-c"></i>\n      </a>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/app/layouts/slider.html",'
    <ion-view class="slider-view">\n
        <ion-nav-title>\n <span>Slider</span>\n </ion-nav-title>\n
        <ion-content scroll="false">\n
            <ion-slide-box show-pager="true">\n
                <ion-slide ng-repeat="i in [1,2,3,4,5]">\n
                    <div class="list card">\n
                        <div class="item item-image">\n <img ng-src="http://lorempixel.com/300/200/nature?v={{i}}">\n </div>\n
                        <div class="item item-body">\n
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>\n </div>\n </div>\n </ion-slide>\n </ion-slide-box>\n </ion-content>\n</ion-view>\n'),n.put("views/app/layouts/tinder-cards.html",'
    <ion-view class="tinder-cards-view">\n
        <ion-nav-title>\n <span>Tinder Cards</span>\n </ion-nav-title>\n
        <ion-content scroll="false">\n
            <td-cards>\n
                <td-card id="td-card" ng-repeat="card in cards" \n on-transition-left="transitionLeft(card)" \n on-transition-right="transitionRight(card)" \n on-transition-out="transitionOut(card)" \n on-destroy="cardDestroyed($index)" \n on-swipe-left="cardSwipedLeft($index)" \n on-swipe-right="cardSwipedRight($index)" \n on-partial-swipe="cardPartialSwipe(amt)">\n
                    <div class="image">\n
                        <div class="no-text overlayBox">\n
                            <div class="noBox boxed">\n Nope\n </div>\n </div>\n <img ng-src="{{card.image}}">\n
                        <div class="yes-text overlayBox">\n
                            <div class="yesBox boxed">\n Yes\n </div>\n </div>\n </div>\n
                    <div class="title">\n {{card.name}}\n </div>\n </td-card>\n </td-cards>\n </ion-content>\n</ion-view>\n'),n.put("views/app/miscellaneous/image-picker.html",'
    <ion-view class="image-picker-view">\n
        <ion-nav-title>\n <span>Image picker</span>\n </ion-nav-title>\n
        <ion-content class="padding">\n
            <button class="button button-block button-dark" ng-click="selImages()">\n Select Images\n </button>\n
            <button ng-show="images.length > 0" class="button button-block button-stable" ng-click="shareAll()">\n Share All\n </button>\n
            <div class="list card" ng-repeat="img in images">\n
                <div class="item item-image">\n <img ng-src="{{img}}">\n </div>\n
                <div class="item tabs tabs-secondary tabs-icon-left">\n <a class="tab-item image-option" href="#" ng-click="shareImage(img)">\n          <i class="icon ion-share"></i>\n          Share\n        </a>\n <a class="tab-item assertive image-option" href="#" ng-click="removeImage(img)">\n          <i class="icon ion-trash-a assertive"></i>\n          Remove\n        </a>\n </div>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/app/miscellaneous/maps.html",'
    <ion-view class="maps-view">\n
        <ion-nav-title>\n <span>Maps</span>\n </ion-nav-title>\n
        <ion-content scroll="false">\n
            <div class="mapWrap" data-tap-disabled="true">\n
                <div class="row center-map-action">\n
                    <div class="col">\n
                        <div class="list">\n
                            <div class="item item-input-inset">\n
                                <a class="button button-icon icon ion-pinpoint" ng-click="centerOnMe()"></a>\n
                                <label class="item-input-wrapper">\n
                                    <input type="text" placeholder="My Location" disabled ng-model="my_location">\n </label>\n </div>\n </div>\n </div>\n </div>\n
                <map center="{{center_position.lat}},{{center_position.lng}}" zoom="15">\n
                    <marker\n position="{{current_position.lat}},{{current_position.lng}}" \n title="Hello Marker" \n visible="true">\n </marker>\n
                        <info-window id="1" position="{{info_position.lat}},{{info_position.lng}}" visible="true">\n
                            <div ng-non-bindable="">\n <b>The best restaurant</b>
                                <br>\n This is html so you can put whatever
                                <br>\n you want such as images and <a href="">links</a>
                                <br>\n <img style=" border-radius: 24px;" src="http://lorempixel.com/50/50/food/?v=1"></img>\n <img style=" border-radius: 24px;" src="http://lorempixel.com/50/50/food/?v=2"></img>\n <img style=" border-radius: 24px;" src="http://lorempixel.com/50/50/food/?v=3"></img>\n </div>\n </info-window>\n </map>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/app/miscellaneous/miscellaneous.html",'
    <ion-view class="miscellaneous-view">\n
        <ion-nav-buttons side="left">\n
            <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>\n </ion-nav-buttons>\n
        <ion-nav-title>\n <span>Miscellaneous</span>\n </ion-nav-title>\n
        <ion-content>\n
            <div class="list miscellaneous-functionalities">\n
                <div dynamic-anchor-fix>\n <a class="item item-icon-left item-icon-right" href="http://www.ionicthemes.com">\n          <i class="icon ion-ios-browsers-outline"></i>\n          <div>\n            <span class="title">In App Browser</span>\n            <p class="description">Show web browser view with external links</p>\n          </div>\n          <i class="icon ion-arrow-right-c"></i>\n        </a>\n </div>\n <a class="item item-icon-left item-icon-right" ui-sref="app.maps">\n        <i class="icon ion-map"></i>\n        <div>\n          <span class="title">Maps & GeoLocation</span>\n          <p class="description">Show map & access user\'s current location</p>\n        </div>\n        <i class="icon ion-arrow-right-c"></i>\n      </a>\n <a class="item item-icon-left item-icon-right" ui-sref="app.image-picker">\n        <i class="icon ion-images"></i>\n        <div>\n          <span class="title">Image Picker</span>\n          <p class="description">Select and share images from your phone</p>\n        </div>\n        <i class="icon ion-arrow-right-c"></i>\n      </a>\n <a class="item item-icon-left item-icon-right" href="#" ng-controller="AdsCtrl" ng-click="manageAdMob()">\n        <i class="icon ion-social-usd-outline"></i>\n        <div>\n          <span class="title">AdMob</span>\n          <p class="description">Show Google AdMob mobile ads</p>\n        </div>\n      </a>\n <a class="item item-icon-left item-icon-right" href="#" ng-controller="AdsCtrl" ng-click="manageiAd()">\n        <i class="icon ion-social-usd-outline"></i>\n        <div>\n          <span class="title">iAd</span>\n          <p class="description">Show Apple iAd mobile ads</p>\n        </div>\n      </a>\n <a class="item item-icon-left item-icon-right" href="#" ng-controller="RateApp" ng-click="rateApp()">\n        <i class="icon ion-ios-star-half"></i>\n        <div>\n          <span class="title">Rate the app</span>\n          <p class="description">Rate this app in Google and Apple stores</p>\n        </div>\n      </a>\n <a class="item item-icon-left item-icon-right" href="#" ng-controller="SendMailCtrl" ng-click="sendMail()">\n        <i class="icon ion-email"></i>\n        <div>\n          <span class="title">Send email</span>\n          <p class="description">Access your phone native email sender provider</p>\n        </div>\n      </a>\n </div>\n </ion-content>\n</ion-view>\n'),n.put("views/app/wordpress/wordpress.html",'
    <ion-view class="wordpress-view">\n
        <ion-nav-buttons side="left">\n
            <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>\n </ion-nav-buttons>\n
        <ion-nav-title>\n <span>WordPress</span>\n </ion-nav-title>\n
        <ion-content>\n
            <!-- Refresh to get the new posts -->\n
            <ion-refresher pulling-text="Pull to refresh..." on-refresh="doRefresh()">\n </ion-refresher>\n\n
            <div class="posts-list">\n
                <div ng-repeat="post in posts" class="list card post-item">\n
                    <div class="post-heading item item-text-wrap">\n
                        <h2 class="post-title" ng-bind-html="post.title | rawHtml"></h2>\n
                        <p class="post-author">\n By <span>{{post.author.nickname}}</span> <span am-time-ago="post.date"></span>\n </p>\n </div>\n
                    <div class="post-content item item-text-wrap" post-content>\n
                        <p class="post-excerpt" dynamic-anchor-fix ng-bind-html="post.content | rawHtml"></p>\n
                        <div class="post-actions row">\n
                            <div class="actions col col-center col-66">\n
                                <a class="button button-icon icon ion-bookmark" ng-click="bookmarkPost(post)"></a>\n </div>\n
                            <div class="read-more col col-center col-33">\n <a ui-sref="app.post({postId: post.id})" class="button button-small button-block button-assertive">\n                Read more\n              </a>\n </div>\n </div>\n </div>\n </div>\n </div>\n\n
            <!-- Infinit scroll -->\n
            <ion-infinite-scroll ng-if="moreDataCanBeLoaded()" on-infinite="loadMoreData()" distance="1%" icon="ion-loading-c">\n </ion-infinite-scroll>\n </ion-content>\n</ion-view>\n'),n.put("views/app/wordpress/wordpress_post.html",'
    <ion-view class="post-view">\n
        <ion-content>\n
            <div class="post-heading item item-text-wrap">\n
                <h1 class="post-title">{{post.title}}</h1>\n
                <p class="post-author">\n By <span>{{post.author.nickname}}</span> <span am-time-ago="post.date"></span>\n </p>\n </div>\n
            <div class="post-content item item-text-wrap" post-content>\n
                <p class="post-text" dynamic-anchor-fix ng-bind-html="post.content | rawHtml"></p>\n </div>\n
            <div class="post-tags item item-text-wrap">\n <span class="post-tag button button-small button-outline button-stable" ng-repeat="category in post.categories">{{category.title}}</span>\n </div>\n </ion-content>\n
        <ion-footer-bar class="post-footer bar bar-footer bar-dark">\n
            <div class="row">\n
                <div class="col col-20 col-center">\n <a class="button button-icon icon icon-right ion-plus" bigger-text=".post-view .post-text">A</a>\n </div>\n
                <div class="col col-20 col-center">\n <a class="button button-icon icon icon-right ion-minus" smaller-text=".post-view .post-text">A</a>\n </div>\n
                <div class="col col-20 col-offset-20 col-center">\n
                    <a class="button button-icon icon ion-heart"></a>\n </div>\n
                <div class="col col-20 col-center">\n
                    <a class="button button-icon icon ion-android-share-alt" ng-click="sharePost(post.url)"></a>\n </div>\n </div>\n </ion-footer-bar>\n</ion-view>\n')}]),angular.module("your_app_name.config",[]).constant("WORDPRESS_API_URL","https://wordpress.startapplabs.com/blog/api/").constant("GCM_SENDER_ID","574597432927");