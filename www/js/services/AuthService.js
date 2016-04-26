angular
		.module('todoApp')
		.factory('Auth', Auth);

Auth.$inject = ['$firebaseAuth', 'FireBaseUrl', '$state'];
function Auth($firebaseAuth, FireBaseUrl, $state) {
  var usersRef = new Firebase(FireBaseUrl);
  var firebaseAuth = $firebaseAuth(usersRef);
  var service = {
    login: login,
    logout: logout,
    signedIn: signedIn,
    firebaseAuth: firebaseAuth,
    getuser: getUser
  };

		return service;

  function signedIn() {
    var result = !!getUser().provider; //using !! means (0, undefined, null, etc) = false | otherwise = true
    if (!result) { 
      $state.go("login");
    }

    return result;
  }
  function logout() {
    setUser('');
    firebaseAuth.$unauth()
  }

  function setUser(user_data) {
    window.localStorage["authdata"] = JSON.stringify(user_data);
  };

  function getUser() {
    return JSON.parse(window.localStorage["authdata"] || '{}');
  };

  function verifyIsLoggedIn() {
    var authData = ref.getAuth();
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      return true;
    } else {
      console.log("User is logged out");
      return false;
    }
  }

  function login(authMethod) {
    firebaseAuth.$authWithOAuthRedirect(authMethod).then(function (authData) {
      console.log("logged in", authData);
      setUser(authData);

    }).catch(function (error) {
      console.log('login error', error);
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        firebaseAuth.$authWithOAuthPopup(authMethod).then(function (authData) {
          console.log("logged in", authData);
          setUser(authData);
        });
      } else {
        console.log(error);
      }
    })

  };
}