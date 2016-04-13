
sakaryarehberi
.controller("MainCtrl", function ($scope,$timeout) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });

    $scope.disabled = undefined;
    $scope.searchEnabled = undefined;

    $scope.enable = function () {
        $scope.disabled = false;
    };

    $scope.disable = function () {
        $scope.disabled = true;
    };

    $scope.enableSearch = function () {
        $scope.searchEnabled = true;
    }

    $scope.disableSearch = function () {
        $scope.searchEnabled = false;
    }

    $scope.clear = function () {
        $scope.person.selected = undefined;
        $scope.address.selected = undefined;
        $scope.country.selected = undefined;
    };

    $scope.someGroupFn = function (item) {

        if (item.name[0] >= 'A' && item.name[0] <= 'M')
            return 'From A - M';

        if (item.name[0] >= 'N' && item.name[0] <= 'Z')
            return 'From N - Z';

    };
    $scope.person = {};
    $scope.people = [{
        name: 'Adam',
        email: 'adam@email.com',
        age: 12,
        country: 'United States'
    }, {
        name: 'Amalie',
        email: 'amalie@email.com',
        age: 12,
        country: 'Argentina'
    }, {
        name: 'Estefanía',
        email: 'estefania@email.com',
        age: 21,
        country: 'Argentina'
    }, {
        name: 'Adrian',
        email: 'adrian@email.com',
        age: 21,
        country: 'Ecuador'
    }, {
        name: 'Wladimir',
        email: 'wladimir@email.com',
        age: 30,
        country: 'Ecuador'
    }, {
        name: 'Samantha',
        email: 'samantha@email.com',
        age: 30,
        country: 'United States'
    }, {
        name: 'Nicole',
        email: 'nicole@email.com',
        age: 43,
        country: 'Colombia'
    }, {
        name: 'Natasha',
        email: 'natasha@email.com',
        age: 54,
        country: 'Ecuador'
    }, {
        name: 'Michael',
        email: 'michael@email.com',
        age: 15,
        country: 'Colombia'
    }, {
        name: 'Nicolás',
        email: 'nicolas@email.com',
        age: 43,
        country: 'Colombia'
    }];


    $scope.multipleDemo = {};
    $scope.multipleDemo.selectedPeople = [$scope.people[5], $scope.people[4]];
    $scope.multipleDemo.selectedPeopleWithGroupBy = [$scope.people[8], $scope.people[6]];
    $scope.multipleDemo.selectedPeopleSimple = ['samantha@email.com', 'wladimir@email.com'];


})
 .filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function (item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    })

.controller("HeaderCtrl", function ($scope, $state, $uibModal, User, AuthService) {
    var userInfo = User.Info();
    $scope.isLogged = userInfo ? userInfo.isAuthanthanced : false;
    $scope.profileImg = userInfo && userInfo.data ? userInfo.data.profileImageURL : "../assets/layouts/layout3/img/avatar9.jpg";
    $scope.nick = userInfo && userInfo.data ? userInfo.data.displayName : "";
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

.controller("LoginCtrl", function ($scope, $state, AuthService, AUTH_EVENTS, User, $uibModal) {


    $scope.$on(AUTH_EVENTS.loginSuccess, function (data) {
        $state.go("home", {}, { reload: true });


    });
    $scope.$on(AUTH_EVENTS.loginFailed, function (error) {
        console.log(error);

    });
    $scope.login = function (provider) {
        AuthService.socialLogin(provider);
    };


})
.controller("RegisterCtrl", function ($scope, $state) {


    $scope.back = function () {
        $state.go("^");
    }


})
.controller("MenuCtrl", function ($scope) {

})
.controller("CarouselDemoCtrl", function ($scope) {
    $scope.myInterval = 1000;
    var slides = $scope.slides = [];
    $scope.slides.push({ image: "assets/global/img/1.jpg", text: "test", active: true });
    $scope.slides.push({ image: "assets/global/img/2.jpg", text: "test2", active: false });
    $scope.slides.push({ image: "assets/global/img/3.jpg", text: "test2", active: false });

    $scope.slides.push({ image: "http://placekitten.com/503/300", text: "asdasdsad", active: false });
})
;