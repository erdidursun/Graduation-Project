angular.module("sakaryarehberi.services", [])
    .service("FeedList", ["$rootScope", "FeedLoader", "$q", function (n, e, t) {
        this.get = function (n) {
            var o = t.defer();
            return e.fetch({ q: n, num: 20 }, {}, function (n) { o.resolve(n.responseData) }), o.promise
        }
    }])
    .service("PushNotificationsService", ["$rootScope", "$cordovaPush", "NodePushServer", "GCM_SENDER_ID", function (n, e, t, o) {
        this.register = function () {
            var i = {};
            if (ionic.Platform.isAndroid())
                i = { senderID: o };
            e.register(i).then(function (n) {
                console.log("$cordovaPush.register Success")
                console.log(n)
            },
            function (n) {
                console.log("$cordovaPush.register Error"),
                console.log(n)
            });
        }
        n.$on("$cordovaPush:notificationReceived", function (n, e) {
            console.log(JSON.stringify([e]));
            switch (e.event) {
                case "registered":
                    if (e.regid.length > 0) {
                        console.log("registration ID = " + e.regid);
                        t.storeDeviceToken("android", e.regid);
                    }
                    break;
                case "message":
                    if (e.foreground)
                        console.log("Notification received when app was opened (foreground = true)")
                    if (e.coldstart)
                        console.log("Notification received when app was in background (started but not focused, foreground = false, coldstart = false)")
                    else
                        console.log("Notification received when app was in background (started but not focused, foreground = false, coldstart = false)")
                    console.log("message = " + e.message);
                    break;
                case "error":
                    console.log("GCM error = " + e.msg);
                    break;
                default:
                    console.log("An unknown GCM event has occurred");
                    if (ionic.Platform.isIOS())
                        i = { badge: true, sound: true, alert: true };
                    e.register(i).then(function (n) {
                        console.log("result: " + n);
                        t.storeDeviceToken("ios", n)
                    },
                    function (n) {
                        console.log("Registration error: " + n)
                    });
                    break;
                    n.$on("$cordovaPush:notificationReceived", function (n, e) {
                        console.log(e.alert, "Push Notification Received")
                    });
            }
        });
    }
    ])
