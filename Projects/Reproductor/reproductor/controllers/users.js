var EndpointBase = require('./endpoint-base');

class MusicUsers extends EndpointBase
{
    constructor( response, request, mongo, result )
    {
        super( response, request, mongo, result );
    }

    async GET( user )
    {
        if( user )
        {
            user = this.ToRegex( user );
            var owner = await this.SingleQueryDatabase
            (
                'MusicPlayer',
                'Users',
                { owner: { $regex: '^' + user + '$' } }
            );
            
            this.result.data = 
            {
                message: owner != null ? 'Successful user service query' : 'User not found',
                result: owner
            };

            this.status = owner != null ? 200 : 404;
            this.FinishRequest();
        }
        else
        {
            this.result.data =
            {
                message: 'Insufficient search criteria',
                warning: '"user" parameter is required to perform this query',
                result: 'WARNING'
            }
            this.status = 406;
            this.FinishRequest();
            return;
        }
    }
}

module.exports = MusicUsers;