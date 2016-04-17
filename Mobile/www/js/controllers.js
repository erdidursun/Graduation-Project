angular.module('sakaryarehberi.controllers', ['sakaryarehberi.services'])

.controller('DashCtrl', function ($scope, $location) {

})

.controller('externalLoginCtrl', function ($scope, Auth) {
  // Auth.$onAuth(function(authData) {
  //   if (authData === null) {
  //     console.log("Not logged in yet");
  //   } else {
  //
  //
  //     console.log(JSON.stringify());
  //     console.log("Logged in as", authData.uid);
  //   }
  //   $scope.authData = authData; // This will display the user's name in our view
  // });
    $scope.logOut=function(){
      Auth.logOut();
    }
  $scope.login = function (provider) {
//     var publicLink="https://www.facebook.com/login.php?skip_api_login=1&api_key=207606379583844&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fv2.5%2Fdialog%2Foauth%3Fredirect_uri%3Dhttps%253A%252F%252Fauth.firebase.com%252Fv2%252Fsakaryarehberi%252Fauth%252Ffacebook%252Fcallback%26display%3Dpopup%26state%3D%257B%2522firebase%2522%253A%2522sakaryarehberi%2522%252C%2522transport%2522%253A%2522popup%2522%252C%2522v%2522%253A%2522js-2.3.2%2522%257D%26response_type%3Dcode%26client_id%3D207606379583844%26ret%3Dlogin&cancel_url=https%3A%2F%2Fauth.firebase.com%2Fv2%2Fsakaryarehberi%2Fauth%2Ffacebook%2Fcallback%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26state%3D%257B%2522firebase%2522%253A%2522sakaryarehberi%2522%252C%2522transport%2522%253A%2522popup%2522%252C%2522v%2522%253A%2522js-2.3.2%2522%257D%23_%3D_&display=popup";
//
// console.log(t);
    // window.open("https://www.facebook.com/login.php?skip_api_login=1&api_key=207606379583844&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fv2.5%2Fdialog%2Foauth%3Fredirect_uri%3Dhttps%253A%252F%252Fauth.firebase.com%252Fv2%252Fsakaryarehberi%252Fauth%252Ffacebook%252Fcallback%26display%3Dpopup%26state%3D%257B%2522firebase%2522%253A%2522sakaryarehberi%2522%252C%2522transport%2522%253A%2522popup%2522%252C%2522v%2522%253A%2522js-2.3.2%2522%257D%26response_type%3Dcode%26client_id%3D207606379583844%26ret%3Dlogin&cancel_url=https%3A%2F%2Fauth.firebase.com%2Fv2%2Fsakaryarehberi%2Fauth%2Ffacebook%2Fcallback%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26state%3D%257B%2522firebase%2522%253A%2522sakaryarehberi%2522%252C%2522transport%2522%253A%2522popup%2522%252C%2522v%2522%253A%2522js-2.3.2%2522%257D%23_%3D_&display=popup")
//     // console.log("resresresr");
        Auth.login(provider);


  };
})

.controller('ChatsCtrl', function ($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  var onSuccess = function (position) {


    alert('Latitude: ' + position.coords.latitude + '\n' +
    'Longitude: ' + position.coords.longitude + '\n' +
    'Altitude: ' + position.coords.altitude + '\n' +
    'Accuracy: ' + position.coords.accuracy + '\n' +
    'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
    'Heading: ' + position.coords.heading + '\n' +
    'Speed: ' + position.coords.speed + '\n' +
    'Timestamp: ' + position.timestamp + '\n');
  };

  // onError Callback receives a PositionError object
  //
  function onError(error) {
    alert('code: ' + error.code + '\n' +
    'message: ' + error.message + '\n');
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError);

  console.log(ionic.Platform.platform());
  $scope.chats = Chats.all();
  $scope.remove = function (chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
