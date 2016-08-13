/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Types routes                                                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')();

const types  = require('./types.js');


router.get(   '/types',       types.getTypes);
router.get(   '/types/:id',   types.getTypeById);
router.post(  '/types',       types.postTypes);
router.patch( '/types/:id',   types.patchTypeById);
router.delete('/types/:id',   types.deleteTypeById);


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
