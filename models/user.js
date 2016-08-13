/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* User model; users allowed to access the system                                                 */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const Lib        = require('../lib/lib.js');
const ModelError = require('./modelerror.js');

const User = module.exports = {};

User.get = function*(id) {
    const result = yield GLOBAL.db.query('Select * From User Where UserId = ?', id);
    const users = result[0];
    return users[0];
};

User.getBy = function*(field, value) {
    try {

        const sql = `Select * From User Where ${field} = ? Order By Firstname, Lastname`;

        const result = yield GLOBAL.db.query(sql, value);
        const users = result[0];

        return users;

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': throw ModelError(403, 'Unrecognised User field '+field);
            default: Lib.logException('User.getBy', e); throw ModelError(500, e.message);
        }
    }
};

User.insert = function*(values) {
    try {

        const result = yield GLOBAL.db.query('Insert Into User Set ?', values);
        //console.log('User.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for User.update - just use default MySQL messages for now
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message); // Forbidden
            case 'ER_DUP_ENTRY':
                throw ModelError(409, e.message); // Conflict
            default:
                Lib.logException('User.insert', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};

User.update = function*(id, values) {
    try {

        yield GLOBAL.db.query('Update User Set ? Where UserId = ?', [values, id]);
        //console.log('User.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
                // recognised errors for User.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                Lib.logException('User.update', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};

User.delete = function*(id) {
    try {
        yield GLOBAL.db.query('Delete From User Where UserId = ?', id);
    } catch (e) {
        switch (e.code) {
            default:
                Lib.logException('User.delete', e);
                throw ModelError(500, e.message);
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
