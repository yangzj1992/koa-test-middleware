/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Type model                                                                                     */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const Lib        = require('../lib/lib.js');
const ModelError = require('./modelerror.js');

const Type = module.exports = {};


/**
 * Returns Type details (convenience wrapper for single Type details).
 *
 * @param   {number} id - Question id or undefined if not found.
 * @returns {Object} Type details.
 */
Type.get = function*(id) {
    const result = yield global.db.query('Select * From et_type Where type_id = ?', id);
    const type = result[0];
    return type[0];
};

/**
 * Creates new Type record.
 *
 * @param   {Object} values - Type details.
 * @returns {number} New Type id.
 * @throws  Error on validation or referential integrity errors.
 */
Type.insert = function*(values) {
    try {
        const result = yield global.db.query('Insert Into et_type Set ?', values);
        //console.log('Type.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for Type.update - just use default MySQL messages for now
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message); // Forbidden
            case 'ER_DUP_ENTRY':
                throw ModelError(409, e.message); // Conflict
            default:
                Lib.logException('Type.insert', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Update Type details.
 *
 * @param  {number} id - Question id.
 * @param  {Object} values - Type details.
 * @throws Error on referential integrity errors.
 */
Type.update = function*(id, values) {
    try {
        yield global.db.query('Update et_type Set ? Where type_id = ?', [values, id]);
        //console.log('Type.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for Type.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                Lib.logException('Type.update', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete Type record.
 *
 * @param  {number} id - Question id.
 * @throws Error on referential integrity errors.
 */
Type.delete = function*(id) {
    try {
        yield global.db.query('Delete From et_question_type Where type_id = ?', id);
        yield global.db.query('Delete From et_type Where type_id = ?', id);
    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            default:
                Lib.logException('Type.delete', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
