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

.controller("MapCtrl", function ($scope, $rootScope, location, uiGmapIsReady, $timeout) {

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
        navigator.geolocation.getCurrentPosition(function (loc) {
            $scope.currentLocation = loc;
            $rootScope.directions = {
                origin: new google.maps.LatLng($scope.currentLocation.coords.latitude, $scope.currentLocation.coords.longitude),
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


})

.controller("LocationDetailCtrl", function ($scope, $ocLazyLoad, User, $state, Location, $uibModal, $rootScope, $stateParams, uiGmapIsReady, $ls, uiGmapGoogleMapApi, $timeout) {

    var locationId = $stateParams.locationId;

    Location.GetLocationById(locationId).then(function (data) {
        $scope.location = data.data[0];

        angular.forEach($scope.location.Images, function (value) {
            $scope.slides.push({ image: "http://" + Settings.apiHostUrl + "/" + value.Path, text: value.Info });
        });
    })
    $scope.slides = [];
    $scope.comment = {};
    $scope.myInterval = 5000;

    $scope.open = function (location) {
        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/partials/map.html',
            animation: true,
            controller: "MapCtrl",
            resolve: {
                location: function () {

                    return { Latitude: location.Latitude, Longtitude: location.Longtitude };
                }
            },
            size: 'lg'
        });
    };

    $scope.like = function (location) {

    }

    $scope.sendComment = function () {
        $scope.comment.UserId = User.Info().id;
        $scope.comment.LocationId = $scope.location.Location_ID;

        User.SendComment($scope.comment).then(function (data) {
            console.log(data);
            $state.go("home.locationDetails", { locationId: locationId }, { reload: true });
        });
    }


})
.controller("LocationsCtrl", function (Session, $scope, $location, $sce, $state, Location, $ocLazyLoad, $uibModal, $ls, $rootScope, $stateParams, uiGmapIsReady, $ls, uiGmapGoogleMapApi, $timeout) {

    $scope.model = [];

    $scope.locations = [];
    $scope.locationTypes = [];
    Location.GetLocationTypes().then(function (data) {
        $scope.locationTypes = data.data;

    }, function (error) {
        console.log(error);
    });
    Location.GetLocations().then(function (data) {
        angular.forEach(data.data, function (value, key) {
            $scope.locations.push(value);
            $scope.model.push({ name: value.Name, type: value.TypeName, id: value.ID });
        });
        $ocLazyLoad.load({
            files: ['assets/pages/scripts/portfolio-1.js'],
            cache: false
        });
    }, function (error) {
        console.log(error);
    });;

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
    $scope.openMap = function (location) {
        console.log(location);
        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/partials/map.html',
            animation: true,
            controller: "MapCtrl",
            windowClass: 'center-modal',

            resolve: {
                location: function () {
                    return { Latitude: location.Latitude, Longtitude: location.Longtitude };
                }
            },
            size: 'lg'
        });
    };

    $scope.selectChange = function (locationId) {
        $state.go("home.locationDetails", { locationId: locationId });


    }
    $scope.like = function (locationId) {
        if (!Session.isAuthenticated()) {
            console.log("33");
            swal({ title: "Giriş Yapmalısınız", text: "Seçtiğiniz kriterlere uygun yol bulunmamaktadır.!", type: "error", confirmButtonText: "Cool" });

        }


    }

})


.controller("HeaderCtrl", function ($scope, $state, $rootScope, AUTH_EVENTS, $uibModal, Session, AuthService) {
    $scope.isLogged = false;

    if (Session.isAuthenticated()) {
        $scope.isLogged = true;
        $scope.profileImg = Session.User.profileImageURL ? Session.User.profileImageURL : "../assets/layouts/layout3/img/avatar9.jpg";
        $scope.nick = Session.User.name;
    }


    $scope.logout = function (provider) {
        AuthService.logout();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, null);
    };
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
.controller("LoginCtrl", function ($scope, AuthService, md5, User) {

    $scope.mail = "erdidursun13@gmail.com";
    $scope.pass = "1234567";
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

.controller("LocationNewCtrl", function ($scope,$ls, $state, Location, FileUploader, $ocLazyLoad) {
    $scope.locationTypes = {};
    $ocLazyLoad.load({
        files: [
            'assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css',
            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
            'assets/global/plugins/bootstrap-summernote/summernote.css',
            'assets/global/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js',
            'assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js',
            'assets/global/plugins/bootstrap-markdown/lib/markdown.js',
            'assets/global/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
            'assets/global/plugins/bootstrap-summernote/summernote.min.js'
        ],
        cache: true
    });
    Location.GetLocationTypes().then(function (data) {
        $scope.locationTypes = data.data;   

    }, function (error) {
        console.log(error);
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
    $scope.location = {
        Banner: "assets/global/img/locationImages/1.jpg",
        Name: "Ozan Gölü",
        Info: "Test",
        Latitude: 40.716701507568359,
        Longtitude: 40.716701507568359
    }
    var location = $ls.getObject("Location");

    if (location) {
        $scope.step = $ls.get("Step");
        $scope.location = location;
        console.log($scope.location.ID);
        $scope.uploader2.url = "http://localhost:8054/api/Upload?locationID=" + $scope.location.ID + "&isBanner=true";
        $scope.uploader.url = "http://localhost:8054/api/Upload?locationID=" + $scope.location.ID;

    }
    $scope.width = ($scope.step / $scope.totalStep) * 100;

    $scope.$watch('step', function () {
        $scope.width = ($scope.step / $scope.totalStep) * 100;
    });  
    $scope.addNewLocation = function () {
        $scope.location.Info = $("#info").data('markdown').parseContent();
        Location.Add($scope.location).then(function (data) {
            $scope.location = data.data[0];
            $ls.setObject("Location", $scope.location);
            $ls.set("Step", 2);
            $scope.step = 2;
            var id = $scope.location.ID;
            $scope.uploader2.url = "http://localhost:8054/api/Upload?locationID=" + id + "&isBanner=true";
            $scope.uploader.url = "http://localhost:8054/api/Upload?locationID=" + id;

        });
    };
    $scope.uploader2.onCompleteAll = function (fileItem, response, status, headers) {
        $scope.step = 3;
        $ls.remove("Location");

        $ls.set("Step", $scope.step);

    };
    $scope.uploader.onCompleteAll = function (fileItem, response, status, headers) {
    
        swal({ title: "Başarılı", text: "Mekan Başarıyla Eklendi", type: "success", confirmButtonText: "Tamam" });
        $state.go("admin.users", {}, { reload: true });

    };
   
})


.controller("AdminMainCtrl", function ($scope, Session, $state, Location, User, $uibModal, $ocLazyLoad) {
    $scope.locations = {};
    $scope.users = {};
    $scope.userTypes = {};
    $scope.isLogged = false;

    if (Session.isAdmin()) {
        $scope.isLogged = true;
        $scope.profileImg = Session.User.profileImageURL ? Session.User.profileImageURL : "../assets/layouts/layout3/img/avatar9.jpg";
        $scope.nick = Session.User.name;
    }
    else
        $state.go("home.locations", {}, { reload: true });
    var stateName = $state.current.name;
    $scope.user = {
        User_Name: "",
        User_Password: "",
        User_Email: ""
    };

    if (stateName == "admin.locations")
        GetLocations();
    if (stateName == "admin.users")
        GetUsers();

    User.GetUserTypes().then(function (data) {
        $scope.userTypes = data.data;

    }, function (error) {
        console.log(error);
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
        console.log(id);
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
            size: 'lg',
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
    };

    $scope.user = {};
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
                              "/assets/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css",
                              "assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css",
                             "/assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css"
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


})

.controller("AdminHeaderCtrl", function() {


})