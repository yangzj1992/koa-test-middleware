/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - QuestionTag                                                                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const QuestionTag = require('../../models/question-tag.js');

const handler = module.exports = {};


handler.getQuestionTagById = function*() {
  const questionTag = yield QuestionTag.get(this.params.id);

  if (!questionTag) this.throw(404, `No question-tag ${this.params.id} found`); 

  questionTag._id = questionTag.QuestionTagId;

  this.body = questionTag;
  this.body.root = 'QuestionTag';
};

handler.postQuestionTag = function*() {
  if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
  try {
      const id = yield QuestionTag.insert(this.request.body);
      this.body = yield QuestionTag.get(id); 
      this.body.root = 'QuestionTag';
      this.set('Location', '/question-tags/'+id);
      this.status = 201;
  } catch (e) {
      this.throw(e.status||500, e.message);
  }
};

handler.updateQuestionTag = function*() {
  if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
  try {
      const id = yield QuestionTag.update(id,this.request.body);
      this.body = yield QuestionTag.get(id); 
      this.body.root = 'QuestionTag';
      this.set('Location', '/question-tags/'+id);
      this.status = 201;
  } catch (e) {
      this.throw(e.status||500, e.message);
  }
};

handler.deleteQuestionTagById = function*() {
  if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required'); 
  try {
      const questionTag = yield QuestionTag.get(this.params.id);
      if (!questionTag) this.throw(404, `No question-tag ${this.params.id} found`); 
      yield QuestionTag.delete(this.params.id);
      this.body = questionTag; 
      this.body.root = 'QuestionTag';
  } catch (e) {
      this.throw(e.status||500, e.message);
  }
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

