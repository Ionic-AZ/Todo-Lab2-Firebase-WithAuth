angular
	.module('todoApp')
	.controller('ProfileController', ProfileController);

ProfileController.$inject = ['$scope', 'Auth'];
function ProfileController($scope, Auth) {
    $Auth.signedIn();

  $scope.authData = Auth.getuser();
  console.log('Auth: ', Auth.getuser);

  $scope.logout = function () {    
    Auth.logout();    
  }

}