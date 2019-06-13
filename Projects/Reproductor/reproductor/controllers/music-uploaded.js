var EndpointBase = require('./endpoint-base');

class MusicUploads extends EndpointBase
{
    constructor( response, request, mongo, result )
    {
        super( response, request, mongo, result );
    }

    async GET()
    {
        if( !this.CheckHeaders( 'initialid', 'max', 'x-owner' ) )
            return;

        var initialid = parseInt( this.headers.initialid );
        var max = parseInt( this.headers.max );
        var user = this.headers['x-owner'];

        if( max <= 0 || initialid < 0 )
        {
            //Error
            this.result.data =
            {
                message: 'Invalid data type for max|initialid header',
                error: '"max" or "initialid" headers are required to be an integer',
                result: 'ERROR'
            }

            this.status = 412;
            this.FinishRequest();
            return;
        }

        var uploads = await this.SingleQueryDatabase
        (
            'MusicPlayer',
            'Uploads',
            { owner: { $regex: '^' + this.ToRegex( user ) + '$' } }
        );

        if( uploads == null )
        {
            //Error
            this.result.data =
            {
                message: 'No records found for user: ' + user,
                warning: 'No uploads for this user',
                result: {}
            }

            this.status = 404;
            this.FinishRequest();
            return;
        }

        var $or = [];
        var cancionesABuscar = 
        {
            $and: 
            [
                { id: { $gte : initialid }  }
            ]
        };
        var count = 0;
        var lastIndex = 0;

        for( var i = 0; i < uploads.songs.length; i++ )
        {
            var id = uploads.songs[i];
            lastIndex = id;
            if( count < max )
            {
                if( id >= initialid )
                {
                    $or.push( { id: id } );
                    count++;
                }
            }
            else
            {
                break;
            }
        }

        if( $or.length < 1 )
        {
            this.result.data = 
            {
                message: 'Query all uploaded tracks for user ' + user,
                lastIndex: lastIndex,
                totalResults: 0,
                data: []
            };

            this.status = 200;
            this.FinishRequest();
            return;
        }

        cancionesABuscar.$and.push( { $or: $or } );
        //$and: [ { id...}, { $or: [ { id: 2 }, { id: 3 }] } ]

        if( lastIndex === uploads.songs.length - 1 )
            lastIndex = uploads.songs.length;

        var canciones = await this.QueryDatabase
        (
            'MusicPlayer',
            'Audio',
            cancionesABuscar,
            { id: 1 },
            max
        );

        this.result.data = 
        {
            message: 'Query all uploaded tracks for user ' + user,
            lastIndex: lastIndex,
            totalResults: canciones.length,
            data: canciones
        };
        this.status = 200;
        this.FinishRequest();
        //db.Uploads.updateMany( {}, { $set: { owner: "ale" } } );
    }
}

module.exports = MusicUploads;