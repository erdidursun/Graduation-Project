angular.module("sakaryarehberi.filters", [])
    .filter("rawHtml", ["$sce", function (n) {
        return function (e) { return n.trustAsHtml(e) }
    }])
    .filter("parseDate", function () {
        return function (n) {
            return Date.parse(n)
        }
    });
