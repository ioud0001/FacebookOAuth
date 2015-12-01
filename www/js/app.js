// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'satellizer'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($authProvider){
	$authProvider.facebook({
		clientId: '1007694065943680',
		//redirectUri: 'http://localhost:8100'
		scope: 'email, public_profile, user_photos, user_friends',
		responseType: 'token'
	});
})

.config(function($httpProvider){
	$httpProvider.interceptors.push('httpInterceptor'); 
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
	}
   })
	
	.state('app.myFriends', {
		url: '/myFriends', 
		views: {
			'menuContent': {
				templateUrl: 'templates/friends.html',
				controller: 'MyFriendsCtrl',
				resolve: {
					friends: function($q, $rootScope, FacebookService){
						var deferred = $q.defer();
						
						FacebookService.friends($rootScope.userId)
						.success(function(data){
                            $rootScope.userId = data.id;
                            deferred.resolve(data);
                        })
                        .error(function(errorData){
                            deferred.reject(errorData);
                        });
                        
                        return deferred.promise;
                    }
                }
            }
        }
  })
							
	.state('app.me', {
    url: '/me',
    views: {
      'menuContent': {
        templateUrl: 'templates/me.html',
        controller: 'MeCtrl',
		resolve: {
			aboutMe: function($q, $rootScope, FacebookService){
				var deferred = $q.defer(); 
				
				FacebookService.me()
					.success(function(data){
							$rootScope.userId = data.id; 
							deferred.resolve(data); 
					})
					.error(function(errorData){
						deferred.reject(errorData);
					});
					
					return deferred.promise; 
			}
		}
      }
    }
});
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
