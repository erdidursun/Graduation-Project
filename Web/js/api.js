angular.module("sakaryarehberi")
.service('User', function (FirebaseSession, $ls, $timeout, Auth, $http, $httpParamSerializerJQLike, md5) {
    var data = {};
    var User = {};
    User.Info = function () {
        if (Auth.type == 'social') {
            data = $ls.getObject(FirebaseSession.Data);
            if (data) {
                var provider = data["" + data.provider + ""];
                return {
                    id: provider.id,
                    name: provider.displayName,
                    access_token: provider.accessToken,
                    profileImageURL: provider.profileImageURL,
                    isAuthanthanced: data ? true : false
                };
            }
            else
                return {};
        }
        else if (Auth.type == 'form') {
            data = $ls.getObject(FirebaseSession.Data);
            if (data) {
                return {
                    id: data.User_ID,
                    name: data.User_Name,
                    access_token: data.access_token,
                    profileImageURL: data.profileImageURL,
                    isAuthanthanced: data ? true : false
                };
            }

            else
                return {};
        }

    }

    User.Register = function (user) {
        user.User_Password = md5.createHash(user.User_Password);

        var func = $http.post("http://{apihost}/API/Register", $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                      .then(function (data) {
                          console.log(data);

                      }, function (error) {
                          console.log(error);
                      });

    }
    return User;




})
.service('Location', function ($http) {
    var data = {};
    var Location = {};
    Location.GetLocations = function () {
        var func = $http.get("http://{apihost}/API/GetLocations?page=1", {});
        //.then(function (data) {
        //    console.log(data);

        //}, function (error) {
        //    console.log(error);
        //});
      return func;
    }
    Location.GetLocationTypes = function () {
        var func = $http.get("http://{apihost}/API/GetLocationTypes", {});
        return func;
    }
    return Location;
})



;