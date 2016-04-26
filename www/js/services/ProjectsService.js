	angular
		.module('todoApp')
		.factory('Projects', Projects);

	Projects.$inject = ['$firebaseArray','FireBaseUrl', 'Auth'];
	function Projects($firebaseArray, FireBaseUrl, Auth) {

    var user = Auth.getuser();
    
		//set reference to firebase DB
		var projectRef = new Firebase(FireBaseUrl + '/' + user.uid + '/projects');


		//set projects equal to Firebase DB transformed to array (this will stay in sync with DB)
    var globalProjects;

		var service = {
			all: all,
			newProject: newProject,
			getLastActiveIndex: getLastActiveIndex,
			setLastActiveIndex: setLastActiveIndex,
			deleteProject: deleteProject,
			newTask: newTask,
			completeTask: completeTask,
			deleteTask: deleteTask
		};
		
		return service;

    function all() {
       globalProjects = $firebaseArray(projectRef);
			return globalProjects;
		}
		
		function deleteProject(key) {
			console.log('Projects.deleteProject', key);
			var item = globalProjects.$getRecord(key);

			return globalProjects.$remove(item).then(function(ref) {
				setLastActiveIndex('');
			});
		}

		function newProject(project) {
		    return globalProjects.$add({
				title: project.title,
				tasks: [{
					title: 'My First Task',
					completed: false
				}]
			});
		
		}
		
		function getLastActiveIndex() {
			console.log("Projects.getLastActiveIndex");
			return window.localStorage['lastActiveProject'] || '';
		}
		
		function setLastActiveIndex(key) {
			console.log("Projects.setLastActiveIndex");
			window.localStorage['lastActiveProject'] = key;
		}

		function newTask(task, projectId) {
			console.log('active project: ', globalProjects);

			var ref = globalProjects.$ref();
			console.log('ref', ref);

			var project = ref.child(projectId);
			console.log('child', project);

			var tasks = project.child('tasks');
			console.log('tasks', tasks);

			tasks.push({ title: task.title, completed: false });
		}

		function completeTask(task, projectId, taskKey) {
			var ref = globalProjects.$ref();
			console.log('ref', ref);

			var taskObj = ref.child(projectId).child('tasks').child(taskKey);
			if (task.completed) {
				task.completed = false;
			} else {
				task.completed = true;
			}

			taskObj.set(task);
		}

		function deleteTask(projectId, taskKey) {
			var ref = globalProjects.$ref();
			var taskObj = ref.child(projectId).child('tasks').child(taskKey);
			taskObj.remove();
		}
		
	}