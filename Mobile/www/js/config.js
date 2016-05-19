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
;
