angular.module('sakaryarehberi')
.constant('WORDPRESS_API_URL', 'http://wordpress.startapplabs.com/blog/api/')
.constant('GCM_SENDER_ID', '574597432927')
.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})
var Settings = {
    //apiHostUrl: "tommycarter-001-site1.itempurl.com",
    //apiHostUrl: "localhost:8054",
    apiHostUrl: "192.168.2.56:8054",
    logingEnabled: false
}
;
