/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* QuestionType model                                                                               */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const Lib        = require('../lib/lib.js');
const ModelError = require('./modelerror.js');

const QuestionType = module.exports = {};

QuestionType.get = function*(id) {
    const result = yield global.db.query('Select * From et_question_type Where question_id = ?', id);
    const QuestionType = result[0];
    return QuestionType[0];
};

QuestionType.insert = function*(values) {
    try {
        const result = yield global.db.query('Insert Into et_question_type Set ?', values);
        return result[0].insertId;
    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message);
            case 'ER_DUP_ENTRY':
                throw ModelError(403, `et_question_type already exists [${values.question_id}:${values.tag_id}]`); // Forbidden
            default:
                Lib.logException('QuestionType.insert', e);
                throw ModelError(500, e.message);
        }
    }
};

QuestionType.update = function*(id, values) {
    try {
        const result = yield global.db.query('Update et_question_type Set type_id = ? Where question_id = ?', [values, id]);
        return id;
    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                throw ModelError(403, e.message);
            default:
                Lib.logException('QuestionType.update', e);
                throw ModelError(500, e.message);
        }
    }
};

QuestionType.delete = function*(id) {
    try {
        yield global.db.query('Delete From et_question_type Where question_id = ?', id);
    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_2':
                throw ModelError(403, e.message);
            default:
                Lib.logException('QuestionType.delete', e);
                throw ModelError(500, e.message);
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
