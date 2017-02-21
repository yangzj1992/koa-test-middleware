/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Question model                                                                                   */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const Lib        = require('../lib/lib.js');
const ModelError = require('./modelerror.js');

const Question = module.exports = {};


/**
 * Returns Question details (convenience wrapper for single Question details).
 *
 * @param   {number} id - Question id or undefined if not found.
 * @returns {Object} Question details.
 */
Question.get = function*(id) {
    const result = yield global.db.query('Select * From et_question Where question_id = ?', id);
    const questions = result[0];
    return questions[0];
};



/**
 * Creates new Question record.
 *
 * @param   {Object} values - Question details.
 * @returns {number} New Question id.
 * @throws  Error on validation or referential integrity errors.
 */
Question.insert = function*(values) {
    // validation - somewhat artificial example serves to illustrate principle
    if (values.title == null) {
        throw ModelError(403, 'title must be supplied');
    }
    try {
        const result = yield global.db.query('Insert Into et_question Set ?', values);
        //console.log('Question.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;
    } catch (e) {
        switch (e.code) {
            // recognised errors for Question.update - just use default MySQL messages for now
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message); // Forbidden
            case 'ER_DUP_ENTRY':
                throw ModelError(409, e.message); // Conflict
            default:
                Lib.logException('Question.insert', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Update Question details.
 *
 * @param  {number} id - Question id.
 * @param  {Object} values - Question details.
 * @throws Error on validation or referential integrity errors.
 */
Question.update = function*(id, values) {
     // validation - somewhat artificial example serves to illustrate principle
    if (values.title==null) {
        throw ModelError(403, 'title must be supplied');
    }

    try {

        yield global.db.query('Update et_question Set ? Where question_id = ?', [values, id]);
        //console.log('Question.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for Question.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                Lib.logException('Question.update', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete Question record.
 *
 * @param  {number} id - Question id.
 * @throws Error on referential integrity errors.
 */
Question.delete = function*(id) {
    try {
        yield global.db.query('Delete From et_question_type Where question_id = ?', id);
        yield global.db.query('Delete From et_question_tag Where question_id = ?', id);
        yield global.db.query('Delete From et_answer Where question_id = ?', id);
        yield global.db.query('Delete From et_question Where question_id = ?', id);
        //console.log('Question.delete', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
                // related record exists in Other table
                throw ModelError(403, 'question'); // Forbidden
            default:
                Lib.logException('Question.delete', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
