angular.module('sakaryarehberi')
.controller("MainCtrl", function () {


})

.controller("LocationDetailCtrl", function ($scope, User, $state, Location, Auth, $uibModal, $rootScope, $stateParams, uiGmapIsReady, $ls, uiGmapGoogleMapApi, $timeout) {

 
    var locationId = $stateParams.locationId;

    Location.GetLocationById(locationId).then(function (data) {
        $scope.location = data.data;
        angular.forEach($scope.location.LocationImages, function (value) {
            $scope.slides.push({ image: value.LocationImage_Path, text: value.LocationImage_Info });
        });
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
                latitude: $scope.location.Location_Latitude,
                longitude: $scope.location.Location_Longtitude
            },
            zoom: 10
        };
    })
    $rootScope.hideMarker = false;
    $scope.slides = [];
    $scope.filterDisplayName = "Yol Tarifi"
    $scope.mapResult;
    $scope.comment = {};
    $scope.myInterval = 5000;


    uiGmapIsReady.promise(1).then(function (instances) {
        instances.forEach(function (inst) {
            $scope.mapResult = inst.map;
            $scope.getDirections("car");
            return;
        });
    });
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var geocoder = new google.maps.Geocoder();
    $scope.getDirections = function (type) {
        navigator.geolocation.getCurrentPosition(function (loc) {
            $scope.currentLocation = loc;
            $rootScope.directions = {
                origin: new google.maps.LatLng($scope.currentLocation.coords.latitude, $scope.currentLocation.coords.longitude),
                destination: new google.maps.LatLng($scope.location.Location_Latitude, $scope.location.Location_Longtitude),
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


    $scope.open = function (location) {
        var modalInstance = $uibModal.open(
        {
            templateUrl: 'views/partials/map.html',
            animation: true,
            scope: $scope,
            size: 'lg'
        });
    };

    $scope.like = function (location) {

    }

    $scope.sendComment = function () {
        $scope.comment.UserId = User.Info().id;
        $scope.comment.LocationId = $scope.location.Location_ID;

        User.SendComment($scope.comment).then(function (data) {
            $state.go("home.locationDetails/" + locationId);
        });
    }


})
.controller("LocationsCtrl", function ($scope, $location, $sce, Auth, $state, Location, $ocLazyLoad, $uibModal, $ls, $rootScope, $stateParams, uiGmapIsReady, $ls, uiGmapGoogleMapApi, $timeout) {
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
            controller:"LocationDetailCtrl",
            size: 'lg',
            resolve: {
                locationId: function () {
                    return locationId;
                }
            }
        });
    };


    
    $scope.selectChange = function (locationId) {
        $location.path('/locationDetail/' + locationId);


    }
})
.controller("HeaderCtrl", function ($scope, $state, $uibModal, User, AuthService) {
    var userInfo = User.Info();
    $scope.isLogged = userInfo ? userInfo.isAuthanthanced : false;
    $scope.profileImg = userInfo && userInfo.profileImageURL ? userInfo.profileImageURL : "../assets/layouts/layout3/img/avatar9.jpg";
    $scope.nick = userInfo ? userInfo.name : "";
    $scope.logo = "../assets/layouts/layout3/img/deneme.jpg";
    $scope.logout = function (provider) {
        AuthService.logout();
        $state.go("home", {}, { reload: true });
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

        AuthService.Login($scope.mail, md5.createHash($scope.pass));
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
.controller("AdminMainCtrl", function ($scope, $state, Location, User, $uibModal, $ocLazyLoad)
{
    $scope.locations = {};
    $scope.users = {};
    $scope.userTypes = {};
    var userInfo = User.Info();
    $scope.isLogged = userInfo ? userInfo.isAuthanthanced : false;
    $scope.profileImg = userInfo && userInfo.profileImageURL ? userInfo.profileImageURL : "../assets/layouts/layout3/img/avatar9.jpg";
    $scope.nick = userInfo ? userInfo.name : "";
    $scope.showAdminPanel = User.isAdmin();
    var stateName = $state.current.name;
    
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

    if (stateName == "admin.locations")
        GetLocations();
    if (stateName == "admin.users")
        GetUsers();

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
    $scope.addnewuser = function () {
         var user = angular.copy($scope.user);
        User.Register(user);

    };


})

