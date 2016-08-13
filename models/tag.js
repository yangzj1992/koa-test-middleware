/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Tag model                                                                                     */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const Lib        = require('../lib/lib.js');
const ModelError = require('./modelerror.js');

const Tag = module.exports = {};


/**
 * Returns Tag details (convenience wrapper for single Tag details).
 *
 * @param   {number} id - Tag id or undefined if not found.
 * @returns {Object} Tag details.
 */
Tag.get = function*(id) {
    const result = yield GLOBAL.db.query('Select * From et_tag Where tag_id = ?', id);
    const tag = result[0];
    return tag[0];
};

/**
 * Creates new Tag record.
 *
 * @param   {Object} values - Tag details.
 * @returns {number} New Tag id.
 * @throws  Error on validation or referential integrity errors.
 */
Tag.insert = function*(values) {
    try {
        const result = yield GLOBAL.db.query('Insert Into et_tag Set ?', values);
        //console.log('Tag.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for Tag.update - just use default MySQL messages for now
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message); // Forbidden
            case 'ER_DUP_ENTRY':
                throw ModelError(409, e.message); // Conflict
            default:
                Lib.logException('Tag.insert', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Update Tag details.
 *
 * @param  {number} id - Tag  id.
 * @param  {Object} values - Tag details.
 * @throws Error on referential integrity errors.
 */
Tag.update = function*(id, values) {
    try {
        yield GLOBAL.db.query('Update et_tag Set ? Where tag_id = ?', [values, id]);
        //console.log('Tag.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for Tag.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                Lib.logException('Tag.update', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete Tag record.
 *
 * @param  {number} id - Tag  id.
 * @throws Error on referential integrity errors.
 */
Tag.delete = function*(id) {
    try {

        yield GLOBAL.db.query('Delete From et_tag Where tag_id = ?', id);
        //console.log('Tag.delete', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            default:
                Lib.logException('Tag.delete', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
