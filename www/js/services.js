angular.module('starter.services', [])
.factory('FacebookService', function($auth, $http, $ionicPopup){
	
	var fbApiUrl = 'https://graph.facebook.com/v2.2';
	
	return {
			me: function(){
				if ($auth.isAuthenticated()){
					return $http.get(fbApiUrl + '/me',
						{
							params: {
								access_token: $auth.getToken(),
								fields: 'id, name, link, gender, location, website, picture, relationship_status',
								format: 'json'
							}
						});
				} else {
					$ionicPopup.alert({
						title: 'Error',
						content: 'User Not Authorized'
					}); 
				}
			},
			friends: function(userId){
				//console.log($auth.isAuthenticated() + userId);
                if ($auth.isAuthenticated() && userId){
					return $http.get(fbApiUrl + "/"+userId+"/friends",
                                     {
                        params: {
                            access_token: $auth.getToken()
                        }
                    });
                }
                else {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'User Not Authorized'
                    }); 
                }
            }
    };
})
.factory('httpInterceptor', function($q, $rootScope, $log){
	var numLoadings = 0;
		return{
				request: function(config){
					numLoadings++;
					
					// Show loader
					$rootScope.$broadcast("loader_show");
					return config || $q.when(config)
				},
				response: function(response){
						if ((--numLoadings) === 0){
							$rootScope.$broadcast("loader_hide"); 	
						}
						return response || $q.when(response) 
				},
				responseError: function(response){
					if (!(--numLoadings)){
						$rootScope.$broadcast("loader_hide"); 	
					}
					
					$rootScope.$broadcast("authentication-failed");
					
					return $q.reject(response); 
				}
		};
});