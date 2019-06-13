const ProgressSmothness = 10000;
var TimeChanged = false;
var IsUserMovingTime = false;
var AudioPlayer = 
{
    player: undefined,
    open: function( source )
    {
        if( AudioPlayer.player )
            AudioPlayer.player.load();

        AudioPlayer.player = new Audio( source );
        //Si termina de reproducirse el audio...
        //Cambiar el ícono
        AudioPlayer.player.onended = function()
        {
            $('.playButton').html( 'play_arrow' );
        };

        AudioPlayer.player.ontimeupdate = function()
        {
            if( IsUserMovingTime )
                return;

            var position = ( AudioPlayer.player.duration - AudioPlayer.player.currentTime ) / AudioPlayer.player.duration;
            position *= ProgressSmothness;
            position = Math.floor( ProgressSmothness - position );
            $( '#music_time' ).slider( "value", position );
        };

        AudioPlayer.player.volume = $( '#volume' ).slider( "value" )/100;
        AudioPlayer.player.play();
        $('.playButton').html( 'pause' );
    },
    volume: function( volume )
    {
        if( AudioPlayer.player )
            AudioPlayer.player.volume = volume;
    },
    isPlaying: function()
    {
        if( AudioPlayer.player )
            return !AudioPlayer.player.paused; //revisa si se está reproduciendo algo
        
        return false;
    },
    play: function( button )
    {
        if( AudioPlayer.isPlaying() )
        {
            AudioPlayer.player.pause();
            button.innerHTML = 'play_arrow';
            //Cambiar el ícono al de PLAY
        }
        else
        {
            if( AudioPlayer.player )
            {
                AudioPlayer.player.play();
                button.innerHTML = 'pause';
                //Cambiar el ícono al de PAUSE
            }
        }
    }
};

function OpenMedia( source, type )
{
    if( type === 'A' ) //Refers to audio
    {
        CurrentSong.enabled = true;
        CurrentSong.title = source.title;
        CurrentSong.author = source.author;
        CurrentSong.album = source.album;
        CurrentSong.thumbnail = source.thumbnail;
        AudioPlayer.open( source.location );
    }
    else //Refers to playlist
    {
        GetPlaylistSongs( source );
    }
}

function GetMediaFromList( playlist, index, type )
{
    if( type == 'next' )
        if( index < playlist.length - 1 )
            OpenMedia( playlist[index + 1], 'A' );
     
    else if( type == 'prev' )
        if( index > 0 )
            OpenMedia( playlist[index - 1], 'A' );
}