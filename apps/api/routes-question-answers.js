/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Questions routes                                                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')();

const answers = require('./question-answers.js');


router.get(   '/question-answers/:id', answers.getAnswerById);
router.post(  '/question-answers',     answers.postAnswers);
router.post(  '/question-answers/:id', answers.updateAnswerById);
router.delete('/question-answers/:id', answers.deleteAnswerById);


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
