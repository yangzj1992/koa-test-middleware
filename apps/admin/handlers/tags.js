/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Tags handlers (invoked by router to render templates)                                         */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const Tag       = require('../../../models/tag.js');
const tags = module.exports = {};

tags.list = function*() {
    let sql = 'Select * From et_tag';
    if (this.querystring) {
        const filter = Object.keys(this.query).map(function(q) { return q+' = :'+q; }).join(' and ');
        sql += ' Where '+filter;
    }
    sql +=  ' Order By name';
    try {
        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const tags = result[0];

        const context = { tags: tags };
        yield this.render('templates/tags-list', context);
    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Tag field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

tags.view = function*() {
    const tag = yield Tag.get(this.params.id);
    if (!tag) this.throw(404, 'Tag not found');

    const tag_sql = `select * from et_tag where tag_id = ?`;
    const result = yield this.db.query(tag_sql, this.params.id);
    const tags = result[0];

    const context = tag;
    context.tags = tags;
    yield this.render('templates/tags-view', context);
};

tags.add = function*() {
    const context = this.flash.formdata || {};
    yield this.render('templates/tags-add', context);
};

tags.edit = function*() {
    let tag = yield Tag.get(this.params.id);
    if (!tag) this.throw(404, 'Tag not found');
    if (this.flash.formdata) tag = this.flash.formdata;

    const sqlT = `select * from et_tag;`;
    const resultT = yield this.db.query(sqlT, this.params.id);
    tag.result = resultT[0];

    const context = tag;
    yield this.render('templates/tags-edit', context);
};

tags.delete = function*() {
    const tag = yield Tag.get(this.params.id);
    if (!tag) this.throw(404, 'Tag not found');

    const context = tag;
    yield this.render('templates/tags-delete', context);
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

tags.processAdd = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    try {
        const id = yield Tag.insert(this.request.body);
        this.set('X-Insert-Id', id);
        this.redirect('/tags');
    } catch (e) {
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};

tags.processEdit = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    if ('name' in this.request.body) {
        try {
            yield Tag.update(this.params.id, this.request.body);
            this.redirect(this.url);
        } catch (e) {
            this.flash = { formdata: this.request.body, _error: e.message };
            this.redirect(this.url);
        }
    }
};

tags.processDelete = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    try {
        yield Tag.delete(this.params.id);
        this.redirect('/tags');
    } catch (e) {
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
