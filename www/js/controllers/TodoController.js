angular
	.module('todoApp')
	.controller('ToDoController', ToDoController);

ToDoController.$inject = ['$scope', 'Projects', '$ionicModal', '$ionicPopup'];
function ToDoController($scope, Projects, $ionicModal, $ionicPopup) {

	// Create our modal
	$ionicModal.fromTemplateUrl('templates/new-task.html', function (modal) {
		$scope.taskModal = modal;
	}, {
		scope: $scope
	});

	$scope.newTask = function () {
		console.log('ToDoController.newTask');
		$scope.taskModal.show();
	};

	$scope.closeNewTask = function () {
		console.log('ToDoController.closeNewTask');
		$scope.taskModal.hide();
	}

	$scope.createTask = function (task) {
		$scope.showLoading();
		Projects.newTask(task, $scope.activeProject.$id);

		task.title = '';

		$scope.hideLoading();
		$scope.taskModal.hide();
	}

	$scope.completeTask = function (task, taskKey) {
		console.log('task', task);
		var projectId = $scope.activeProject.$id;
		Projects.completeTask(task, projectId, taskKey);
	};

	$scope.deleteTask = function (task, key) {
		console.log('deleteTask', task, key);
		var confirmPopup = $ionicPopup.confirm({
			title: 'Are You Sure?',
			template: '<p>Are you sure you want to delete task? </p>' + task.title
		});

		confirmPopup.then(function (res) {
			if (res) {
				Projects.deleteTask($scope.activeProject.$id, key);

			} else {
				console.log('Delete Task Cancelled');
			}
		});
		
	}
}