angular.module("sakaryarehberi")
.service('User', function (Session, $rootScope, AUTH_EVENTS, $state, $ls, $timeout, $http, $httpParamSerializerJQLike, md5) {
    var User = {};

    User.Login = function (mail, pass) {
        var data = $httpParamSerializerJQLike({
            username: mail,
            password: pass
        });
        var func = $http.post("{apihost}/api/Login", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (data) {
                    if (data && data.status == 200) {                      
                        if (data.data.length > 0) {
                            var user = data.data[0];
                            Session.Create("form", user);
                            swal({ title: "Başarılı", text: "Giriş Başarılı", type: "success", confirmButtonText: "Tamam" });

                            if (user.type_id == 2)
                                $state.go("admin", {}, { reload: true });
                            else
                                $state.go("home.locations", {}, { reload: true });
                        }
                    }
                    else 
                        swal({ title: "Başarısız", text: "Giriş Başarısız", type: "error", confirmButtonText: "Tamam" });
                    
                }, function (error) {
                    swal({ title: "Başarısız", text: "Giriş Başarısız", type: "error", confirmButtonText: "Tamam" });
                });
    };



    User.SocialLogin = function (data) {
        var data = $httpParamSerializerJQLike(data);
        var func = $http.post("{apihost}/api/AddSocialUser", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
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

        var func = $http.post("{apihost}/API/Register", $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                      .then(function (data) {
                          swal({ title: "Başarılı", text: "Başarıyla Kayıt Oldunuz. Giriş Yapılıyor.", type: "success", confirmButtonText: "Tamam" }
                              , function () {
                                  if (!Session.isAuthenticated())
                                      User.Login(data.data.Email, data.data.Password);
                              });


                      }, function (error) {
                          swal({ title: "Başarısız", text: "Kayıt Olma Esnasında Bir hata oluştu", type: "error", confirmButtonText: "Tamam" });

                      });
    }


    User.SendComment = function (comment) {
        var data = $httpParamSerializerJQLike(comment);
        var func = $http.post("{apihost}/API/SendComment", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        return func;
    };

    User.GetAll = function () {
        var func = $http.get("{apihost}/API/GetUsers", { headers: { 'Content-Type': 'application/json' } })
        return func;
    }
    User.ChangeInfo = function (userId, name, email) {
        var url = "{apihost}/API/ChangeInfo?userId=" + userId + "&name=" + name + "&mail=" + email;
        var func = $http.get(url, { headers: { 'Content-Type': 'application/json' } })
        return func;
    }



    User.GetUserById = function (id) {
        var func = $http.get("{apihost}/API/GetUserById?userId=" + id).then(function (data) {
            return data.data[0];
        })
        return func;
    }
    User.GetUserComments = function (id) {
        var func = $http.get("{apihost}/API/GetUserComments?userId=" + id).then(function (data) {
            return data.data;
        })
        return func;
    }
    User.GetUserLikes = function (id) {
        var func = $http.get("{apihost}/API/GetUserLikes?userId=" + id).then(function (data) {
            return data.data;
        })
        return func;
    }
    User.Delete = function (id) {
        var data = {
            UserID: id
        }
        var func = $http.get("{apihost}/API/DeleteUser?UserID=" + id);
        return func;
    }

    User.GetUserTypes = function () {
        var func = $http.get("{apihost}/API/GetUserTypes", { RequireAuth: false });
        return func;
    }

    User.Update = function (user, id) {
        var data = {
            UserID: id
        }
        var func = $http.post("{apihost}/API/UpdateUser?UserID=" + id, $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          .then(function (data) {
              console.log(data);

          }, function (error) {
              console.log(error);
          });
        return func;
    }

    User.Yetkilendir = function (typeid, id) {
        var data = {
            UserID: id
        }

        var func = $http.get("{apihost}/API/UpdateYetki?typeID=" + typeid + "&UserID=" + id)
       .then(function (data) {
           console.log(data);

       }, function (error) {
           console.log(error);
       });
        return func;


    }



    User.ChangePassword = function (id, pass, npass1, npass2) {
        pass = md5.createHash(pass);
        npass1 = md5.createHash(npass1);
        npass2 = md5.createHash(npass2);

        var data = $httpParamSerializerJQLike({
            UserId: id,
            Password: pass,
            Npassword: npass1,
            Npassword2: npass2
        });

        var func = $http.post("{apihost}/API/ChangePassword", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
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
    Location.GetLocations = function (Coord, page) {
        var Coord1 = {
            Latitude: -1,
            Longtitude: -1
        };
        if (!page)
            page = 1;
        var userId = -1;
        var url = "{apihost}/API/GetLocations?page=" + page;
        if (Session.isAuthenticated())
            url = url + "&userId=" + Session.User.id;
        if (Coord)
            var data = $httpParamSerializerJQLike(Coord)
        else
            var data = $httpParamSerializerJQLike(Coord1)

        var func = $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;
    }

    Location.GetSearchLocation = function () {

        var func = $http.get("{apihost}/API/GetSearchLocation");
        return func;
    }
    Location.UpdateLocation = function (id, data) {

        var func = $http.post("{apihost}/API/UpdateLocation?locationId=" + id, $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;
    }
    Location.GetLocationById = function (id) {
        var url = "{apihost}/API/GetLocationById?id=" + id;
        if (Session.isAuthenticated())
            url = url + "&userId=" + Session.User.id;
        var func = $http.get(url, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.Like = function (locationId, userId) {
        var func = $http.get("{apihost}/API/LikeLocation?locationId=" + locationId + "&userId=" + userId, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.UnLike = function (locationId, userId) {
        var func = $http.get("{apihost}/API/UnLikeLocation?locationId=" + locationId + "&userId=" + userId, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.GetLocationTypes = function () {

        var func = $http.get("{apihost}/API/GetLocationTypes", { RequireAuth: false });


        var func = $http.get("{apihost}/API/GetLocationTypes", { RequireAuth: false });

        return func;
    }

    Location.Delete = function (id) {
        var data = {
            LocationID: id
        }
        var func = $http.get("{apihost}/API/DeleteLocation?LocationID=" + id);
        return func;
    }
    Location.Add = function (data) {


        var func = $http.post("{apihost}/API/AddLocation", $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;

    }

    Location.AddLocationType = function (data) {
        var func = $http.get("{apihost}/API/AddLocationType?name=" + data);
        return func;
    }
    return Location;
})