angular.module('sakaryarehberi')
.controller("MainCtrl", function () {
})
.controller("MapBtnCtrl", function ($scope, $rootScope) {
    $scope.filterDisplayName = "Araçla"

    $scope.getDirections = function (type) {
        $rootScope.$broadcast("directionTypeChanged", type);
        if (type == 'car')
            $scope.filterDisplayName = "Araçla";
        else if (type == 'bicyle')
            $scope.filterDisplayName = "Bisikletle";
        else if (type == 'walk')
            $scope.filterDisplayName = "Yürüyerek";
    }
})

.controller("MapCtrl", function ($scope, $rootScope, CurrentLocation, location, $modalInstance, uiGmapIsReady, $timeout) {

    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var geocoder = new google.maps.Geocoder();
    $scope.location = location;
    $scope.map = {
        control: {},
        events: {
        },
        options: {
            scrollwheel: false,
            disableDoubleClickZoom: true,
            fullscreenControl: true,
            tilt: 40,
        },
        center: {
            latitude: $scope.location.Latitude,
            longitude: $scope.location.Longtitude
        },
        zoom: 10
    };

    uiGmapIsReady.promise(1).then(function (instances) {
        instances.forEach(function (inst) {
            $scope.mapResult = inst.map;
            $scope.getDirections("car");
            return;
        });
    });
    $rootScope.$on("directionTypeChanged", function (conf, type) {
        $scope.getDirections(type);
    });
    $scope.getDirections = function (type) {
        CurrentLocation.get(function (loc) {
            $scope.currentLocation = loc;
            $rootScope.directions = {
                origin: new google.maps.LatLng($scope.currentLocation.Latitude, $scope.currentLocation.Longtitude),
                destination: new google.maps.LatLng($scope.location.Latitude, $scope.location.Longtitude),
                showList: false
            }
            var request = {
                origin: $rootScope.directions.origin,
                destination: $rootScope.directions.destination,
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
                        $rootScope.marker = {};
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setMap($scope.mapResult);
                        directionsDisplay.setPanel(document.getElementById('directionsList'));
                        $rootScope.directions.showList = true;
                    } else {
                        $scope.filterDisplayName = "Yol Tarifi"

                        swal({ title: "Rota Bulumamadı!", text: "Seçtiğiniz kriterlere uygun yol bulunmamaktadır.!", type: "error", confirmButtonText: "Cool" });
                    }
                });
            }, 500);
        })

    };

    $scope.close = function () {
        $modalInstance.close();
    };
})

.controller("LocationDetailCtrl", function ($scope,$filter, $sce, Session, $ocLazyLoad, User, $state, Location, $uibModal, $rootScope, $stateParams, uiGmapIsReady, $ls, uiGmapGoogleMapApi, $timeout) {

    var locationId = $stateParams.locationId;
    $scope.to_trusted = function (html_code) {
        //return $sce.trustAsHtml($filter("strLimit")(html_code, 500));
        return $sce.trustAsHtml(html_code);
    }
    Location.GetLocationById(locationId).then(function (data) {
        $scope.location = data.data[0];
        angular.forEach($scope.location.Images, function (value) {
            $scope.slides.push({ image: value.Path, text: value.Info });
        });
    })
    $scope.slides = [];


    $scope.comment = {



    };


    $scope.myInterval = 5000;

    $scope.open = function (location) {
        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/partials/map.html',
            animation: true,
            controller: "MapCtrl",
            resolve: {
                location: function () {
                    return { Latitude: location.Latitude, Longtitude: location.Longtitude, Name: location.Name };
                }
            },
            size: 'lg'
        });
    };

    $scope.isLogged = Session.isAuthenticated();
    $scope.unlike = function (locationId) {
        if (!Session.isAuthenticated()) {
            swal({ title: "Giriş Yapmalısınız", text: "Seçtiğiniz kriterlere uygun yol bulunmamaktadır.!", type: "error", confirmButtonText: "Cool" });
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


    }
    $scope.like = function (locationId) {
        if (!Session.isAuthenticated()) {
            swal({ title: "Giriş Yapmalısınız", text: "Beğenmek için giriş yapın.!", type: "error", confirmButtonText: "Cool" });

        }
        else {
            Location.Like(locationId, Session.User.id).then(function (data) {
                if (data.status == 200) {
                    $scope.location.LikeCount++;
                    $scope.location.IsLiked = true;
                }
            });
        }


    }
    $scope.isVisible = Session.isAuthenticated();


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


})
.controller("LocationsCtrl", function (Session, CurrentLocation, $scope, $location, $sce, $state, Location, $ocLazyLoad, $uibModal, $ls, $rootScope, $stateParams, uiGmapIsReady, $ls, uiGmapGoogleMapApi, $timeout) {

    $scope.model = [];

    $scope.locations = [];
    $scope.locationTypes = [];

    $scope.myPagingFunction = function () {

    }
    Location.GetSearchLocation().then(function (data) {
        angular.forEach(data.data, function (value, key) {
            var loc = { name: value.Name, type: value.TypeName, id: value.ID };
            $scope.model.push(loc);
        });

    });
    CurrentLocation.get(function (location) {
        Location.GetLocations(location).then(function (data) {
            angular.forEach(data.data, function (value, key) {


                if (value.DistanceToUser > 0) {
                    var t = (value.DistanceToUser / 1000);
                    value.DistanceToUser = t;

                }
                $scope.locations.push(value);

            });
            $ocLazyLoad.load({
                files: ['assets/pages/scripts/portfolio-1.min.js'],
                cache: false
            });

        }, function (error) {
        });
    }, function (error) {
        Location.GetLocations().then(function (data) {
            angular.forEach(data.data, function (value, key) {
                $scope.locations.push(value);
            });
            $ocLazyLoad.load({
                files: ['assets/pages/scripts/portfolio-1.min.js'],
                cache: false
            });

        }, function (error) {
        });
    });

    Location.GetLocationTypes().then(function (data) {
        $scope.locationTypes = data.data;

    }, function (error) {
    });
    var Coord = {
        Latitude: -1,
        Longtitude: -1
    };
    $scope.open = function (locationId) {
        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/partials/locationFull.html',
            animation: true,
            controller: "LocationDetailCtrl",
            size: 'lg',
            resolve: {
                locationId: function () {
                    return locationId;
                }
            }
        });
    };

    $scope.openComment = function (location) {

        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/partials/comments.html',
            animation: true,
            controller: "CommentModalCtrl",
            size: 'm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                location: function () {
                    return location;
                }
            }
        });
    };



    $scope.openMap = function (location) {
        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/partials/map.html',
            animation: true,
            controller: "MapCtrl",
            backdrop: 'static',
            keyboard: false,

            resolve: {
                location: function () {
                    return { Latitude: location.Latitude, Longtitude: location.Longtitude, Name: location.Name };
                }
            },
            size: 'lg'
        });
    };

    $scope.selectChange = function (locationId) {
        $state.go("home.locationDetails", { locationId: locationId });


    }
    $scope.isLogged = Session.isAuthenticated();
    $scope.unlike = function (locationId) {
        if (!Session.isAuthenticated()) {
            swal({ title: "Giriş Yapmalısınız", text: "Seçtiğiniz kriterlere uygun yol bulunmamaktadır.!", type: "error", confirmButtonText: "Cool" });
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


    }

})
.controller("HeaderCtrl", function ($scope, $state, $rootScope, AUTH_EVENTS, $uibModal, Session, AuthService) {
    $scope.isLogged = false;
    $scope.showAdminPanel = false;
    if (Session.isAuthenticated()) {
        $scope.isLogged = true;
        $scope.profileImg = Session.User.profileImageURL
        $scope.nick = Session.User.name;
        $scope.userID = Session.User.id;
        $scope.showAdminPanel = Session.isAdmin();
    }


    $scope.logout = function (provider) {
        $scope.isLogged = false;
        AuthService.logout();
    };

    //Location Detail 
    $scope.open = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'views/partials/logintemplate.html',
            controller: 'LoginCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sakaryarehberi',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/css/login.min.css',
                            "assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                            "assets/global/plugins/jquery-validation/js/additional-methods.js",
                            "assets/pages/scripts/login.min.js"
                        ]
                    });
                }]
            }

        });
    };
})
.controller("LoginCtrl", function ($scope, AuthService, md5, User, Session, $location) {

    $scope.mail = "erdidursun09@hotmail.com";
    $scope.pass = "12345";
    if (Session.isAuthenticated())
        $location.path("anasayfa")
    $scope.login = function () {

        User.Login($scope.mail, md5.createHash($scope.pass));
    };

    $scope.socialLogin = function (provider) {
        AuthService.socialLogin(provider);
    };


})
.controller("RegisterCtrl", function ($scope, $state, User) {

    $scope.master = "true";
    $scope.user = {
        UserType_ID: 1
    };

    $scope.register = function () {
        var user = angular.copy($scope.user);
        User.Register(user);
    };

})
.controller("MenuCtrl", function ($scope) {

})

.controller("LocationNewCtrl", function ($scope, $ls, $state, Location, FileUploader, $ocLazyLoad) {
    $scope.locationTypes = {};
    $scope.location = {}

    $(document).ready(function () {
        $('#summernote_1').summernote({ lang: "tr-TR", height: 300 })
    })


    Location.GetLocationTypes().then(function (data) {
        $scope.locationTypes = data.data;

    }, function (error) {
    });
    $scope.totalStep = 3;
    $scope.step = 1;
    $scope.uploader = new FileUploader();
    $scope.uploader2 = new FileUploader();
    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
    $scope.uploader2.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
    var location = $ls.getObject("Location");

    if (location) {
        $scope.step = $ls.get("Step");
        $scope.location = location;
        $scope.uploader2.url = Settings.apiHostUrl + "/api/Upload?locationID=" + $scope.location.ID + "&isBanner=true";
        $scope.uploader.url = Settings.apiHostUrl + "/api/Upload?locationID=" + $scope.location.ID;

    }
    $scope.width = ($scope.step / $scope.totalStep) * 100;

    $scope.$watch('step', function () {
        $scope.width = ($scope.step / $scope.totalStep) * 100;
    });
    $scope.addNewLocation = function () {
        $scope.location.Info = $('#summernote_1').code();
        Location.Add($scope.location).then(function (data) {
            $scope.location = data.data[0];
            $ls.setObject("Location", $scope.location);
            $ls.set("Step", 2);
            $scope.step = 2;
            var id = $scope.location.ID;
            $scope.uploader2.url = Settings.apiHostUrl + "/api/Upload?locationID=" + id + "&isBanner=true";
            $scope.uploader.url = Settings.apiHostUrl + "/api/Upload?locationID=" + id;

        });
    };
    $scope.uploader2.onCompleteAll = function (fileItem, response, status, headers) {
        $scope.step = 3;
        $ls.remove("Location");

        $ls.set("Step", $scope.step);

    };
    $scope.uploader.onCompleteAll = function (fileItem, response, status, headers) {

        swal({ title: "Başarılı", text: "Mekan Başarıyla Eklendi", type: "success", confirmButtonText: "Tamam" });
        $state.go("admin.locations", {}, { reload: true });

    };

})

.controller("AdminMainCtrl", function ($scope, Session, $state, Location, $timeout, User, $uibModal, $ocLazyLoad) {
    $scope.locations = {};
    $scope.users = {};
    $scope.userTypes = {};
    $scope.newTypeID = {};
    //$scope.userType = {};
    $scope.isLogged = false;
    $scope.user = {};
    var stateName = $state.current.name;

    $scope.user = {
        User_Name: "",
        User_Password: "",
        User_Email: ""
    };
    if (Session.isAdmin()) {
        $scope.isLogged = true;
        $ocLazyLoad.load({
            name: 'sakaryarehberi',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
                'assets/layouts/layout2/css/layout.min.css',
                'assets/layouts/layout2/css/themes/default.min.css',
                'assets/layouts/layout2/css/custom.min.css',
                'assets/layouts/layout2/scripts/layout.min.js',
                'assets/layouts/layout2/quick-sidebar.min.js',
                'assets/layouts/layout2/css/themes/blue.min.css'

            ],
            cache: false
        });
        $scope.profileImg = Session.User.profileImageURL ? Session.User.profileImageURL : "assets/layouts/layout3/img/avatar9.jpg";
        $scope.nick = Session.User.name;
    }
    else
        $state.go("home.locations", {}, { reload: true });



    if (stateName == "admin.locations")
        GetLocations();
    else if (stateName == "admin.users")
        GetUsers();

    User.GetUserTypes().then(function (data) {
        $scope.userTypes = data.data;
    }, function (error) {
    });

    function GetLocations() {
        Location.GetLocations().then(function (data) {
            $scope.locations = data.data;
        }, function (e) {

        });
    }

    function GetUsers() {

        User.GetAll().then(function (data) {
            $scope.users = data.data;
        }, function (e) {

        });
    };


    $scope.DeleteUser = function (id) {
        User.Delete(id).then(function (data) {
            $state.go("admin.users", {}, { reload: true });
        }, function (e) {

        });
    }

    $scope.UpdateUser = function (id) {
        User.Update(id).then(function (data) {
            $state.go("admin.users", {}, { reload: true });
        }, function (e) {

        });
    }

    $scope.DeleteLocation = function (id) {
        Location.Delete(id).then(function (data) {
            $state.go("admin.locations", {}, { reload: true });
        }, function (e) {

        });
    }

    $scope.open = function () {
        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/admin-partials/addnewuser.html',
            animation: true,
            scope: $scope,
            size: 'm',
            windowClass: 'center-modal',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sakaryarehberi',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/css/login.min.css'
                        ]
                    });
                }]
            }
        });
        $scope.close = function () {
            modalInstance.close();
        };
    };

    $scope.newLocation = function () {
        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/admin-partials/addLocation.html',
            animation: true,
            scope: $scope,
            size: 'lg',
            windowClass: 'center-modal',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sakaryarehberi',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/css/login.min.css',
                              "assets/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css",
                              "assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css",
                             "assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css"
                        ]
                    });
                }]
            }
        });
    };

    $scope.addnewuser = function () {
        var user = angular.copy($scope.user);
        User.Register(user);

    };

    $scope.OpenYetki = function (id) {
        $scope.selectedUser = $scope.users[id];
        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/admin-partials/useryetki.html',
            animation: true,
            scope: $scope,
            size: 's',
            windowClass: 'center-modal',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sakaryarehberi',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/css/login.min.css'
                        ]
                    });
                }]
            }
        });
        $scope.close = function () {
            modalInstance.close();
        };
    };

    $scope.UpdateYetki = function (userId) {
        //seçili olanın id=yetki /useryetki.html
        var newYetki = $("#yetki").val();
        User.Yetkilendir(newYetki, userId).then(function (data) {
            $state.go("admin.users", {}, { reload: true });
        }, function (e) {

        });




    };



})

.controller("AdminHeaderCtrl", function () {


})

.controller("LocationEditCtrl", function ($scope, $stateParams, $state, Location) {

    var locationId = $stateParams.locationId;
    Location.GetLocationTypes().then(function (data) {
        $scope.locationTypes = data.data;

    }, function (error) {
    });
    Location.GetLocationById(locationId).then(function (data) {
        $scope.location = data.data[0];
        $(document).ready(function () {
            $('#summernote_1').summernote({ lang: "tr-TR", height: 300 })
            $('#summernote_1').code($scope.location.Info);
        })
    });
    $scope.send = function () {
        $scope.location.Info = $('#summernote_1').code();
        Location.UpdateLocation(locationId, $scope.location).then(function (data) {
            if (data.status == 200) {
                swal({ title: "Başarılı", text: "Mekan Başarıyla Güncellendi.", type: "success", confirmButtonText: "Tamam" });
                $state.go("admin.locations", {}, { reload: true });

            }
            else
                swal({ title: "Hata", text: "Olmadı.", type: "error", confirmButtonText: "Tamam" });

        })
    }
})

.controller("AccountCtrl", function ($scope, $state, $stateParams, $timeout, $ls, Session, User, FileUploader) {
    var userId = $stateParams.userId;
    $scope.isSelf = false;
    if (Session.isAuthenticated() && userId == Session.User.id)
        $scope.isSelf = true;
    else
        $scope.isSelf = false;
    var url = Settings.apiHostUrl + "/api/ChangeAvatar?userId=" + userId;
    $scope.uploader = new FileUploader();

    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
    $scope.uploader.url = url;
    $scope.uploader.autoUpload = true;


    function changeSession(data) {
        var _user = Session.User;
        _user.name = data.Name;
        _user.profileImageURL = data.ImgPath;
        $ls.setObject("SessionData", _user);
    }
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        changeSession(response[0]);
        swal({ title: "Başarılı", text: "Profil Resminiz Başarıyla Değiştirildi.", type: "success", confirmButtonText: "Tamam" });
        $state.go("home.account", {}, { reload: true });
    };
    User.GetUserById(userId).then(function (data) {
        $scope.user = data;
    });

    $scope.changeInfo = function () {
        User.ChangeInfo(userId, $scope.user.Name, $scope.user.Email).then(function (data) {
            changeSession(data.data[0]);
            swal({ title: "Başarılı", text: "Bilgileriniz Başarıyla Değiştirildi.", type: "success", confirmButtonText: "Tamam" });
            $state.go("home.account", {}, { reload: true });

        });
    }
    //$scope.newUser = {
    //    pass: "",
    //    nPass1: "",
    //    nPass2: "",
    //}

    $scope.changePassword = function () {

        User.ChangePassword(userId, $scope.user.pass, $scope.user.nPass1, $scope.user.nPass2).then(function (data) {
            if (data.status == 200) {
                swal({ title: "Başarılı", text: "Bilgileriniz Başarıyla Değiştirildi.", type: "success", confirmButtonText: "Tamam" });
                $state.go("home.account", {}, { reload: true });
            }
            else {
                swal({ title: "Hata", text: "Şifre Değiştirilemedi.Eski Şifreniz yanlış", type: "success", confirmButtonText: "Tamam" });
            }
        
        });
    }

    User.GetUserComments(userId).then(function (data) {
        $scope.comments = data;
    });
    User.GetUserLikes(userId).then(function (data) {
        $scope.likes = data;
    });
    $scope.go = function () {

        $scope.msg = 'clicked';
    }
})

.controller("CommentModalCtrl", function ($scope, User, location, $modalInstance, Session) {
    $scope.isVisible = Session.isAuthenticated();
    $scope.comment = {};
    $scope.location = location;
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
    $scope.close = function () {
        $modalInstance.close();
    };


})

.controller("NewLocationTypeCtrl", function ($scope, Location) {
    $scope.name = "";
    $scope.addLocationType = function () {
        Location.AddLocationType($scope.name);
    }

})