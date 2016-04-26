angular
  .module('todoApp')
  .controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$state', 'Auth'];
function LoginController($scope, $state, Auth) {

  if (Auth.signedIn()) {
    $state.go("app.tasks");
  }

  $scope.login = function (authMethod) {
    Auth.login(authMethod);
  };

  Auth.firebaseAuth.$onAuth(function (authData) {
    if (authData === null) {
      console.log('Not Logged in Yet');
      $scope.authData = '';
      window.localStorage.removeItem("authdata");
      $state.go('login');

    } else {
      console.log('Logged in as ', authData.uid);
      window.localStorage["authdata"] = JSON.stringify(authData);
      $scope.authData = authData;
      $state.go("app.tasks");
    }
  });
}