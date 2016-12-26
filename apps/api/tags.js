/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - Tags                                                                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const Tag = require('../../models/tag.js');

const handler = module.exports = {};

handler.getTags = function*() {
    try {

        let sql = 'Select * From et_tag';
        if (this.querystring) {
            const filter = Object.keys(this.query).map(function(q) { return q+' = :'+q; }).join(' and ');
            sql += ' Where '+filter;
        }
        sql +=  ' Order By name';

        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const tags = result[0];

        if (tags.length == 0) this.throw(204);

        for (let m=0; m<tags.length; m++) {
            tags[m] = { _id: tags[m].tag_id, _uri: '/tags/'+tags[m].tag_id };
        }

        this.body = tags;
        this.body.root = 'Tags';

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Tag field'); break;
            default: this.throw(e.status||500, e.message);
        }
    }
};

handler.getTagById = function*() {
    const tag = yield Tag.get(this.params.id);

    if (!tag) this.throw(404, `No tag ${this.params.id} found`);

    tag._id = tag.tag_id;

    this.body = tag;
    this.body.root = 'Tag';
};

handler.postTags = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
    try {
        const id = yield Tag.insert(this.request.body);
        this.body = yield Tag.get(id);
        this.body.root = 'Tag';
        this.set('Location', '/tags/'+id);
        this.status = 201;
    } catch (e) {
        this.throw(e.status||500, e.message);
    }
};

handler.patchTagById = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
    try {
        yield Tag.update(this.params.id, this.request.body);
        this.body = yield Tag.get(this.params.id);
        if (!this.body) this.throw(404, `No tag ${this.params.id} found`);
        this.body.root = 'Tag';
    } catch (e) {
        this.throw(e.status||500, e.message);
    }
};

handler.deleteTagById = function*() {
    if (this.auth.user.Role != 'admin') this.throw(403, 'Admin auth required');
    try {
        const tag = yield Tag.get(this.params.id);
        if (!tag) this.throw(404, `No tag ${this.params.id} found`);
        yield Tag.delete(this.params.id);
        this.body = tag;
        this.body.root = 'Tag';
    } catch (e) {
        this.throw(e.status||500, e.message);
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
