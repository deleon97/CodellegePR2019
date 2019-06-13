var host = 'http://localhost:667'; //Host base del servicio de NodeJS
var music_users = '/users'; //Endpoint
var music_songs = '/music/songs';
var music_favorites = '/music/favorites';
var music_playlists = '/music/playlists';
var music_uploads = '/music/uploads';
const MAX_QUERY = 5;
const USER = 'foxy';
var _requests =
{
    myFavorites:
    { 
        list: 
        {
            name: 'Favorite Tracks',
            songs: []
        },
        endpoint: music_favorites,
        fetchingFromServer: true,
        data: []
    },
    myPlaylists:
    { 
        endpoint: music_playlists,
        fetchingFromServer: true,
        data: []
    },
    myUploads:
    { 
        endpoint: music_uploads,
        fetchingFromServer: true,
        data: []
    }
};

var Genres = 
{
    types:
    [
        { 
            name: 'Rock',
            color: 'black'
        },
        { 
            name: 'Pop',
            color: 'darkslateblue'
        },
        { 
            name: 'Jazz',
            color: 'darkmagenta'
        },
        { 
            name: 'Classic',
            color: 'brown'
        },
        { 
            name: 'Metal',
            color: 'darkred'
        },
        { 
            name: 'K-Pop',
            color: 'deeppink'
        }
    ]
};

var PlayList =
{
    name: 'unnamed playlist',
    description: 'playlist description',
    thumbnail: '',
    owner: 'owner name',
    songs: [],
    isLoading: true
};


//Traer los datos principales por default (My Songs, Favorites, Playlists... Max 5)
//Buscar datos es asíncrono
//Traer MySongs( /music/uploads )
var endpoints = Object.keys( _requests );
for( var i = 0; i < endpoints.length; i++ )
{
    var request = _requests[ endpoints[i] ];
    GET
    (
        host,
        request.endpoint,
        { initialid: 0, max: MAX_QUERY, 'x-owner': USER },
        {},
        function( result, error, request ) 
        { 
            //Estoy cargando datos
            if( !result && !error )
            {
                BackgroundControl.visible = true;
                if( request )
                    request.fetchingFromServer = true;
            }
            else if( !error )
            {
                request.fetchingFromServer = false;
                request.data = JSON.parse( result );
                BackgroundControl.visible = false;
            }
            else
            {
                request.data = [];
                request.error = 'Error';
                BackgroundControl.visible = false;
            }
        }, 
        request
    );
}

function GetPlaylistSongs( list )
{
    Home.visible = false;
    var ids = list.ids;
    PlayList.name = list.name;
    PlayList.description = list.description;
    PlayList.thumbnail = list.thumbnail;
    PlayList.owner = list.owner;
    PlayList.songs = [];
    if( list.songs )
    {
        PlayList.isLoading = false;
        PlayList.songs = list.songs;
        return;   
    }

    PlayList.isLoading = true;
    $.each( ids, function(i, id )
    {
        GET
        (
            host,
            music_songs,
            {}, //headers
            { id: id }, //parameters
            function( result, error, request ) 
            { 
                //Estoy cargando datos
                if( !result && !error )
                {
                    BackgroundControl.visible = true;
                }
                else if( !error )
                {
                    var data = JSON.parse( result );
                    PlayList.songs.push( data.data.result );
                        if( PlayList.songs.length === ids.length )
                            PlayList.isLoading = false;

                    BackgroundControl.visible = false;
                }
                else
                {
                    var data = JSON.parse( result );
                    PlayList.songs.push( data.data.result );
                    if( PlayList.songs.length === ids.length )
                        PlayList.isLoading = false;

                    BackgroundControl.visible = false;
                }
            }, 
            ''
        );
    });
}

function FindListFor( request, initialID )
{
    GET
    (
        host,
        request.endpoint,
        { initialid: initialID, max: MAX_QUERY, 'x-owner': USER },
        {},
        function( result, error, request ) 
        { 
            //Estoy cargando datos
            if( !result && !error )
            {
                BackgroundControl.visible = true;
                if( request )
                    request.fetchingFromServer = true;
            }
            else if( !error )
            {
                request.fetchingFromServer = false;
                var favorites = JSON.parse( result );
                $.each( favorites.data.data, ( i, song ) =>
                {
                    request.list.songs.push( song );
                });

                if( favorites.data.totalResults === 0 )
                {
                    BackgroundControl.visible = false;
                    GetPlaylistSongs( request.list );
                }
                else
                    FindListFor( request, favorites.data.lastIndex + 1 );
            }
            else
            {
                request.data = [];
                request.error = 'Error';
                BackgroundControl.visible = false;
            }
        }, 
        request
    );
}