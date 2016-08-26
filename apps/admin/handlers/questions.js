/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Question handlers (invoked by router to render templates)                                      */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const Question     = require('../../../models/question.js');
const QuestionTag  = require('../../../models/question-tag.js');
const QuestionType = require('../../../models/question-type.js');
const Answer       = require('../../../models/question-answer.js');

const questions = module.exports = {};

questions.list = function*() {
    let sql = 'Select * From et_question';
    if (this.querystring) {
        const filter = Object.keys(this.query).map(function(q) { return q+' = :'+q; }).join(' and ');
        sql += ' Where '+filter;
    }
    sql +=  ' Order By title';
    try {
        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const questions = result[0];
        const context = { questions: questions };
        yield this.render('templates/questions-list', context);
    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Question field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

questions.view = function*() {
    const question = yield Question.get(this.params.id);
    if (!question) this.throw(404, 'Question not found');

    const tag_sql = `select * from et_tag,et_question_tag where et_tag.tag_id = et_question_tag.tag_id and question_id = ?`;
    const tag_result = yield this.db.query(tag_sql, this.params.id);
    const tags = tag_result[0];

    const type_sql = `select * from et_type,et_question_type where et_type.type_id = et_question_type.type_id and question_id = ?`;
    const type_result = yield this.db.query(type_sql, this.params.id);
    const types = type_result[0];

    const answer_sql = `select answer_id, answer, question_id from et_answer inner join et_question using (question_id) where question_id = ?`;
    const answer_result = yield this.db.query(answer_sql, this.params.id);
    const answers = answer_result[0];

    const question_sql = `select * from et_question where question_id = ?`;
    const question_result = yield this.db.query(question_sql, this.params.id);
    const questions = question_result[0];

    const context = question;
    context.tags = tags;
    context.types = types;
    context.questions = questions;
    context.answers = answers;
    yield this.render('templates/questions-view', context);
};

questions.add = function*() {
    const context = this.flash.formdata || {};
    yield this.render('templates/questions-add', context);
};

questions.edit = function*() {
    let question = yield Question.get(this.params.id);
    if (!question) this.throw(404, 'Question not found');
    if (this.flash.formdata) question = this.flash.formdata;

    const tag_sql = `select * from et_tag,et_question_tag where et_tag.tag_id = et_question_tag.tag_id and question_id = ?`;
    const tag_result = yield this.db.query(tag_sql, this.params.id);
    question.questionOfTags = tag_result[0];

    const type_sql = `select * from et_type,et_question_type where et_type.type_id = et_question_type.type_id and question_id = ?`;
    const type_result = yield this.db.query(type_sql, this.params.id);
    question.questionOfTypes = type_result[0];

    const answer_sql = `select answer_id, answer,answer_des, question_id from et_answer inner join et_question using (question_id) where question_id = ?`;
    const answer_result = yield this.db.query(answer_sql, this.params.id);
    question.questionOfAnswer = answer_result[0];

    const question_sql = `select * from et_question where question_id = ?`;
    const question_result = yield this.db.query(question_sql, this.params.id);
    question.question = question_result[0];

    let tags = question.questionOfTags.map(function(t) { return t.tag_id; });
    if (tags.length == 0) tags = [0];
    const sqlTags = `select * from et_tag Where tag_id Not In (${tags.join(',')}) Order By name`;
    const resultTags = yield this.db.query(sqlTags, tags);
    question.notquestionOfTags = resultTags[0];

    let types = question.questionOfTypes.map(function(t) { return t.type_id; });
    if (types.length == 0) types = [0];
    const sqlTypes = `select * from et_type Where type_id Not In (${types.join(',')}) Order By topic`;
    const resultTypes = yield this.db.query(sqlTypes, types);
    question.notquestionOfTypes = resultTypes[0];

    const context = question;
    yield this.render('templates/questions-edit', context);
};

questions.delete = function*() {
    const question = yield Question.get(this.params.id);
    if (!question) this.throw(404, 'Question not found');

    const context = question;
    yield this.render('templates/questions-delete', context);
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

questions.processAdd = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    try {
        const id = yield Question.insert(this.request.body);
        this.set('X-Insert-Id', id);
        this.redirect('/questions');
    } catch (e) {
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};

questions.processEdit = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    if ('title' in this.request.body) {
        try {
            yield Question.update(this.params.id, this.request.body);
            this.redirect(this.url);
        } catch (e) {
            this.flash = { formdata: this.request.body, _error: e.message };
            this.redirect(this.url);
        }
    }

    if ('add-tag' in this.request.body) {
        const values = {
            question_id: this.params.id,
            tag_id:   this.request.body['add-tag'],
        };
        try {
            const id = yield QuestionTag.insert(values);
            this.set('X-Insert-Id', id);
            this.redirect(this.url);
        } catch (e) {
            this.flash = { formdata: this.request.body, _error: e.message };
            this.redirect(this.url);
        }
    }

    if ('add-types' in this.request.body) {
        const values = {
            question_id: this.params.id,
            type_id:   this.request.body['add-type'],
        };
        try {
            const id = yield QuestionType.insert(values);
            this.set('X-Insert-Id', id);
            this.redirect(this.url);
        } catch (e) {
            this.flash = { formdata: this.request.body, _error: e.message };
            this.redirect(this.url);
        }
    }

    if ('del-tag' in this.request.body) {
        try {
            yield QuestionTag.delete(this.request.body['del-tag']);
            this.redirect(this.url);
        } catch (e) {
            this.flash = { _error: e.message };
            this.redirect(this.url);
        }
    }

    if ('del-type' in this.request.body) {
        try {
            yield QuestionType.delete(this.request.body['del-type']);
            this.redirect(this.url);
        } catch (e) {
            this.flash = { _error: e.message };
            this.redirect(this.url);
        }
    }
};

questions.processDelete = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    try {
        yield Question.delete(this.params.id);
        this.redirect('/questions');
    } catch (e) {
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
