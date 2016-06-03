angular.module('sakaryarehberi')

.controller('AuthCtrl', function (Session, $location) {
    if (Session.isAuthenticated())
        $location.path("app/home");
})

// APP
.controller('AppCtrl', function ($scope, $rootScope, $ls, AuthService, Session, AUTH_EVENTS) {

    function getData() {
        $scope.isLogged = Session.isAuthenticated();

        if ($scope.isLogged) {
            var user = Session.User;
            $scope.profileImg = user.profileImageURL;
            $scope.nick = user.name;
            $scope.id = user.id;
            $scope.commentCount = user.commentCount;
            $scope.likeCount = user.likeCount;
        }
    }
    getData();
    $rootScope.$on(AUTH_EVENTS.sessionChanged, function (conf, data) {
        getData();
    });
    $scope.logout = function () {
        AuthService.logout();

    }
})
 .controller('ProfileCtrl', function ($scope, Resource, User, Resource, $ls, $state, $stateParams, $rootScope, AuthService, Session, AUTH_EVENTS) {
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
             type_name: data.TypeName,
             commentCount: data.CommentCount,
             likeCount: data.LikeCount
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
     $scope.changePicture = function () {
         Resource.GetImage(0).then(function (res) {
             $scope.profileImg = res.Url;
             Resource.Upload(res).then(function (data) {
      

             }, function (err) {
                 console.log(err);
             },
             function (progress) {
                 if (progress >= 99)
                     swal({ title: "Başarılı", text: "Profil Resiminiz Başarıyla Değiştirildi.", type: "success", confirmButtonText: "Tamam" });
             })
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

.controller('HomeCtrl', function (Session, $rootScope, AUTH_EVENTS, $ionicModal, User, $ionicSlideBoxDelegate, $scope, CurrentLocation, $location, $sce, $state, Location, $ionicLoading, $ls, $rootScope, $stateParams, $ls, $timeout) {


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
                    Session.User.likeCount--;
                    $ls.setObject("SessionData", Session.User);
                    $rootScope.$broadcast(AUTH_EVENTS.sessionChanged, Session.User);


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
                    Session.User.likeCount++;
                    $ls.setObject("SessionData", Session.User);
                    $rootScope.$broadcast(AUTH_EVENTS.sessionChanged, Session.User);
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
        console.log()
        $scope.comment.UserId = Session.User.id;
        $scope.comment.LocationId = $scope.location.ID;

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
            Session.User.commentCount++;
            $ls.setObject("SessionData", Session.User);
            $rootScope.$broadcast(AUTH_EVENTS.sessionChanged, Session.User);

        });
    }
    $scope.close = function () {
        $scope.modal.remove();
    }

    $scope.refresh = function () {

        $scope.locations = [];
        $scope.locationTypes = [];
        $scope.comment = {};
        $scope.model = [];

        Location.GetSearchLocation().then(function (data) {
            angular.forEach(data.data, function (value, key) {
                var loc = { name: value.Name, type: value.TypeName, id: value.ID };
                $scope.model.push(loc);
            });

        });
        Location.GetLocationTypes().then(function (data) {
            $scope.locationTypes = data.data;

        }, function (error) {
            console.log(error);
        });
        $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Konumunuz Aranıyor.' });

        CurrentLocation.get(function (Coord) {
            console.log(Coord);
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

    $scope.selectChange = function (locationId) {
        $state.go("app.details", { locationId: locationId });
        $scope.selected = "";

    }
    $scope.refresh();

})
.controller('DetailCtrl', function (Session, User, AUTH_EVENTS, $ionicModal, $scope, $ionicModal, $ionicSlideBoxDelegate, CurrentLocation, $location, $sce, $state, Location, $ionicLoading, $ls, $rootScope, $stateParams, $ls, $timeout) {

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
                    Session.User.likeCount++;
                    $ls.setObject("SessionData", Session.User);
                    $rootScope.$broadcast(AUTH_EVENTS.sessionChanged, Session.User);
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
                    Session.User.likeCount--;
                    $ls.setObject("SessionData", Session.User);
                    $rootScope.$broadcast(AUTH_EVENTS.sessionChanged, Session.User);

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
        console.log("33");
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
            Session.User.commentCount++;
            $ls.setObject("SessionData", Session.User);
            $rootScope.$broadcast(AUTH_EVENTS.sessionChanged, Session.User);
        });
    }
    $scope.isVisible = Session.isAuthenticated();

})
.controller('DirectionCtrl', function ($scope, $ionicLoading, $ionicModal, CurrentLocation, $timeout) {

    $scope.latitude = $scope.location.Latitude,
    $scope.longitude = $scope.location.Longtitude

    $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner><br/>Yol Tarifi getiriliyor.!' })


    $scope.$on('mapInitialized', function (event, map) {
        $scope.map = map;
        $scope.getDirections("car");
    });

    $scope.getDirections = function (type) {
        CurrentLocation.get(function (Coord) {
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
.controller('UserCommentsCtrl', function ($scope, $rootScope, AUTH_EVENTS, User, $ls, Session) {

    $scope.user = Session.User;

    User.GetUserComments($scope.user.id).then(function (data) {
        $scope.comments = data;
        Session.User.commentCount = data.length;
        $ls.setObject("SessionData", Session.User);
        $rootScope.$broadcast(AUTH_EVENTS.sessionChanged, Session.User);
    });
})
.controller('UserLikesCtrl', function ($scope, $rootScope, AUTH_EVENTS, $ls, User, Session) {

    $scope.user = Session.User;

    User.GetUserLikes($scope.user.id).then(function (data) {
        $scope.likes = data;
        Session.User.likeCount = data.length;
        $ls.setObject("SessionData", Session.User);
        $rootScope.$broadcast(AUTH_EVENTS.sessionChanged, Session.User);
    });
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