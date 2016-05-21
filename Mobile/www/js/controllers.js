angular.module('sakaryarehberi')

.controller('AuthCtrl', function (Session,$location) {
    if (Session.isAuthenticated())
        $location.path("app/home");
})

// APP
.controller('AppCtrl', function ($scope, $rootScope, AuthService, Session) {
    if (Session.isAuthenticated()) {
        $scope.profileImg = Session.User.profileImageURL;
        $scope.nick = Session.User.name;
    }
   
 
})

//LOGIN
.controller('LoginCtrl', function ($scope, $rootScope,Session,$location, md5, User, AuthService) {

    if (Session.isAuthenticated())
        $location.path("app/home");


    $scope.user = {
        email: "erdidursun09@hotmail.com",
        password: "12345"
    };
    $scope.doLogIn = function () {
        User.Login($scope.user.email, md5.createHash($scope.user.password));
    }
    $scope.socialLogin = function (provider) {
        AuthService.socialLogin(provider);
    };
})
.controller('SignupCtrl', function ($scope, User) {
    $scope.rpass = "";
    $scope.user = {
        UserType_ID: 1
    };

    $scope.doSignUp = function () {
        var user = angular.copy($scope.user);
        User.Register(user);
    };
})

.controller('ForgotPasswordCtrl', function ($scope, $state) {
    $scope.recoverPassword = function () {
        $state.go('app.feeds-categories');
    };

    $scope.user = {};
})

.controller('HomeCtrl', function (Session,$ionicSlideBoxDelegate, $scope, CurrrentLocation, $location, $sce, $state, Location, $ionicLoading, $ls, $rootScope, $stateParams, $ls, $timeout) {

    
    $scope.like = function () {
        alert("xd");
    };
        $scope.locations = [];
        $scope.locationTypes = [];
        Location.GetLocationTypes().then(function (data) {
            $scope.locationTypes = data.data;

        }, function (error) {
            console.log(error);
        });
        $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Konumunuz Aranıyor.!' })

        CurrrentLocation.get(function (Coord) {
            console.log(Coord);
            Location.GetLocations(Coord).then(function (data) {
                console.log(data);
                $ionicLoading.hide();
                $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Mekanlar Yükleniyor.!' })

                angular.forEach(data.data, function (value, key) {
                    var loc = { name: value.Name, type: value.TypeName, id: value.ID };

                    if (value.DistanceToUser > 0) {
                        var t = (value.DistanceToUser / 1000);
                        value.DistanceToUser = t;
                        loc.DistanceToUser = t;
                    }
                    $scope.locations.push(value);

                });
                $ionicLoading.hide();

            }, function (error) {
                console.log(error);
            });
        }, function error(err) {
            console.log(err);
            Location.GetLocations().then(function (data) {
                angular.forEach(data.data, function (value, key) {
                    $scope.locations.push(value);
                    $ionicLoading.hide();
                    $scope.$broadcast("scroll.refreshComplete")
                });

            }, function (error) {
                $ionicLoading.hide();
                console.log(error);
            });

        });

    })
.controller('DetailCtrl', function (Session,$ionicModal , $scope, $ionicSlideBoxDelegate,CurrrentLocation, $location, $sce, $state, Location, $ionicLoading, $ls, $rootScope, $stateParams, $ls, $timeout) {

    $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Yükleniyor!' })
    var locationId = $stateParams.locationId;
    var slides = [];
    Location.GetLocationById(locationId).then(function (data) {
        $scope.location = data.data[0];

        angular.forEach($scope.location.Images, function (value) {
            slides.push({ image: value.Path, text: value.Info });
        });
        $scope.slides = slides;
        $ionicLoading.hide();
        $timeout(function () {
            $ionicSlideBoxDelegate.update();
        }, 50);
    })
    $scope.slides = [];
    $scope.comment = {};
    $scope.myInterval = 5000;

    $scope.open = function () {
        $ionicModal.fromTemplateUrl('views/app/locations/directions.html', {
            scope: $scope,
            animation: 'slide-in-left'
         
        }).then(function (modal) {
       
            $scope.modal = modal;
            modal.show();
        });
    };

    $scope.like = function (location) {

    }
    $scope.isVisible = Session.isAuthenticated();
    $scope.sendComment = function () {
        $scope.comment.UserId = Session.User.id;
        $scope.comment.LocationId = $scope.location.ID;

        User.SendComment($scope.comment).then(function (data) {
            console.log(data);
            $state.go("home.locationDetails", { locationId: locationId }, { reload: true });
        });
    }
})
.controller('DirectionCtrl', function ($scope,$ionicLoading, CurrrentLocation, $timeout) {

    $scope.latitude= $scope.location.Latitude,
    $scope.longitude=$scope.location.Longtitude

    $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Yol Tarifi getiriliyor.!' })

   
    $scope.$on('mapInitialized', function (event, map) {
        $scope.map = map;
        $scope.getDirections("car");
    });

    $scope.getDirections = function (type) {
        CurrrentLocation.get(function (Coord) {
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();          
            $scope.showList = false;
           
            var request = {
                origin: new google.maps.LatLng(Coord.Latitude, Coord.Longtitude),
                destination: new google.maps.LatLng($scope.latitude, $scope.longitude),
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            if (type == 'car') {
                request.travelMode = google.maps.DirectionsTravelMode.DRIVING;
                $scope.filterDisplayName = "Araçla";
            }
            else if (type == 'bicyle') {
                request.travelMode = google.maps.DirectionsTravelMode.BICYCLING;
                $scope.filterDisplayName = "Bisikletle";

            }
            else if (type == 'walk') {
                request.travelMode = google.maps.DirectionsTravelMode.WALKING;
                $scope.filterDisplayName = "Yürüyerek";

            }
            $timeout(function () {
                console.log(request);
                directionsService.route(request, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        $scope.marker = {};
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setMap($scope.map);
                        directionsDisplay.setPanel(document.getElementById('directionsList'));
                        $scope.showList = true;
                        $ionicLoading.hide();
                    } else {
                        $scope.filterDisplayName = "Yol Tarifi"
                        $ionicLoading.hide();
                        swal({ title: "Rota Bulumamadı!", text: "Seçtiğiniz kriterlere uygun yol bulunamadı.!", type: "error", confirmButtonText: "Tamam" });
                    }
                });
            }, 1500);
        })

    };  
    })



























.controller('RateApp', function ($scope) {
    $scope.rateApp = function () {
        if (ionic.Platform.isIOS()) {
            //you need to set your own ios app id
            AppRate.preferences.storeAppURL.ios = '1234555553>';
            AppRate.promptForRating(true);
        } else if (ionic.Platform.isAndroid()) {
            //you need to set your own android app id
            AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
            AppRate.promptForRating(true);
        }
    };
})

.controller('SendMailCtrl', function ($scope) {
    $scope.sendMail = function () {
        cordova.plugins.email.isAvailable(
			function (isAvailable) {
			    // alert('Service is not available') unless isAvailable;
			    cordova.plugins.email.open({
			        to: 'envato@startapplabs.com',
			        cc: 'hello@startapplabs.com',
			        // bcc:     ['john@doe.com', 'jane@doe.com'],
			        subject: 'Greetings',
			        body: 'How are you? Nice greetings from IonFullApp'
			    });
			}
		);
    };
})

.controller('MapsCtrl', function ($scope, $ionicLoading) {

    $scope.info_position = {
        lat: 43.07493,
        lng: -89.381388
    };

    $scope.center_position = {
        lat: 43.07493,
        lng: -89.381388
    };

    $scope.my_location = "";

    $scope.$on('mapInitialized', function (event, map) {
        $scope.map = map;
    });

    $scope.centerOnMe = function () {

        $scope.positions = [];

        $ionicLoading.show({
            template: 'Loading...'
        });

        // with this function you can get the user’s current position
        // we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.current_position = { lat: pos.G, lng: pos.K };
            $scope.my_location = pos.G + ", " + pos.K;
            $scope.map.setCenter(pos);
            $ionicLoading.hide();
        });
    };
})

.controller('AdsCtrl', function ($scope, $ionicActionSheet, AdMob, iAd) {

    $scope.manageAdMob = function () {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            //Here you can add some more buttons
            buttons: [
				{ text: 'Show Banner' },
				{ text: 'Show Interstitial' }
            ],
            destructiveText: 'Remove Ads',
            titleText: 'Choose the ad to show',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            destructiveButtonClicked: function () {
                console.log("removing ads");
                AdMob.removeAds();
                return true;
            },
            buttonClicked: function (index, button) {
                if (button.text == 'Show Banner') {
                    console.log("show banner");
                    AdMob.showBanner();
                }

                if (button.text == 'Show Interstitial') {
                    console.log("show interstitial");
                    AdMob.showInterstitial();
                }

                return true;
            }
        });
    };

    $scope.manageiAd = function () {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            //Here you can add some more buttons
            buttons: [
			{ text: 'Show iAd Banner' },
			{ text: 'Show iAd Interstitial' }
            ],
            destructiveText: 'Remove Ads',
            titleText: 'Choose the ad to show - Interstitial only works in iPad',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            destructiveButtonClicked: function () {
                console.log("removing ads");
                iAd.removeAds();
                return true;
            },
            buttonClicked: function (index, button) {
                if (button.text == 'Show iAd Banner') {
                    console.log("show iAd banner");
                    iAd.showBanner();
                }
                if (button.text == 'Show iAd Interstitial') {
                    console.log("show iAd interstitial");
                    iAd.showInterstitial();
                }
                return true;
            }
        });
    };
})

// FEED
//brings all feed categories
.controller('FeedsCategoriesCtrl', function ($scope, $http) {
    $scope.feeds_categories = [];

    $http.get('feeds-categories.json').success(function (response) {
        $scope.feeds_categories = response;
    });
})

//bring specific category providers
.controller('CategoryFeedsCtrl', function ($scope, $http, $stateParams) {
    $scope.category_sources = [];

    $scope.categoryId = $stateParams.categoryId;

    $http.get('feeds-categories.json').success(function (response) {
        var category = _.find(response, { id: $scope.categoryId });
        $scope.categoryTitle = category.title;
        $scope.category_sources = category.feed_sources;
    });
})

//this method brings posts for a source provider
.controller('FeedEntriesCtrl', function ($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService) {
    $scope.feed = [];

    var categoryId = $stateParams.categoryId,
			sourceId = $stateParams.sourceId;

    $scope.doRefresh = function () {

        $http.get('feeds-categories.json').success(function (response) {

            $ionicLoading.show({
                template: 'Loading entries...'
            });

            var category = _.find(response, { id: categoryId }),
					source = _.find(category.feed_sources, { id: sourceId });

            $scope.sourceTitle = source.title;

            FeedList.get(source.url)
			.then(function (result) {
			    $scope.feed = result.feed;
			    $ionicLoading.hide();
			    $scope.$broadcast('scroll.refreshComplete');
			}, function (reason) {
			    $ionicLoading.hide();
			    $scope.$broadcast('scroll.refreshComplete');
			});
        });
    };

    $scope.doRefresh();

    $scope.bookmarkPost = function (post) {
        $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
        BookMarkService.bookmarkFeedPost(post);
    };
})

// SETTINGS
.controller('SettingsCtrl', function ($scope, $rootScope,AuthService, AUTH_EVENTS, $ionicActionSheet, $state) {
    $scope.airplaneMode = true;
    $scope.wifi = false;
    $scope.bluetooth = true;
    $scope.personalHotspot = true;

    $scope.checkOpt1 = true;
    $scope.checkOpt2 = true;
    $scope.checkOpt3 = false;

    $scope.radioChoice = 'B';

    $scope.logout = function () {
        AuthService.logout();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, null);
    }
    // Triggered on a the logOut button click
    $scope.showLogOutMenu = function () {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            //Here you can add some more buttons
            // buttons: [
            // { text: '<b>Share</b> This' },
            // { text: 'Move' }
            // ],
            destructiveText: 'Logout',
            titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                //Called when one of the non-destructive buttons is clicked,
                //with the index of the button that was clicked and the button object.
                //Return true to close the action sheet, or false to keep it opened.
                return true;
            },
            destructiveButtonClicked: function () {
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                $state.go('auth.walkthrough');
            }
        });

    };
})

// TINDER CARDS
.controller('TinderCardsCtrl', function ($scope, $http) {

    $scope.cards = [];


    $scope.addCard = function (img, name) {
        var newCard = { image: img, name: name };
        newCard.id = Math.random();
        $scope.cards.unshift(angular.extend({}, newCard));
    };

    $scope.addCards = function (count) {
        $http.get('http://api.randomuser.me/?results=' + count).then(function (value) {
            angular.forEach(value.data.results, function (v) {
                $scope.addCard(v.user.picture.large, v.user.name.first + " " + v.user.name.last);
            });
        });
    };

    $scope.addFirstCards = function () {
        $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png", "Nope");
        $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
    };

    $scope.addFirstCards();
    $scope.addCards(5);

    $scope.cardDestroyed = function (index) {
        $scope.cards.splice(index, 1);
        $scope.addCards(1);
    };

    $scope.transitionOut = function (card) {
        console.log('card transition out');
    };

    $scope.transitionRight = function (card) {
        console.log('card removed to the right');
        console.log(card);
    };

    $scope.transitionLeft = function (card) {
        console.log('card removed to the left');
        console.log(card);
    };
})


// BOOKMARKS
.controller('BookMarksCtrl', function ($scope, $rootScope, BookMarkService, $state) {

    $scope.bookmarks = BookMarkService.getBookmarks();

    // When a new post is bookmarked, we should update bookmarks list
    $rootScope.$on("new-bookmark", function (event) {
        $scope.bookmarks = BookMarkService.getBookmarks();
    });

    $scope.goToFeedPost = function (link) {
        window.open(link, '_blank', 'location=yes');
    };
    $scope.goToWordpressPost = function (postId) {
        $state.go('app.post', { postId: postId });
    };
})

// WORDPRESS
.controller('WordpressCtrl', function ($scope, $http, $ionicLoading, PostService, BookMarkService) {
    $scope.posts = [];
    $scope.page = 1;
    $scope.totalPages = 1;

    $scope.doRefresh = function () {
        $ionicLoading.show({
            template: 'Loading posts...'
        });

        //Always bring me the latest posts => page=1
        PostService.getRecentPosts(1)
		.then(function (data) {
		    $scope.totalPages = data.pages;
		    $scope.posts = PostService.shortenPosts(data.posts);

		    $ionicLoading.hide();
		    $scope.$broadcast('scroll.refreshComplete');
		});
    };

    $scope.loadMoreData = function () {
        $scope.page += 1;

        PostService.getRecentPosts($scope.page)
		.then(function (data) {
		    //We will update this value in every request because new posts can be created
		    $scope.totalPages = data.pages;
		    var new_posts = PostService.shortenPosts(data.posts);
		    $scope.posts = $scope.posts.concat(new_posts);

		    $scope.$broadcast('scroll.infiniteScrollComplete');
		});
    };

    $scope.moreDataCanBeLoaded = function () {
        return $scope.totalPages > $scope.page;
    };

    $scope.bookmarkPost = function (post) {
        $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
        BookMarkService.bookmarkWordpressPost(post);
    };

    $scope.doRefresh();
})

// WORDPRESS POST
.controller('WordpressPostCtrl', function ($scope, post_data, $ionicLoading) {

    $scope.post = post_data.post;
    $ionicLoading.hide();

    $scope.sharePost = function (link) {
        window.plugins.socialsharing.share('Check this post here: ', null, null, link);
    };
})


.controller('ImagePickerCtrl', function ($scope, $rootScope, $cordovaCamera) {

    $scope.images = [];

    $scope.selImages = function () {

        window.imagePicker.getPictures(
			function (results) {
			    for (var i = 0; i < results.length; i++) {
			        console.log('Image URI: ' + results[i]);
			        $scope.images.push(results[i]);
			    }
			    if (!$scope.$$phase) {
			        $scope.$apply();
			    }
			}, function (error) {
			    console.log('Error: ' + error);
			}
		);
    };

    $scope.removeImage = function (image) {
        $scope.images = _.without($scope.images, image);
    };

    $scope.shareImage = function (image) {
        window.plugins.socialsharing.share(null, null, image);
    };

    $scope.shareAll = function () {
        window.plugins.socialsharing.share(null, null, $scope.images);
    };
})

;
