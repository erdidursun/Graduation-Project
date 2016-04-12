
sakaryarehberi
.controller("MainCtrl", function ($scope) {
})

.controller("HeaderCtrl", function ($scope,$uibModal) {
    var isLogged = false;

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

.controller("LoginCtrl", function ($scope, SocialLogin) {
    // login with Facebook

    $scope.login = function (provider)
    {
        SocialLogin.$authWithOAuthPopup(provider).then(function (authData) {
            console.log(authData);
        }).catch(function (error) {
            console.log("Authentication failed:", error);
        });
    };

   
})
.controller("MenuCtrl", function ($scope) {

})
.controller("CarouselDemoCtrl",function($scope) {
    $scope.myInterval = 1000;
    var slides = $scope.slides = [];
    $scope.slides.push({ image: "assets/global/img/600x600/1.jpg", text: "test", active: true });
    $scope.slides.push({ image: "assets/global/img/600x600/2.jpg", text: "test2", active: false });
    $scope.slides.push({ image: "assets/global/img/600x600/3.jpg", text: "test2", active: false });
    $scope.slides.push({ image: "assets/global/img/600x600/4.jpg", text: "test2", active: false });

    $scope.slides.push({ image: "http://placekitten.com/503/300", text: "asdasdsad", active: false });
})
    ;