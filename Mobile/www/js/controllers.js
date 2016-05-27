angular.module('sakaryarehberi')

.controller('AuthCtrl', function (Session, $location) {
    if (Session.isAuthenticated())
        $location.path("app/home");
})

// APP
.controller('AppCtrl', function ($scope, $rootScope,$ls, AuthService, Session, AUTH_EVENTS) {
    $scope.isLogged = Session.isAuthenticated();
    if ($scope.isLogged) {
        $scope.profileImg = Session.User.profileImageURL;
        $scope.nick = Session.User.name;
        $scope.id = Session.User.id;
    }
    $rootScope.$on(AUTH_EVENTS.sessionChanged, function (conf, data) {
        $scope.isLogged = Session.isAuthenticated();
        if ($scope.isLogged) {
            $scope.profileImg = Session.User.profileImageURL;
            $scope.nick = Session.User.name;
            $scope.id = Session.User.id;
        }
    });
})
 .controller('ProfileCtrl', function ($scope, User, $ls, $state, $stateParams, $rootScope, AuthService, Session, AUTH_EVENTS) {
     $scope.isSelf = false;
     var userId = $stateParams.userId;
     if (Session.isAuthenticated() && userId == Session.User.id)
         $scope.isSelf = true;
     else
         $scope.isSelf = false;
     function changeSession(data) {
         Session.User = {
             loginType: Session.loginType,
             id: data.ID,
             name: data.Name,
             profileImageURL: data.ImgPath,
             type_id: data.Type_ID,
             type_name: data.TypeName
         };
         $ls.setObject("SessionData", Session.User);
         $rootScope.$broadcast(AUTH_EVENTS.sessionChanged, Session.User);

     }
     User.GetUserById(userId).then(function (data) {
         $scope.user = data;
         console.log($scope.user);
         $scope.profileImg = $scope.user.ImgPath;
         $scope.nick = $scope.user.Name;

     });
     $scope.changeInfo = function () {
         User.ChangeInfo(userId, $scope.user.Name, $scope.user.Email).then(function (data) {
             changeSession(data.data[0]);
             swal({ title: "Başarılı", text: "Bilgileriniz Başarıyla Değiştirildi.", type: "success", confirmButtonText: "Tamam" });

         });
     }


 })
//LOGIN
.controller('LoginCtrl', function ($scope, $rootScope, Session, $location, md5, User, AuthService) {

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

.controller('HomeCtrl', function (Session, $rootScope, $ionicModal, User, $ionicSlideBoxDelegate, $scope, CurrrentLocation, $location, $sce, $state, Location, $ionicLoading, $ls, $rootScope, $stateParams, $ls, $timeout) {


    $scope.isLogged = Session.isAuthenticated();


    $scope.unlike = function (locationId) {
        if (!Session.isAuthenticated()) {
            swal({ title: "Giriş Yapmalısınız", text: "", type: "error", confirmButtonText: "Tamam" });
        }
        else {
            Location.UnLike(locationId, Session.User.id).then(function (data) {
                if (data.status == 200) {
                    for (var i = 0; i < $scope.locations.length; i++) {
                        if ($scope.locations[i].ID == locationId) {
                            $scope.locations[i].LikeCount--;
                            $scope.locations[i].IsLiked = false;
                            break;
                        }

                    }
                }
            });
        }


    }
    $scope.like = function (locationId) {
        if (!Session.isAuthenticated()) {
            swal({ title: "Giriş Yapmalısınız", text: "Beğenmek için giriş yapın.!", type: "error", confirmButtonText: "Tamam" });

        }
        else {
            Location.Like(locationId, Session.User.id).then(function (data) {
                if (data.status == 200) {
                    for (var i = 0; i < $scope.locations.length; i++) {
                        if ($scope.locations[i].ID == locationId) {
                            $scope.locations[i].LikeCount++;
                            $scope.locations[i].IsLiked = true;
                            break;
                        }

                    }
                }
            });
        }


    };

    $scope.openComment = function (index) {
        $scope.selectedIndex = index;
        $scope.location = $scope.locations[index];
        console.log()
        $ionicModal.fromTemplateUrl('views/app/locations/comments.html', {
            scope: $scope,
            animation: 'slide-in-left'

        }).then(function (modal) {

            $scope.modal = modal;
            modal.show();
        });
    };

    $scope.open = function (index) {
        $scope.location = $scope.locations[index];

        $ionicModal.fromTemplateUrl('views/app/locations/directions.html', {
            scope: $scope,
            animation: 'slide-in-left'

        }).then(function (modal) {

            $scope.modal = modal;
            modal.show();
        });
    };
    $scope.sendComment = function () {
        $scope.comment.UserId = Session.User.id;
        $scope.comment.LocationId = $scope.selectedLocation.ID;

        User.SendComment($scope.comment).then(function (data) {
            var newComment = {
                Comment: data.data.UserComment_Comment,
                Date: data.data.UserComment_Date,
                UserImgPath: Session.User.profileImageURL,
                UserName: Session.User.name
            }
            //$scope.selectedLocation.Comments.push(newComment);
            $scope.locations[$scope.selectedIndex].Comments.push(newComment);
            $scope.comment.Comment = "";
        });
    }
    $scope.close = function () {
        $scope.modal.remove();
    }
    $scope.refresh = function () {

        $scope.locations = [];
        $scope.locationTypes = [];
        $scope.comment = {};
        Location.GetLocationTypes().then(function (data) {
            $scope.locationTypes = data.data;

        }, function (error) {
            console.log(error);
        });
        $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Konumunuz Aranıyor.' });

        CurrrentLocation.get(function (Coord) {
            $ionicLoading.hide();
            $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Mekanlar Yükleniyor.' });

            Location.GetLocations(Coord).then(function (data) {
                $ionicLoading.hide();
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
                $scope.$broadcast('scroll.refreshComplete');


            }, function (error) {
                console.log(error);
                $scope.$broadcast('scroll.refreshComplete');

            });
        }, function error(err) {
            $ionicLoading.hide();
            $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Mekanlar Yükleniyor.' })

            Location.GetLocations().then(function (data) {
                angular.forEach(data.data, function (value, key) {
                    $scope.locations.push(value);
                    $ionicLoading.hide();
                    $scope.$broadcast("scroll.refreshComplete")
                });

            }, function (error) {
                $ionicLoading.hide();
                console.log(error);
                $scope.$broadcast('scroll.refreshComplete');

            });

        });
    }

    //$rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
    //    if (toState.name.indexOf('app.home') > -1) {
    //        console.log(fromState);

    //        // Restore platform default transition. We are just hardcoding android transitions to auth views.
    //        $scope.refresh();


    //    }

    //});
    $scope.refresh();

})
.controller('DetailCtrl', function (Session, User, $ionicModal, $scope, $ionicModal, $ionicSlideBoxDelegate, CurrrentLocation, $location, $sce, $state, Location, $ionicLoading, $ls, $rootScope, $stateParams, $ls, $timeout) {

    $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Yükleniyor!' })
    var locationId = $stateParams.locationId;
    var slides = [];
    Location.GetLocationById(locationId).then(function (data) {
        $scope.location = data.data[0];
        console.log($scope.location.IsLiked)
        angular.forEach($scope.location.Images, function (value) {
            slides.push({ image: value.Path, text: value.Info });
        });
        $scope.slides = slides;
        $ionicLoading.hide();
        $timeout(function () {
            $ionicSlideBoxDelegate.update();
        }, 50);
    });
    $scope.like = function (locationId) {
        if (!Session.isAuthenticated())
            swal({ title: "Giriş Yapmalısınız", text: "Beğenmek için giriş yapın.!", type: "error", confirmButtonText: "Cool" });
        else {
            Location.Like(locationId, Session.User.id).then(function (data) {
                if (data.status == 200) {
                    $scope.location.LikeCount++;
                    $scope.location.IsLiked = true;
                }
            });
        }

    };
    $scope.unlike = function (locationId) {
        if (!Session.isAuthenticated()) {
            swal({ title: "Giriş Yapmalısınız", text: "", type: "error", confirmButtonText: "Tamam" });
        }
        else {
            Location.UnLike(locationId, Session.User.id).then(function (data) {
                if (data.status == 200) {
                    $scope.location.LikeCount--;
                    $scope.location.IsLiked = false;


                }
            }
            );
        }


    };
    $scope.isLogged = Session.isAuthenticated();

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
    $scope.close = function () {
        $scope.modal.remove();
    }
    $scope.sendComment = function () {
        $scope.comment.UserId = Session.User.id;
        $scope.comment.LocationId = $scope.location.ID;

        User.SendComment($scope.comment).then(function (data) {
            var newComment = {
                Comment: data.data.UserComment_Comment,
                Date: data.data.UserComment_Date,
                UserImgPath: Session.User.profileImageURL,
                UserName: Session.User.name
            }
            $scope.location.Comments.push(newComment);
            $scope.comment.Comment = "";
        });
    }
    $scope.isVisible = Session.isAuthenticated();

})
.controller('DirectionCtrl', function ($scope, $ionicLoading, $ionicModal, CurrrentLocation, $timeout) {

    $scope.latitude = $scope.location.Latitude,
    $scope.longitude = $scope.location.Longtitude

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
    $scope.close = function () {
        $scope.modal.close();
    }
})

.controller('SettingsCtrl', function ($scope, $rootScope, AuthService, AUTH_EVENTS, $ionicActionSheet, $state) {
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
            destructiveText: 'Çıkış Yap',
            titleText: 'Çıkış yapmak istediğinize emin misiniz?',
            cancelText: 'İptal',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {

            },
            destructiveButtonClicked: function () {
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                $state.go('auth.walkthrough');
            }
        });

    };
})
;