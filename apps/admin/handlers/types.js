/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Tags handlers (invoked by router to render templates)                                         */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const Type       = require('../../../models/type.js');
const types = module.exports = {};

types.list = function*() {
    let sql = 'Select * From et_type';
    if (this.querystring) {
        const filter = Object.keys(this.query).map(function(q) { return q+' = :'+q; }).join(' and ');
        sql += ' Where '+filter;
    }
    sql +=  ' Order By topic';

    try {
        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const types = result[0];

        const context = { types: types };
        yield this.render('templates/types-list', context);
    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Type field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

types.view = function*() {
    const type = yield Type.get(this.params.id);
    if (!type) this.throw(404, 'Type not found');

    const type_sql = `select * from et_type where type_id = ?`;
    const result = yield this.db.query(type_sql, this.params.id);
    const types = result[0];

    const context = type;
    context.types = types;
    yield this.render('templates/types-view', context);
};

types.add = function*() {
    const context = this.flash.formdata || {};
    yield this.render('templates/types-add', context);
};

types.edit = function*() {
    let type = yield Type.get(this.params.id);
    if (!type) this.throw(404, 'Type not found');
    if (this.flash.formdata) type = this.flash.formdata;

    const sqlT = `select * from et_type`;
    const resultT = yield this.db.query(sqlT, this.params.id);
    type.result = resultT[0];

    const context = type;
    yield this.render('templates/types-edit', context);
};

types.delete = function*() {
    const type = yield Type.get(this.params.id);
    if (!type) this.throw(404, 'Type not found');

    const context = type;
    yield this.render('templates/types-delete', context);
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

types.processAdd = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    try {
        const id = yield Type.insert(this.request.body);
        this.set('X-Insert-Id', id);
        this.redirect('/types');
    } catch (e) {
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};

types.processEdit = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    if ('topic' in this.request.body) {
        try {
            yield Type.update(this.params.id, this.request.body);
            this.redirect(this.url);
        } catch (e) {
            this.flash = { formdata: this.request.body, _error: e.message };
            this.redirect(this.url);
        }
    }
};

types.processDelete = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    try {
        yield Type.delete(this.params.id);
        this.redirect('/types');
    } catch (e) {
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
