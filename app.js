

var app = angular.module( "Demo", [
              'ngRoute',
              'akoenig.deckgrid',
              'ngStorage'
          ]);



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
        controller: 'AppController'
      })
      .when('/Logout',{
        templateUrl: 'templates/login.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '',
        templateUrl: 'templates/login.html',
        controller: 'MainController'
      });
}]);

/** Root Scope **/
app.run(function($rootScope,$localStorage) {

    //$rootScope.$isLoggedIn = false;

    $rootScope.$storage = $localStorage;

    $rootScope.$storage = $localStorage.$default({

          isLoggedIn : false,

          channelsLocalArray:["Washington Post","Wall Street Journal","New York Times","Fox News","Reuters","Times of India"]
    });

    $rootScope.channelsForUser = function(param) {
        return param;
    }

    $rootScope.getFileName = function(channelName){

      switch(channelName){

        case "Washington Post" : return "washingtonpost"; break;
        case "Wall Street Journal" : return "wsj"; break;
        case "New York Times" : return "nyt"; break;
        case "Fox News" : return "foxnews"; break;
        case "Reuters" : return "reuters"; break;
        case "Times of India" : return "times"; break;
      }
    }
});

/** Controls the Login **/
app.controller('AuthController', ['$scope', '$localStorage' ,'$location',

function ($scope, $localStorage, $location) {

    $scope.showError = false;

    $scope.checkLoginStatus = function(){

      return $localStorage.isLoggedIn;
      console.log($localStorage.isLoggedIn);
    }

    $scope.checkAuthentication = function (username,password) {

        if(username == "test" && password == "test")
        {

            console.log("User has access");

            $localStorage.isLoggedIn = true;

            $location.path("/Home");
        }

        else{

          $scope.showError = true;
          console.log("User doesnot have access");
        }

        
    };
}]);

/** Controls the news display page **/

app.controller("AppController",
      function( $scope, $localStorage, $http ) {

      $scope.init = function(){

        console.log("In init function");
        console.log($localStorage.channelsLocalArray);
      }

        $scope.channelsArray = $localStorage.channelsLocalArray;

        // I hold the collection of active news_items.
        $scope.newsItems=[];
        for(i=0;i<$scope.channelsArray.length;i++)
        {
            $http.get("data/"+$scope.getFileName($scope.channelsArray[i])+".json")
              .then(function(res){
            
              $scope.newsItemsPartial = res.data.responseData.feed.entries;
            
              $scope.newsItems = $scope.newsItems.concat($scope.newsItemsPartial);               
            });
        }
});

/**
 * Controls the Channels
 */

app.controller('ChannelsController', ['$scope', '$localStorage', '$http',

function ($scope, $localStorage, $http) {

    $scope.init = function(){

        console.log("In init function");
    }

  $scope.message = "This is the channels page";

  $http.get('data/channels.json')
          .then(function(res){

            $scope.channels = res.data;                
  });

    $scope.addChannel = function addChannel(channelName) {

            var newChannel = channelName;
            $localStorage.channelsLocalArray = $localStorage.channelsLocalArray.concat(channelName);
    }

    $scope.deleteChannel = function deleteChannel(channelName) {

            var index = $localStorage.channelsLocalArray.indexOf(channelName);

            if (index > -1) {
                $localStorage.channelsLocalArray.splice(index, 1);
            }         
    }

    $scope.isChannel = function isChannel(channelName) {

      var index = $localStorage.channelsLocalArray.indexOf(channelName);
      if(index > -1) return true; else return false;
    }

}]);


app.controller('MainController', function($scope,$localStorage){

  console.log("In Main Controller");

  $localStorage.isLoggedIn = false;
  
});


