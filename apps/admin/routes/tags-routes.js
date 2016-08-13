/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Tags routes                                                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const tags = require('../handlers/tags.js');


router.get('/tags',             tags.list);          // render list tags page
router.get('/tags/add',         tags.add);           // render add a new tag page
router.get('/tags/:id',         tags.view);          // render view tag details page
router.get('/tags/:id/edit',    tags.edit);          // render edit tag details page
router.get('/tags/:id/delete',  tags.delete);        // render delete a tag page

router.post('/tags/add',        tags.processAdd);    // process add tag
router.post('/tags/:id/edit',   tags.processEdit);   // process edit tag
router.post('/tags/:id/delete', tags.processDelete); // process delete tag


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
