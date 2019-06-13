function GET( baseUrl, endpoint, headers, params, whatToDo, request )
{
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function()
    {
        if( this.readyState === 4 )
        {
            if( this.status >= 200 && this.status < 300 )
            {
                //Todo OK
                whatToDo( this.responseText, false, request );
            }
            else
            {
                //No salió bien
                whatToDo( this.responseText, true, request );
            }
        }
        else
        {
            //Mostrar carga
            whatToDo();
        }
    };

    var parameters = '';
    if( params )
    {
        var keys = Object.keys( params );
        for( var i = 0; i < keys.length; i++ )
        {
            var key = keys[i];
            var value = params[key];
            if( i == 0 )
                parameters += '?';
            else
                parameters += '&';

            parameters += key + '=' + value;
        }
    }
    
    ajax.open( 'GET', baseUrl + endpoint + parameters, true );
    
    if( headers )
    {
        var keys = Object.keys( headers );
        for( var i = 0; i < keys.length; i++ )
        {
            var key = keys[i];
            var value = headers[key];
            ajax.setRequestHeader( key, value );
        }
    }
    ajax.send();
}