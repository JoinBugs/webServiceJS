(function () {
    var ws = {};

    this.ws = ws;
    //this.webServiceSQLJudge = ws;

    /*
		throw error if dependencies of this library are
		not before loaded.
	*/
    (function (global) {
        _.forEach('util utilAjax _'
                        .split(' '),
                            function (dependency) {
                                if (!global.hasOwnProperty(dependency))
                                    throw new Error('this library require dependecy ' + dependency);
                            });
    })
	(this);

    (function () {
        var self = this,

            IS_LOADED = false,

        getWebMethodsByUrl = function (urlWSDL, callBack) {
            var filterResponse = function (wsdl) {
                var tags = _.toArray( wsdl.querySelectorAll( '*[soapAction]' ) );
                callBack(_.map(tags.slice( tags.length / 2, tags.length ), function (ws) {
                    return ws.getAttribute('soapAction').replace('http://tempuri.org/', '');
                }));
                IS_LOADED = true;
            };

            $.ajax({
                url: urlWSDL,
                success: filterResponse
            });
        };

        this.onLoad = function( urlASMX, callBackLoad )
        {
            utilAjax.IP = urlASMX + '/';

            getWebMethodsByUrl( urlASMX + '?WSDL', function( webMethods )
            {
                _.forEach(webMethods, function (webMethod) {
                    self[webMethod] = function (callBack, args) {
                        utilAjax.post(webMethod, callBack, args);
                    };
                });
            });

            (function ready()
            {
                setTimeout( function()
                {
                    //yep not load methods
                    if( !IS_LOADED )
                        ready();
                    else
                        callBackLoad();
                }, 0);
            })();
        };
    })
	  .apply(ws);
})
  .apply(this);