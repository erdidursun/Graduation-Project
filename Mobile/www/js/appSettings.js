angular.module('sakaryarehberi.appSettings',[])
.factory("Settings",function() {
   var fireBaseAppName="sakaryarehberi";
   return {
     FIREBASEAPPNAME:fireBaseAppName,
     FireBaseUrl: "https://"+fireBaseAppName+".firebaseio.com",
     LsHostKey:"firebase:host:"+fireBaseAppName+".firebaseio.com",
     LsAuthDataKey:"firebase:session::"+ fireBaseAppName
   }
 });
