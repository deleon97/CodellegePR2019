var BackgroundControl = 
{
    visible: false
};


//0x7F12AC
var CurrentSong =
{
    title: '',
    author: '',
    album: '',
    thumbnail: '',
    enabled: false
};

var Home = 
{
    visible: true
};

$(function(){

    var app = new Vue(
    {
        el: '#app',
        data: 
        {
            userData: _requests,
            OpenMedia: OpenMedia,
            PlayList: PlayList,
            BackgroundControl: BackgroundControl,
            Home: Home,
            CurrentSong: CurrentSong,
            FindListFor: FindListFor,
            Genres: Genres,
        }
    });

    $('.carousel').carousel({
        interval: 5000
    });

    $( "#volume" ).slider({
        orientation: "horizontal",
        range: "min",
        max: 100,
        value: 75,
        slide: function(){
            var volume = $( '#volume' ).slider( "value" );
            if( AudioPlayer )
                AudioPlayer.volume ( volume/100 );
            //Cambiar el volumen
        },
        change: function(){
            var volume = $( '#volume' ).slider( "value" );
            //Cambiar el volumen
            if( AudioPlayer )
                AudioPlayer.volume ( volume/100 );
        }
    });

    $( "#music_time" ).slider({
        orientation: "horizontal",
        range: "min",
        max: ProgressSmothness,
        value: 0,
        slide: function()
        {
            //Cambiar la posición del audio
            if(AudioPlayer.player && IsUserMovingTime )
            {
                var position = $( '#music_time' ).slider( "value" );
                position /= ProgressSmothness; //position = position / 10;
                var newPosition = Math.floor( position * AudioPlayer.player.duration );
                AudioPlayer.player.currentTime = newPosition;
            }
        },
        change: function()
        {
            //Cambiar la posición del audio
            if(AudioPlayer.player && IsUserMovingTime )
            {
                var position = $( '#music_time' ).slider( "value" );
                position /= ProgressSmothness; //position = position / 10;
                var newPosition = Math.floor( position * AudioPlayer.player.duration );
                AudioPlayer.player.currentTime = newPosition;
            }
        }
    });
    
    $( "#music_time" ).mousedown( function(){ IsUserMovingTime = true; });
    
    $( document ).mouseup( function()
    { 
        if( IsUserMovingTime )
            setTimeout( function(){
                IsUserMovingTime = false;
            }, 70);
    });
});