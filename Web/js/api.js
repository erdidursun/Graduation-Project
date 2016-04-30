﻿angular.module("sakaryarehberi")
.service('User', function (FirebaseSession, $ls, $timeout, Auth, $http, $httpParamSerializerJQLike, md5) {
    var data = {};
    var User = {};
    User.Info = function () {
        var type = Auth.getType();
        if (type == 'social') {
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
        else if (type == 'form') {
            data = $ls.getObject(FirebaseSession.Data);
            if (data) {
                return {
                    id: data.ID,
                    name: data.Name,
                    access_token: data.access_token,
                    profileImageURL: data.ImgPath,
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

    User.SendComment = function (comment) {
        var data = $httpParamSerializerJQLike(comment);
        var func = $http.post("http://{apihost}/API/SendComment", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
                   
        return func;
    };
    User.GetAll = function () {
        var func = $http.get("http://{apihost}/API/GetUsers", { headers: { 'Content-Type': 'application/json' } })
        return func;
    }
    User.Delete = function (id) {
        var data = {
            UserID:id
        }
        var func = $http.get("http://{apihost}/API/DeleteUser?UserID=" + id);
        return func;
    }

    User.AddUserCtrl = function (user) { }

    return User;




})
.service('Location', function ($http) {
    var data = {};
    var Location = {};
    Location.GetLocations = function () {
      var func = $http.get("http://{apihost}/API/GetLocations?page=1", { RequireAuth: false });
      return func;
    }
    Location.GetLocationById = function (id) {
        var func = $http.get("http://{apihost}/API/GetLocationById?id="+id, {});
        return func;
    }
    Location.GetLocationTypes = function () {
        var func = $http.get("http://{apihost}/API/GetLocationTypes", { RequireAuth:false });
        return func;
    }

    Location.Delete = function (id) {
        var data = {
            LocationID:id
        }
        var func = $http.get("http://{apihost}/API/DeleteLocation?LocationID=" + id);
        return func;
    }

    return Location;
})



;