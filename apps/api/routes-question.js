/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Questions routes                                                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')();

const questions = require('./questions.js');


router.get(   '/questions',     questions.getQuestions);
router.get(   '/questions/:id', questions.getQuestionById);
router.post(  '/questions',     questions.postQuestions);
router.patch( '/questions/:id', questions.patchQuestionById);
router.delete('/questions/:id', questions.deleteQuestionById);


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
