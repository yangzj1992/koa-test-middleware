/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Answer model                                                                                     */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const Lib        = require('../lib/lib.js');
const ModelError = require('./modelerror.js');

const Answer = module.exports = {};


/**
 * Returns Answer details (convenience wrapper for single Answer details).
 *
 * @param   {number} id - Question id or undefined if not found.
 * @returns {Object} Answer details.
 */
Answer.get = function*(id) {
    const result = yield GLOBAL.db.query('Select * From et_answer Where answer_id = ?', id);
    const answer = result[0];
    return answer[0];
};

/**
 * Creates new Answer record.
 *
 * @param   {Object} values - Answer details.
 * @returns {number} New Answer id.
 * @throws  Error on validation or referential integrity errors.
 */
Answer.insert = function*(id,values) {
    try {
        const result = yield GLOBAL.db.query('Insert Into et_answer Set ?', values);
        //console.log('Answer.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for Answer.update - just use default MySQL messages for now
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message); // Forbidden
            case 'ER_DUP_ENTRY':
                throw ModelError(409, e.message); // Conflict
            default:
                Lib.logException('Answer.insert', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Update Answer details.
 *
 * @param  {number} id - Question id.
 * @param  {Object} values - Answer details.
 * @throws Error on referential integrity errors.
 */
Answer.update = function*(id, values) {
    try {
        yield GLOBAL.db.query('Update et_answer Set ? Where answer_id = ?', [values, id]);
        //console.log('Answer.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for Answer.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                Lib.logException('Answer.update', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete Answer record.
 *
 * @param  {number} id - Question id.
 * @throws Error on referential integrity errors.
 */
Answer.delete = function*(id) {
    try {

        yield GLOBAL.db.query('Delete From et_answer Where answer_id = ?', id);
        //console.log('Answer.delete', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            default:
                Lib.logException('Answer.delete', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
