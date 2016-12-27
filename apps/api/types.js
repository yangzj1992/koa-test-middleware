/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - Types                                                                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const Type = require('../../models/type.js');

const handler = module.exports = {};

handler.getTypes = function*() {
    try {
        let sql = 'Select * From et_type';
        if (this.querystring) {
            const filter = Object.keys(this.query).map(function(q) { return q + ' = :' + q; }).join(' and ');
            sql += ' Where ' + filter;
        }
        sql += ' Order By topic';
        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const types = result[0];
        if (types.length == 0) this.throw(204);
        for (let m = 0; m < types.length; m++) {
            types[m] = { _id: types[m].type_id, _uri: '/types/' + types[m].type_id };
        }
        this.body = types;
        this.body.root = 'Types';

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Type field'); break;
            default: this.throw(e.status||500, e.message);
        }
    }
};

handler.getTypeById = function*() {
    const type = yield Type.get(this.params.id);
    if (!type) this.throw(404, `No type ${this.params.id} found`);
    type._id = type.type_id;
    this.body = type;
    this.body.root = 'Type';
};

handler.postTypes = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
    try {
        const id = yield Type.insert(this.request.body);
        this.body = yield Type.get(id);
        this.body.root = 'Type';
        this.set('Location', '/types/'+id);
        this.status = 201;
    } catch (e) {
        this.throw(e.status || 500, e.message);
    }
};

handler.patchTypeById = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
    try {
        yield Type.update(this.params.id, this.request.body);
        this.body = yield Type.get(this.params.id);
        if (!this.body) this.throw(404, `No type ${this.params.id} found`);
        this.body.root = 'Type';
    } catch (e) {
        this.throw(e.status || 500, e.message);
    }
};

handler.deleteTypeById = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
    try {
        const type = yield Type.get(this.params.id);
        if (!type) this.throw(404, `No type ${this.params.id} found`);
        yield Type.delete(this.params.id);
        this.body = type;
        this.body.root = 'Type';
    } catch (e) {
        this.throw(e.status || 500, e.message);
    }
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
