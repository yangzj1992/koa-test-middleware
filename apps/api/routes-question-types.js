/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Question-types routes                                                                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')();

const types  = require('./question-types.js');


router.get(   '/question-types/:id',   types.getQuestionTypeById);
router.post(  '/question-types',       types.postQuestionTypes);
router.post(  '/question-types/:id',   types.updateQuestionTypes);
router.delete('/question-types/:id',   types.deleteQuestionTypeById);


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
