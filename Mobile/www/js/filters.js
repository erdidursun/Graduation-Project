angular.module('sakaryarehberi')
.filter('strLimit', ['$filter', function ($filter) {
     return function (input, limit) {
         if (!input) return;
         if (input.length <= limit) {
             return input;
         }

         return $filter('limitTo')(input, limit) + '...';
     }
 }])
.filter('rawHtml', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.filter('parseDate', function() {
  return function(value) {
      return Date.parse(value);
  };
})

;
