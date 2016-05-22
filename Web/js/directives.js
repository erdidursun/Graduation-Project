﻿angular.module('sakaryarehberi')
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
          cache: false,

          controller: "HeaderCtrl"
      }
  })

    .directive('adminHeader', function () {
        return {
            restrict: 'E', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
            replace: true,
            templateUrl: "views/admin-partials/header.html",
            controller: "AdminHeaderCtrl"
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

        .directive('adminMenu', function () {
            return {
                restrict: 'E', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
                replace: true,
                templateUrl: "views/admin-partials/menu.html",
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
})
.directive('a',
    function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function (e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
    }).directive('ngThumb', ['$window', function ($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function (item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function (file) {
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function (scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }])

;