
angular.module('sakaryarehberi')
.controller("MainCtrl", function ($scope, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });



    $scope.someGroupFn = function (item) {

        if (item.name[0] >= 'A' && item.name[0] <= 'M')
            return 'From A - M';

        if (item.name[0] >= 'N' && item.name[0] <= 'Z')
            return 'From N - Z';

    };
    $scope.selectChange = function (item) {
        console.log(item);

    }
    $scope.model = [{ isim: "İstanbul", plakaNo: 34 },
    { isim: "Sakarya", plakaNo: 54 },
    { isim: "Ardahan", plakaNo: 75 }
    ];
    $scope.selected = $scope.model[0];
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

.controller("LoginCtrl", function ($scope, $state, AuthService,md5, AUTH_EVENTS, User, $uibModal) {

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
.controller("CarouselDemoCtrl", function ($scope) {
    $scope.myInterval = 1000;
    var slides = $scope.slides = [];
    $scope.slides.push({ image: "assets/global/img/1.jpg", text: "test", active: true });
    $scope.slides.push({ image: "assets/global/img/2.jpg", text: "test2", active: false });
    $scope.slides.push({ image: "assets/global/img/3.jpg", text: "test2", active: false });

    $scope.slides.push({ image: "http://placekitten.com/503/300", text: "asdasdsad", active: false });
})
;