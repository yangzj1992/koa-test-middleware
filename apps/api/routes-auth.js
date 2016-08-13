/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Route to handle authentication /auth element                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa
const crypto = require('crypto');       // nodejs.org/api/crypto.html

router.get('/auth', function* getAuth() {
    // (middleware has already validated user at this point, just return the hashed token timestamp)

    // the stored api token is the issue timestamp; the token given out is its sha1 hash
    const token = crypto.createHash('sha1').update(this.auth.user.ApiToken).digest('hex');

    this.body = { id: this.auth.user.UserId, token: token };
    this.body.root = 'auth';
});


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
