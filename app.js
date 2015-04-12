

var app = angular.module( "Demo", ['ngRoute','akoenig.deckgrid'] );


    // -------------------------------------------------- //
    // ----------------------------------------------//

    /*myApp.factory('UserService', function() {
      return {
        name : 'anonymous'
      };
    });*/

    // I control the root of the application.
    app.controller("AppController",
      function( $scope,$http ) {

        channelsArray = new Array("times","foxnews","reuters");

        // I hold the collection of active news_items.
        $scope.newsItems=[];
        for(i=0;i<channelsArray.length;i++)
        {
            $http.get("data/"+channelsArray[i]+".json")
              .then(function(res){
            
              $scope.newsItemsPartial = res.data.responseData.feed.entries;
              //console.log($scope.newsItemsPartial);
              //console.log($scope.newsItems);
              $scope.newsItems = $scope.newsItems.concat($scope.newsItemsPartial);                  
            });
        }


        // ---
        // PRIVATE METHODS.
        // ---
    });

    /**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    
    .when('/Channels',{
        templateUrl: 'templates/channels.html',
        controller: 'ChannelsController'
      })
      .when('/Home',{
        templateUrl: 'templates/news_items.html',
        controller: 'MainController'
      }).
      otherwise({
        redirectTo: '',
        templateUrl: 'templates/login.html',
        controller: 'MainController'
      });
}]);

/** App Factory **/

app.factory('accessFac',function(){
  var obj = {}
  this.access = false;
  obj.checkPermission = function(username,password){    //set the permission to true

    if(username == "test" && password == "test")
    {
      console.log("User Granted permission");
      this.access = true;  
    }
    
  }
  obj.getPermissionStatus = function(){
    return this.access;       //returns the users permission level 
  }
  return obj;
});

/**
 * Controls the Blog
 */

app.controller('ChannelsController', function($scope, $http){

  $scope.message = "This is the channels page";

  $http.get('data/channels.json')
          .then(function(res){
            //console.log(res.data.responseData.feed.entries);
            //$scope.newsItems = res.data.responseData.feed.entries;                
            console.log(res.data);
            $scope.channels = res.data;                
        });
  console.log("Clicked channels");
});


app.controller('MainController', function($scope){

  $scope.message = "This is the home page";
  console.log("Clicked Home");
});

/*app.controller('AuthController',$location,function($scope, $location){

    $scope.checkAuthentication = function () {
        $location.path("templates/news_items.html");
    };   

});*/

app.controller('AuthController', ['$scope', '$location',

function ($scope, $location) {

    $scope.showError = false;

    $scope.checkAuthentication = function (username,password) {

        if(username == "test" && password == "test")
        {

            console.log("User has access");

            $location.path("/Home");
        }

        else{

          $scope.showError = true;
          console.log("User doesnot have access");
        }

        
    };


}]);
