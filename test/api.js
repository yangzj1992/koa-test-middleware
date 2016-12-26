/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Api integration/acceptance tests (just a few sample tests, not full coverage)                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';
/* eslint no-console: 0 */
/* eslint no-unused-expressions:0 */ /* (for expect().to.be.empty ) */

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                       // enable support for generators in mocha tests using co

const app = require('../app.js');

const request = supertest.agent(app.listen());

const headers = { Host: 'api.localhost' }; // set host header (note Accept is defaulted to application/json)


describe('API'+' ('+app.env+'/'+require('../config/db-'+app.env+'.json').db.database+')', function() {
    let userId = null, userPw = null;

    describe('/auth', function() {
        it('returns 401 on missing auth header', function*() {
            const response = yield request.get('/auth').set(headers).end();
            expect(response.status).to.equal(401, response.text);
            expect(response.body).to.be.an('object');
        });

        it('returns 401 on unrecognised email', function*() {
            const response = yield request.get('/auth').set(headers).auth('xxx@user.com', 'admin').end();
            expect(response.status).to.equal(401, response.text);
            expect(response.body).to.be.an('object');
        });

        it('returns 401 on bad password', function*() {
            const response = yield request.get('/auth').set(headers).auth('admin@user.com', 'bad-password').end();
            expect(response.status).to.equal(401, response.text);
            expect(response.body).to.be.an('object');
        });

        it('returns auth details', function*() {
            const response = yield request.get('/auth').set(headers).auth('admin@user.com', 'admin').end();
            expect(response.status).to.equal(200, response.text);
            expect(response.body).to.be.an('object');
            expect(response.body).to.contain.keys('id', 'token');
            userId = response.body.id.toString();
            userPw = response.body.token;
            // console.log(userId, userPw);
        });
    });

    describe('/questions', function() {
        describe('auth checks', function() {
            it('returns 401 on unrecognised auth id', function*() {
                const response = yield request.get('/questions').set(headers).auth('999999', 'x').end();
                expect(response.status).to.equal(401, response.text);
            });

            it('returns 401 on bad auth password', function*() {
                const response = yield request.get('/questions').set(headers).auth(userId, 'bad-password').end();
                expect(response.status).to.equal(401, response.text);
                expect(response.body).to.be.an('object');
            });

            it('returns questions list', function*() {
                const response = yield request.get('/questions').set(headers).auth(userId, userPw).end();
                expect(response.status).to.equal(200, response.text);
                expect(response.body).to.be.an('array');
                expect(response.body).to.have.length.above(1);
            });

            it('returns xml', function*() {
                const hdrs = { Host: 'api.localhost', Accept: 'application/xml' }; // set host & accepts headers
                const response = yield request.get('/questions').set(hdrs).auth(userId, userPw).end();
                expect(response.status).to.equal(200, response.text);
                expect(response.text.slice(0, 38)).to.equal('<?xml version="1.0" encoding="UTF-8"?>');
            });
        });
        describe('CRUD', function() {
            let id = null;
            it('adds a question', function*() {
                const values = { use_case: 'Test', title: 'Test', description: 'Test',difficulty:'2'};
                const response = yield request.post('/questions').set(headers).auth(userId, userPw).send(values).end();
                expect(response.status).to.equal(201, response.text);
                expect(response.body).to.be.an('object');
                expect(response.body).to.contain.keys('use_case', 'title', 'description', 'difficulty');
                expect(response.body.difficulty).to.equal(2);
                expect(response.headers.location).to.equal('/questions/'+response.body.question_id);
                id = response.body.question_id;
            });

            it('gets a question', function*() {
                const response = yield request.get('/questions/'+id).set(headers).auth(userId, userPw).end();
                expect(response.status).to.equal(200, response.text);
                expect(response.body).to.be.an('object');
                expect(response.body).to.contain.keys('use_case', 'title', 'description', 'difficulty');
                expect(response.body.difficulty).to.equal(2);
                expect(response.body.description).to.equal('Test');
            });

            it('gets a question (filtered)', function*() {
                const response = yield request.get('/questions?title=Test').set(headers).auth(userId, userPw).end();
                expect(response.status).to.equal(200, response.text);
                expect(response.body).to.be.an('array');
                expect(response.body).to.have.length(1);
            });

            it('handles empty questions list', function*() {
                const response = yield request.get('/questions?title=nomatch').set(headers).auth(userId, userPw).end();
                expect(response.status).to.equal(204, response.text);
                expect(response.body).to.be.empty;
            });

            it('updates a question', function*() {
                const values = { use_case: 'Test2', title: 'Test2', description: 'Test2',difficulty:'2'};
                const response = yield request.patch('/questions/'+id).set(headers).auth(userId, userPw).send(values).end();
                expect(response.status).to.equal(200, response.text);
                expect(response.body).to.be.an('object');
                expect(response.body).to.contain.keys('use_case', 'title', 'description', 'difficulty');
                expect(response.body.description).to.equal('Test2');
            });

            it('deletes a question', function*() {
                const response = yield request.delete('/questions/'+id).set(headers).auth(userId, userPw).end();
                expect(response.status).to.equal(200, response.text);
                expect(response.body).to.be.an('object');
                expect(response.body).to.contain.keys('use_case', 'title', 'description', 'difficulty');
                expect(response.body.difficulty).to.equal(2);
                expect(response.body.description).to.equal('Test2');
            });

            it('fails to get deleted question', function*() {
                const response = yield request.get('/questions/'+id).set(headers).auth(userId, userPw).end();
                expect(response.status).to.equal(404, response.text);
                expect(response.body).to.be.an('object');
            });

            it('fails to update deleted question', function*() {
                const values = { use_case: 'Test2', title: 'Test2', description: 'Test2',difficulty:'2'};
                const response = yield request.patch('/questions/'+id).set(headers).auth(userId, userPw).send(values).end();
                expect(response.status).to.equal(404, response.text);
            });
        });
    });

    describe('misc', function() {
        it('returns 401 for non-existent resource without auth', function*() {
            const response = yield request.get('/zzzzzz').set(headers).end();
            expect(response.status).to.equal(401, response.text);
        });

        it('returns 404 for non-existent resource with auth', function*() {
            const response = yield request.get('/zzzzzz').set(headers).auth(userId, userPw).end();
            expect(response.status).to.equal(404, response.text);
        });
    });
});
