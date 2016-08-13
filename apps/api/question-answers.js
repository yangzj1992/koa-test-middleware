/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - QuestionAnswer                                                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const QuestionAnswer = require('../../models/question-answer.js');

const handler = module.exports = {};

handler.getAnswerById = function*() {
    const questionAnswer = yield QuestionAnswer.get(this.params.id);
    if (!questionAnswer) this.throw(404, `No question-answer ${this.params.id} found`); 
    questionAnswer._id = questionAnswer.QuestionAnswerId;
    this.body = questionAnswer;
    this.body.root = 'QuestionAnswer';
};

handler.postAnswers = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required'); 
    try {
        const id = yield QuestionAnswer.insert(this.request.body);
        this.body = yield QuestionAnswer.get(this.request.body.question_id);
        // this.body.root = 'QuestionAnswer';
        // this.set('Location', '/question-answers/'+id);
        this.status = 201; 
    } catch (e) {
        this.throw(e.status||500, e.message);
    }
};

handler.updateAnswerById = function*() {
  if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
  try {
      const id = yield QuestionAnswer.update(this.params.id, this.request.body);
      this.body = yield QuestionAnswer.get(this.params.id); 
      this.body.root = 'QuestionAnswer';
      this.set('Location', '/question-answers/'+id);
      this.status = 201;
  } catch (e) {
      this.throw(e.status||500, e.message);
  }
};

handler.deleteAnswerById = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required'); 
    try {
        const questionAnswer = yield QuestionAnswer.get(this.params.id);
        if (!questionAnswer) this.throw(404, `No question-answer ${this.params.id} found`); 
        yield QuestionAnswer.delete(this.params.id);
        this.body = questionAnswer; 
        this.body.root = 'QuestionAnswer';
    } catch (e) {
        this.throw(e.status||500, e.message);
    }
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
