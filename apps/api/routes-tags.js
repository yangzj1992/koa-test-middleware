/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Tags routes                                                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')();

const tags  = require('./tags.js');


router.get(   '/tags',       tags.getTags);
router.get(   '/tags/:id',   tags.getTagById);
router.post(  '/tags',       tags.postTags);
router.patch( '/tags/:id',   tags.patchTagById);
router.delete('/tags/:id',   tags.deleteTagById);


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
