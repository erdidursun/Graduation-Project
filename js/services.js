sakaryarehberi.factory('SocialLogin', function ($firebaseAuth) {
    var ref = new Firebase("https://sakaryarehberi.firebaseio.com");
    // create an instance of the authentication service
    return $firebaseAuth(ref);
})