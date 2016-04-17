angular.module('sakaryarehberi')
    .directive('main', function () {
        return {
            restrict: 'E', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
            replace: true,
            templateUrl: "views/main.html",
            controller: "MainCtrl"
        }
    })
  .directive('header', function () {
      return {
          restrict: 'E', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
          replace: true,
          templateUrl: "views/partials/header.html",
          controller: "HeaderCtrl"
      }
  })
     .directive('slider', function () {
         return {
             restrict: 'E', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
             replace: true,
             templateUrl: "views/partials/slider.html",
             controller: "CarouselDemoCtrl"
         }
     })
     .directive('menu', function () {
         return {
             restrict: 'E', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
             replace: true,
             templateUrl: "views/partials/menu.html",
             controller: "MenuCtrl"
         }
     })
.directive("repeatPassword", function () {
    return {
        require: "ngModel",
        link: function (scope, elem, attrs, ctrl) {
            var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

            ctrl.$parsers.push(function (value) {
                if (value === otherInput.$viewValue) {
                    ctrl.$setValidity("repeat", true);
                    return value;
                }
                ctrl.$setValidity("repeat", false);
            });

            otherInput.$parsers.push(function (value) {
                ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                return value;
            });
        }
    };
});
;