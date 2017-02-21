/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* QuestionAnswer model                                                                                     */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const Lib        = require('../lib/lib.js');
const ModelError = require('./modelerror.js');

const QuestionAnswer = module.exports = {};


/**
 * Returns QuestionAnswer details (convenience wrapper for single QuestionAnswer details).
 *
 * @param   {number} id - Question id or undefined if not found.
 * @returns {Object} QuestionAnswer details.
 */
QuestionAnswer.get = function*(id) {
    const result = yield global.db.query('Select * From et_answer Where question_id = ?', id);
    const answer = result[0];
    return answer[0];
};

/**
 * Creates new QuestionAnswer record.
 *
 * @param   {Object} values - QuestionAnswer details.
 * @returns {number} New QuestionAnswer id.
 * @throws  Error on validation or referential integrity errors.
 */
QuestionAnswer.insert = function*(values) {
    try {
        const result = yield global.db.query('Insert Into et_answer Set ?', values);
        //console.log('QuestionAnswer.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for QuestionAnswer.update - just use default MySQL messages for now
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message); // Forbidden
            case 'ER_DUP_ENTRY':
                throw ModelError(409, e.message); // Conflict
            default:
                Lib.logException('QuestionAnswer.insert', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Update QuestionAnswer details.
 *
 * @param  {number} id - Question id.
 * @param  {Object} values - QuestionAnswer details.
 * @throws Error on referential integrity errors.
 */
QuestionAnswer.update = function*(id, values) {
    try {
        yield global.db.query('Update et_answer Set ? Where question_id = ?', [values, id]);
        //console.log('QuestionAnswer.update', id, new Date); // eg audit trail?
    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for QuestionAnswer.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                Lib.logException('QuestionAnswer.update', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete QuestionAnswer record.
 *
 * @param  {number} id - Question id.
 * @throws Error on referential integrity errors.
 */
QuestionAnswer.delete = function*(id) {
    try {

        yield global.db.query('Delete From et_answer Where question_id = ?', id);
        //console.log('QuestionAnswer.delete', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            default:
                Lib.logException('QuestionAnswer.delete', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
