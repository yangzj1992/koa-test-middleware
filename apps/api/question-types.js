/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - QuestionType                                                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const QuestionType = require('../../models/question-type.js');

const handler = module.exports = {};

handler.getQuestionTypeById = function*() {
    const questionType = yield QuestionType.get(this.params.id);
    if (!questionType) this.throw(404, `No question-type ${this.params.id} found`); 
    questionType._id = questionType.QuestionTypeId;
    this.body = questionType;
    this.body.root = 'QuestionType';
};

handler.postQuestionTypes = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required'); 
    try {
        const id = yield QuestionType.insert(this.request.body);
        this.body = yield QuestionType.get(this.request.body.question_id);
        this.body.root = 'QuestionType';
        this.set('Location', '/question-types/'+id);
        this.status = 201; 
    } catch (e) {
        this.throw(e.status||500, e.message);
    }
};

handler.updateQuestionTypes = function*() {
  if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
  try {
      const id = yield QuestionType.update(this.params.id, this.request.body.type_id);
      this.body = yield QuestionType.get(this.params.id); 
      // this.body.root = 'QuestionType';
      // this.set('Location', '/question-types/'+id);
      this.status = 201;
  } catch (e) {
      this.throw(e.status||500, e.message);
  }
};

handler.deleteQuestionTypeById = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required'); 
    try {
        const questionType = yield QuestionType.get(this.params.id);
        if (!questionType) this.throw(404, `No question-type ${this.params.id} found`); 
        yield QuestionType.delete(this.params.id);
        this.body = questionType; 
        this.body.root = 'QuestionType';
    } catch (e) {
        this.throw(e.status||500, e.message);
    }
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
