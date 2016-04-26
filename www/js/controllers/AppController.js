angular
	.module('todoApp')
	.controller('AppController', AppController);

AppController.$inject = [
	'$scope',
	'$state',
	'$ionicModal',
	'$ionicSideMenuDelegate',
	'Projects',
	'$ionicLoading',
  '$ionicPopup',
  'Auth'];
function AppController(
	$scope,
	$state,
	$ionicModal,
	$ionicSideMenuDelegate,
	Projects,
	$ionicLoading,
  $ionicPopup,
  Auth) {


	//set reference to Firebase DB
	var firebaseKeyRegEx = /^-[\w-]{19}$/;

	//set projects equal to Firebase DB transformed to array (this will stay in sync with DB)
	$scope.projects = Projects.all();

  $scope.logout = function () {    
    Auth.logout();    
  }
  
	$scope.projects.$loaded()
		.then(function () {
			var lastActiveKey = Projects.getLastActiveIndex();
			console.log('lastActiveKey', lastActiveKey);
			console.log('Check FB Key', firebaseKeyRegEx.test(lastActiveKey));
			
			if ($scope.projects.length === 0) {
				$scope.showProjectModal();
			}
			else if (firebaseKeyRegEx.test(lastActiveKey)) {
				$scope.selectProject(lastActiveKey);
			} else {
				$scope.selectProject($scope.projects[0].$id);
			}
		})
		.catch(function (error) {
			console.error("Error:", error);
		}).finally(function () {
			$scope.hideLoading();
		});

	// Selects the given project by it's firebase key
	$scope.selectProject = function (key) {
		console.log($scope.projects);
		console.log('key', key);
		$scope.activeProject = $scope.projects.$getRecord(key);
		Projects.setLastActiveIndex(key);
		$ionicSideMenuDelegate.toggleLeft(false);
	};


	$ionicModal.fromTemplateUrl('templates/new-project.html', function (modal) {
		$scope.projectModal = modal;
	}, {
		scope: $scope
	});

	$scope.showLoading = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 500
		});
	};
	$scope.hideLoading = function () {
		$ionicLoading.hide();
	};
	$scope.showLoading();

	$scope.showProjectModal = function () {
		$scope.projectModal.show();
	};

	$scope.closeNewProject = function () {
		$scope.projectModal.hide();
	};

	$scope.newProject = function (project) {
		if (!project) {
			return;
		}

		$scope.showLoading();

		Projects.newProject(project)
			.then(function (ref) {
				$scope.selectProject(ref.key());

			}).finally(function () {
				$scope.hideLoading();
			});

		$scope.projectModal.hide();
		project.title = '';
	};

	$scope.deleteProject = function (project) {
		console.log('deleteProject', project, project.$id);
		var confirmPopup = $ionicPopup.confirm({
			title: 'Are You Sure?',
			template: '<p>Are you sure you want to delete project?<p> ' + project.title
		});

		confirmPopup.then(function (res) {
			if (res) {
				Projects.deleteProject(project.$id).then(function (ref) {
					if ($scope.projects.length > 0) {
						$scope.selectProject($scope.projects[0].$id);
					} else {
						$scope.activeProject = { title: '', tasks: [] };
						$scope.showProjectModal();
					}
				});
			} else {
				console.log('Delete Project Cancelled');
			}
		});
		
	};
}