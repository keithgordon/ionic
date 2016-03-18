angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recommendations) {   // helper functions for loading
    var showLoading = function() {
        $ionicLoading.show({
            template: '<i class="ion-loading-c"></i>',
            noBackdrop: true
        });
    }

    var hideLoading = function() {
        $ionicLoading.hide();
    }

    // set loading to true first time while we retrieve songs from server.
    showLoading();

    // get our first songs
    Recommendations.init()
        .then(function(){
            $scope.currentSong = Recommendations.queue[0];
            Recommendations.playCurrentSong();
            hideLoading();
        });

    //fired when we favorite /skip a song.
    $scope.sendFeedback = function(bool) {
        if (bool) User.addSongToFavorites($scope.currentSong);
        $scope.currentSong.rated = bool;
        $scope.currentSong.hide = true;

        // prepare the next song
        Recommendations.nextSong();

        $timeout(function() {
        // initialize the current song
            $scope.currentSong = Recommendations.queue[0];
        }, 250);

        Recommendations.playCurrentSong();
    }

    // used for retriving the next album image.
    // if there isn't an album image available next, return empty string.
    $scope.nextAlbumImg = function() {
        if (Recommendations.queue.length > 1) {
            return Recommendations.queue[1].image_large;
        }

        return '';
    }
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
    // get the list of our favorites from the user serviec
    $scope.favorites = User.favorites;

    $scope.removeSong = function(song, index) {
        User.removeSongFromFavorites(song, index);
    }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations) {
    // stop audio when going to favorites page
    $scope.enteringFavorites = function() {
        Recommendations.haltAudio();
    }

    $scope.leavingFavorites = function() {
        Recommendations.init();
    }


});
