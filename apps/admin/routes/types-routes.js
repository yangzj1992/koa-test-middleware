/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Types routes                                                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const types = require('../handlers/types.js');


router.get('/types',               types.list);          // render list types page
router.get('/types/add',           types.add);           // render add a new type page
router.get('/types/:id',           types.view);          // render view type details page
router.get('/types/:id/edit',      types.edit);          // render edit type details page
router.get('/types/:id/delete',    types.delete);        // render delete a type page

router.post('/types/add',          types.processAdd);    // process add type
router.post('/types/:id/edit',     types.processEdit);   // process edit type
router.post('/types/:id/delete',   types.processDelete); // process delete type


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
