/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Route to handle root element: return uri's for available resources & note on authentication   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')();

router.get('/', function* getRoot() {
    // root element just returns uri's for principal resources (in preferred format)
    const resources = { auth: { _uri: '/auth' }, questions: { _uri: '/questions' }, tags: { _uri: '/tags' }, types: { _uri: '/types' } };
    const authentication = '‘GET /auth’ to obtain {id, token}; subsequent requests require basic auth ‘id:token’';
    this.body = { resources: resources, authentication: authentication };
    this.body.root = 'api';
});

module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
