angular.module("sakaryarehberi", ["ionic",
    "angularMoment",
    "sakaryarehberi.controllers", "sakaryarehberi.directives", "sakaryarehberi.filters", "sakaryarehberi.services", "sakaryarehberi.factories",
     "sakaryarehberi.config", "sakaryarehberi.views", "underscore",
     "ngMap",
     "ngResource",
     "ngCordova",
     "slugifier",
     "ionic.contrib.ui.tinderCards",
     "youtube-embed"])
      .run(["$ionicPlatform", "PushNotificationsService", "$rootScope", "$ionicConfig", "$timeout", function (n, e, t, o, i) {
          n.on("deviceready", function () {
              if (window.cordova && window.cordova.plugins.Keyboard)
                  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

              if (window.StatusBar)
                  StatusBar.styleDefault();
              e.register()
          });
          t.$on("$stateChangeStart", function (n, e, t, s, a) {
              e.name.indexOf("auth.walkthrough") > -1 && i(
                  function () {
                      o.views.transition("android");
                      o.views.swipeBackEnabled(false);
                      console.log("setting transition to android and disabling swipe back");
                  }, 0)
          });
          t.$on("$stateChangeSuccess", function (n, e, t, i, s) {
              if (e.name.indexOf("app.feeds-categories") > -1)
                  o.views.transition("platform");
              if (ionic.Platform.isIOS())
                  o.views.swipeBackEnabled(true);
              console.log("enabling swipe back and restoring transition to platform default");
              o.views.transition()
          });
          n.on("resume", function () {
              e.register()
          });
      }])
    .config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function (n, e, t) {
        n.state("auth", {
            url: "/auth",
            templateUrl: "views/auth/auth.html",
            abstract: true,
            controller: "AuthCtrl"
        })
        .state("auth.walkthrough", {
            url: "/walkthrough",
            templateUrl: "views/auth/walkthrough.html"
        })
        .state("auth.login", {
            url: "/login",
            templateUrl: "views/auth/login.html",
            controller: "LoginCtrl"
        })
        .state("auth.signup", {
            url: "/signup",
            templateUrl: "views/auth/signup.html",
            controller: "SignupCtrl"
        })
         .state("auth.forgot-password", {
             url: "/forgot-password",
             templateUrl: "views/auth/forgot-password.html",
             controller: "ForgotPasswordCtrl"
         })
        .state("app", {
            url: "/app",
            "abstract": true,
            templateUrl: "views/app/side-menu.html",
            controller: "AppCtrl"
        })
        .state("app.miscellaneous", {
            url: "/miscellaneous",
            views: {
                menuContent: {
                    templateUrl: "views/app/miscellaneous/miscellaneous.html"
                }
            }
        })
       .state("app.maps", {
           url: "/miscellaneous/maps",
           views: {
               menuContent: {
                   templateUrl: "views/app/miscellaneous/maps.html",
                   controller: "MapsCtrl"
               }
           }
       })
       .state("app.image-picker", {
           url: "/miscellaneous/image-picker",
           views: {
               menuContent: {
                   templateUrl: "views/app/miscellaneous/image-picker.html",
                   controller: "ImagePickerCtrl"
               }
           }
       })
       .state("app.layouts", {
           url: "/layouts",
           views: {
               menuContent: {
                   templateUrl: "views/app/layouts/layouts.html"
               }
           }
       })
      .state("app.tinder-cards", {
          url: "/layouts/tinder-cards",
          views: {
              menuContent: {
                  templateUrl: "views/app/layouts/tinder-cards.html",
                  controller: "TinderCardsCtrl"
              }
          }
      })
      .state("app.slider", {
          url: "/layouts/slider",
          views: {
              menuContent: {
                  templateUrl: "views/app/layouts/slider.html"
              }
          }
      })
      .state("app.feeds-categories", {
          url: "/feeds-categories",
          views: {
              menuContent: {
                  templateUrl: "views/app/feeds/feeds-categories.html",
                  controller: "FeedsCategoriesCtrl"
              }
          }
      })
      .state("app.category-feeds", {
          url: "/category-feeds/:categoryId",
          views: {
              menuContent: {
                  templateUrl: "views/app/feeds/category-feeds.html",
                  controller: "CategoryFeedsCtrl"
              }
          }
      })
      .state("app.feed-entries", {
          url: "/feed-entries/:categoryId/:sourceId",
          views: {
              menuContent: {
                  templateUrl: "views/app/feeds/feed-entries.html",
                  controller: "FeedEntriesCtrl"
              }
          }
      })
     .state("app.wordpress", {
         url: "/wordpress",
         views: {
             menuContent: {
                 templateUrl: "views/app/wordpress/wordpress.html",
                 controller: "WordpressCtrl"
             }
         }
     })
     .state("app.post", {
         url: "/wordpress/:postId",
         views: {
             menuContent: {
                 templateUrl: "views/app/wordpress/wordpress_post.html",
                 controller: "WordpressPostCtrl"
             }
         },
         resolve: {
             post_data: ["PostService", "$ionicLoading", "$stateParams", function (n, e, t) {
                 e.show({ template: "Loading post ..." });
                 var o = t.postId;
                 return n.getPost(o)
             }]
         }
     })
     .state("app.settings", {
         url: "/settings",
         views: {
             menuContent: {
                 templateUrl: "views/app/settings.html",
                 controller: "SettingsCtrl"
             }
         }
     })
     .state("app.forms", {
         url: "/forms",
         views: {
             menuContent: {
                 templateUrl: "views/app/forms.html"
             }
         }
     })
    .state("app.profile", {
        url: "/profile",
        views: {
            menuContent: {
                templateUrl: "views/app/profile.html"
            }
        }
    })
    .state("app.bookmarks", {
        url: "/bookmarks",
        views: {
            menuContent: {
                templateUrl: "views/app/bookmarks.html"
                , controller: "BookMarksCtrl"
            }
        }
    });
        e.otherwise("/auth/walkthrough");
    }]);



