/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Questions routes                                                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')();

const questions = require('../handlers/questions.js');


router.get('/questions',             questions.list);          // render list questions page
router.get('/questions/add',         questions.add);           // render add a new question page
router.get('/questions/:id',         questions.view);          // render view question details page
router.get('/questions/:id/edit',    questions.edit);          // render edit question details page
router.get('/questions/:id/delete',  questions.delete);        // render delete a question page

router.post('/questions/add',        questions.processAdd);    // process add question
router.post('/questions/:id/edit',   questions.processEdit);   // process edit question
router.post('/questions/:id/delete', questions.processDelete); // process delete question


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
