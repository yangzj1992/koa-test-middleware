/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* QuestionTag model                                                                               */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const Lib        = require('../lib/lib.js');
const ModelError = require('./modelerror.js');

const QuestionTag = module.exports = {};

QuestionTag.get = function*(id) {
    const result = yield global.db.query('Select * From et_question_tag Where question_tag_id = ?', id);
    const QuestionTag = result[0];
    return QuestionTag[0];
};

QuestionTag.insert = function*(values) {
    try {
        const result = yield global.db.query('Insert Into et_question_tag Set ?', values);
        return result[0].insertId;
    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message);
            case 'ER_DUP_ENTRY':
                throw ModelError(403, `et_question_tag already exists [${values.question_id}:${values.tag_id}]`); // Forbidden
            default:
                Lib.logException('QuestionTag.insert', e);
                throw ModelError(500, e.message);
        }
    }
};

QuestionTag.update = function*(id, values) {
    try {
        const result = yield global.db.query('Update et_question_tag Set ? Where question_tag_id = ?', [values, id]);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                throw ModelError(403, e.message);
            default:
                Lib.logException('QuestionTag.update', e);
                throw ModelError(500, e.message);
        }
    }
};

QuestionTag.delete = function*(id) {
    try {
        yield global.db.query('Delete From et_question_tag Where question_tag_id = ?', id);
    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_2':
                throw ModelError(403, e.message);
            default:
                Lib.logException('QuestionTag.delete', e);
                throw ModelError(500, e.message);
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
