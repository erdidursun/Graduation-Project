
angular.module('sakaryarehberi')
.controller("MainCtrl", function ($scope, $timeout, Location) {


})
.controller("MapRouteCtrl", function ($scope, data, $timeout) {

    $scope.map = {
        control: {},
        center: {
            latitude: data.Location_Latitude,
            longitude: data.Location_Longtitude
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [
              google.maps.MapTypeId.ROADMAP,
              google.maps.MapTypeId.TERRAIN
            ]
        },
        zoom: 8
    };

    // marker object
    $scope.marker = {
        center: {
            latitude: data.Location_Latitude,
            longitude: data.Location_Longtitude
        }
    }
    //$scope.initialize = function () {
    //    var latlng = new google.maps.LatLng(data.Location_Latitude, data.Location_Longtitude);
    //    $scope.map2 = {
    //        control: {},
    //        center:latlng,
    //        zoom: 8
    //    };
    //};

    //var directionsDisplay = new google.maps.DirectionsRenderer();
    //var directionsService = new google.maps.DirectionsService();
    //var geocoder = new google.maps.Geocoder();


    //navigator.geolocation.getCurrentPosition(function (loc) {
    //    $scope.directions = {
    //        origin: new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude),
    //        destination: new google.maps.LatLng(location.Location_Latitude, location.Location_Longtitude),
    //        showList: false
    //    }
    //    var request = {
    //        origin: $scope.directions.origin,
    //        destination: $scope.directions.destination,
    //        travelMode: google.maps.DirectionsTravelMode.DRIVING
    //    };
    //    directionsService.route(request, function (response, status) {
    //        console.log(response);
    //        if (status === google.maps.DirectionsStatus.OK) {
    //            $scope.marker = {};
    //            directionsDisplay.setDirections(response);
    //            directionsDisplay.setMap($scope.map.control.getGMap());
    //            directionsDisplay.setPanel(document.getElementById('directionsList'));
    //            $scope.directions.showList = true;
    //        } else {
    //            alert('Google route unsuccesfull!');
    //        }
    //    });
    //});


})
.controller("LocationDetailCtrl", function ($scope, $stateParams, $ls, $uibModal, $timeout) {
    $scope.location = $stateParams.location;
    if ($scope.location != null)
        $ls.setObject("lastLocation", $scope.location);
    else
        $scope.location = $ls.getObject("lastLocation");
    $scope.slides = [];
    $scope.map = {
        control:{},     
        center: {
            latitude: $scope.location.Location_Latitude,
            longitude: $scope.location.Location_Longtitude
        },       
        zoom:14
    };

    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var geocoder = new google.maps.Geocoder();
    console.log($scope.map);

    // marker object
    $scope.marker = {
        center: {
            latitude: $scope.location.Location_Latitude,
            longitude: $scope.location.Location_Longtitude
        }
    }

    $scope.getDirections = function () {
        navigator.geolocation.getCurrentPosition(function (loc) {
            $scope.directions = {
                origin: new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude),
                destination: new google.maps.LatLng($scope.location.Location_Latitude, $scope.location.Location_Longtitude),
                showList: false
            }
            var request = {
                origin: $scope.directions.origin,
                destination: $scope.directions.destination,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                console.log(response)
                if (status === google.maps.DirectionsStatus.OK) {
                    $scope.marker = {};
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap($scope.map.control.getGMap());
                    directionsDisplay.setPanel(document.getElementById('directionsList'));
                    $scope.directions.showList = true;
                } else {
                    alert('Google route unsuccesfull!');
                }
            });
        });

      
    };

    $scope.selected = 'map';
    $scope.select = function (tab) {
        $scope.selected = tab;
    }
    $scope.like = function (location) {

    }
    $scope.myInterval = 2000;

    angular.forEach($scope.location.LocationImages, function (value) {
        $scope.slides.push({ image: value.LocationImage_Path, text: value.LocationImage_Info });
    });
})
.controller("LocationsCtrl", function ($scope, $state, Location) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });

    $scope.model = [];
    $scope.locations = [];
    $scope.locationTypes = [];
    $scope.open = function (location) {
        //var modalInstance = $uibModal.open(
        //{
        //    templateUrl: 'locationFull.html',
        //    controller: 'LocationDetailCtrl',
        //    size:'lg',
        //    resolve:
        //    {
        //        location: function () {
        //            return location;
        //        }
        //    }
        //});
    };
    Location.GetLocationTypes().then(function (data) {
        $scope.locationTypes = data.data;

    }, function (error) {
        console.log(error);
    });
    Location.GetLocations().then(function (data) {
        angular.forEach(data.data, function (value, key) {
            console.log(JSON.stringify(value));

            $scope.locations.push(value);
            $scope.model.push({ name: value.Location_Name, type: value.LocationType.LocationType_Name });
        });
        $scope.selected = $scope.model[0];

    }, function (error) {
        console.log(error);
    });;

    $scope.someGroupFn = function (item) {

        if (item.name[0] >= 'A' && item.name[0] <= 'M')
            return 'From A - M';

        if (item.name[0] >= 'N' && item.name[0] <= 'Z')
            return 'From N - Z';

    };
    $scope.selectChange = function (item) {
        console.log(item);

    }
})


.controller("HeaderCtrl", function ($scope, $state, $uibModal, User, AuthService) {
    var userInfo = User.Info();
    $scope.isLogged = userInfo ? userInfo.isAuthanthanced : false;
    $scope.profileImg = userInfo && userInfo.profileImageURL ? userInfo.profileImageURL : "../assets/layouts/layout3/img/avatar9.jpg";
    $scope.nick = userInfo ? userInfo.name : "";
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

.controller("LoginCtrl", function ($scope, $state, AuthService, md5, AUTH_EVENTS, User, $uibModal) {

    $scope.mail = "erdidursun13@gmail.com";
    $scope.pass = "1234567";
    $scope.$on(AUTH_EVENTS.loginSuccess, function (data) {
        $state.go("home", {}, { reload: true });
    });
    $scope.$on(AUTH_EVENTS.loginFailed, function (error) {
        console.log(error);

    });
    $scope.login = function () {

        AuthService.Login($scope.mail, md5.createHash($scope.pass));
    };
    $scope.socialLogin = function (provider) {
        AuthService.socialLogin(provider);
    };


})
.controller("RegisterCtrl", function ($scope, $state, User) {

    $scope.test = "12345";
    $scope.master = "true";
    $scope.user = {
        User_Email: "erdidursun09@hotmail.com",
        User_Password: "12345",
        User_Name: "sdfsdfsdfsdf"
    };
    $scope.register = function () {
        User.Register($scope.user);
    };

})
.controller("MenuCtrl", function ($scope) {

})

;