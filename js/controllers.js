
sakaryarehberi
.controller("MainCtrl", function ($scope) {
})

.controller("HeaderCtrl", function ($scope, $state, $uibModal, User, AuthService) {
    var userInfo = User.Info();
    $scope.isLogged = userInfo?userInfo.isAuthanthanced:false;
    $scope.profileImg = userInfo && userInfo.data ? userInfo.data.profileImageURL : "../assets/layouts/layout3/img/avatar9.jpg";
    $scope.nick = userInfo && userInfo.data ? userInfo.data.displayName:"";
    $scope.logout = function (provider) {
        AuthService.logout();
        $state.go("home", {},{reload:true});
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

.controller("LoginCtrl", function ($scope,$state, AuthService, AUTH_EVENTS, User, $uibModal) {


    $scope.$on(AUTH_EVENTS.loginSuccess, function (data) {
        //$modalInstance.close();
        $state.go("home", {}, { reload: true });


    });
    $scope.$on(AUTH_EVENTS.loginFailed, function (error) {
        console.log(error);

    });
    $scope.login = function (provider)
    {
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
.controller("CarouselDemoCtrl",function($scope) {
    $scope.myInterval = 1000;
    var slides = $scope.slides = [];
    $scope.slides.push({ image: "assets/global/img/1.jpg", text: "test", active: true });
    $scope.slides.push({ image: "assets/global/img/2.jpg", text: "test2", active: false });
    $scope.slides.push({ image: "assets/global/img/3.jpg", text: "test2", active: false });

    $scope.slides.push({ image: "http://placekitten.com/503/300", text: "asdasdsad", active: false });
})
    ;