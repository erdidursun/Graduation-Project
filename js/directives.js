sakaryarehberi
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
;