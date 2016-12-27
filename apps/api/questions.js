/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - Question                                                                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const Question = require('../../models/question.js');

const handler = module.exports = {};

handler.getQuestions = function*() {
    try {
        let sql = 'Select * From et_question';
        if (this.querystring) {
            const filter = Object.keys(this.query).map(function(q) { return q + ' = :' + q; }).join(' and ');
            sql += ' Where ' + filter;
        }
        sql += ' Order By title';
        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const questions = result[0];
        if (questions.length == 0) this.throw(204);
        for (let m = 0; m < questions.length; m++) {
            questions[m] = { _id: questions[m].question_id, _uri: '/questions/' + questions[m].question_id };
        }
        this.body = questions;
        this.body.root = 'Questions';
    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Question field'); break;
            default: this.throw(e.status||500, e.message);
        }
    }
};

handler.getQuestionById = function*() {
    const question = yield Question.get(this.params.id);
    if (!question) this.throw(404, `No question ${this.params.id} found`); 
    question._id = question.question_id;
    this.body = question;
    this.body.root = 'Question';
};

handler.postQuestions = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
    try {
        const id = yield Question.insert(this.request.body);
        this.body = yield Question.get(id); 
        this.body.root = 'Question';
        this.set('Location', '/questions/'+id);
        this.status = 201; // Created
    } catch (e) {
        this.throw(e.status || 500, e.message);
    }
};

handler.patchQuestionById = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
    try {
        yield Question.update(this.params.id, this.request.body);
        this.body = yield Question.get(this.params.id);
        if (!this.body) this.throw(404, `No question ${this.params.id} found`);
        this.body.root = 'Question';
    } catch (e) {
        this.throw(e.status || 500, e.message);
    }
};

handler.deleteQuestionById = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
    try {
        const question = yield Question.get(this.params.id);
        if (!question) this.throw(404, `No question ${this.params.id} found`);
        yield Question.delete(this.params.id);
        this.body = question;
        this.body.root = 'Question';
    } catch (e) {
        this.throw(e.status || 500, e.message);
    }
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

