function logout() {
    httpRequest('post', '/logout', '', 'logout error', function( data ) {
        window.location = "/";
    });
};
