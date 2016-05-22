angular.module("sakaryarehberi")
.service('User', function (Session, $rootScope, AUTH_EVENTS, $ls, $timeout, $http, $httpParamSerializerJQLike, md5) {
    var User = {};

    User.Login = function (mail, pass) {
        var data = $httpParamSerializerJQLike({
            username: mail,
            password: pass
        });
        var func = $http.post("http://{apihost}/api/Login", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (data) {
                    swal({ title: "Başarılı", text: "Giriş Başarılı", type: "success", confirmButtonText: "Tamam" });
                         
                    if (data)
                        Session.Create("form", data.data[0]);
                    else
                        Session.Create("form", null);


                }, function (error) {
                    swal({ title: "Başarısız", text: "Giriş Başarısız", type: "error", confirmButtonText: "Tamam" });

                    Session.Create("form", null);

                });
    };



    User.SocialLogin = function (data) {
        var data = $httpParamSerializerJQLike(data);
        var func = $http.post("http://{apihost}/api/AddSocialUser", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (data) {
                    if (data)
                        Session.Create("social", data.data[0]);
                    else
                        Session.Create("social", null);


                }, function (error) {
                    Session.Create("social", null);

                });
    };
    User.Register = function (user) {
        user.User_Password = md5.createHash(user.User_Password);

        var func = $http.post("http://{apihost}/API/Register", $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                      .then(function (data) {
                          swal({ title: "Başarılı", text: "Başarıyla Kayıt Oldunuz. Giriş Yapılıyor.", type: "success", confirmButtonText: "Tamam" }
                              , function () {
                                  User.Login(data.data.Email, data.data.Password);
                              });


                      }, function (error) {
                          swal({ title: "Başarısız", text: "Kayıt Olma Esnasında Bir hata oluştu", type: "error", confirmButtonText: "Tamam" });
                             
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
    User.ChangeInfo = function (userId, name, email) {
        var url = "http://{apihost}/API/ChangeInfo?userId=" + userId + "&name=" + name + "&mail=" + email;
        var func = $http.get(url, { headers: { 'Content-Type': 'application/json' } })
        return func;
    }
    User.GetUserById = function (id) {
        var func = $http.get("http://{apihost}/API/GetUserById?userId=" + id).then(function (data) {
            return data.data[0];
        })
        return func;
    }
    User.GetUserComments= function (id) {
        var func = $http.get("http://{apihost}/API/GetUserComments?userId=" + id).then(function (data) {
            return data.data;
        })
        return func;
    }
    User.GetUserLikes= function (id) {
        var func = $http.get("http://{apihost}/API/GetUserLikes?userId=" + id).then(function (data) {
            return data.data;
        })
        return func;
    }
    User.Delete = function (id) {
        var data = {
            UserID: id
        }
        var func = $http.get("http://{apihost}/API/DeleteUser?UserID=" + id);
        return func;
    }

    User.GetUserTypes = function () {
        var func = $http.get("http://{apihost}/API/GetUserTypes", { RequireAuth: false });
        return func;
    }

    User.Update = function (user, id) {
        var data = {
            UserID: id
        }
        var func = $http.post("http://{apihost}/API/UpdateUser?UserID=" + id, $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          .then(function (data) {
              console.log(data);

          }, function (error) {
              console.log(error);
          });
        return func;
    }


    return User;




})
.service('Location', function ($http, $httpParamSerializerJQLike, Session) {
    var data = {};
    var Location = {};
    Location.GetLocations = function (Coord,page) {
        var Coord1 = {
            Latitude: -1,
            Longtitude: -1
        };
        if (!page)
            page = 1;
        var userId = -1;
        var url="http://{apihost}/API/GetLocations?page="+page;
        if (Session.isAuthenticated())
            url = url + "&userId=" + Session.User.id;
        if (Coord)
            var data = $httpParamSerializerJQLike(Coord)
        else
            var data = $httpParamSerializerJQLike(Coord1)

        var func = $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;
    }
    Location.GetLocationById = function (id) {
        var url = "http://{apihost}/API/GetLocationById?id=" + id;
        if (Session.isAuthenticated())
            url = url + "&userId=" + Session.User.id;
        var func = $http.get(url, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.Like = function (locationId, userId) {
        var func = $http.get("http://{apihost}/API/LikeLocation?locationId=" + locationId + "&userId=" + userId, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.UnLike = function (locationId, userId) {
        var func = $http.get("http://{apihost}/API/UnLikeLocation?locationId=" + locationId + "&userId=" + userId, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.GetLocationTypes = function () {

        var func = $http.get("http://{apihost}/API/GetLocationTypes", { RequireAuth: false });


        var func = $http.get("http://{apihost}/API/GetLocationTypes", { RequireAuth: false });

        return func;
    }

    Location.Delete = function (id) {
        var data = {
            LocationID: id
        }
        var func = $http.get("http://{apihost}/API/DeleteLocation?LocationID=" + id);
        return func;
    }
    Location.Add = function (data) {


        var func = $http.post("http://{apihost}/API/AddLocation", $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;

    }

    Location.AddLocationType = function (data) {
        var func = $http.get("http://{apihost}/API/AddLocationType?name=" + data);
        return func;
    }
    return Location;
})