/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Web-app integration/acceptance tests (just a few sample tests, not full coverage)              */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
const cheerio   = require('cheerio');      // core jQuery for the server
require('co-mocha');                       // enable support for generators in mocha tests using co

const app = require('../app.js');

const request = supertest.agent(app.listen());

const headers = { Host: 'admin.localhost:7010' }; // set host header

describe('Admin app'+' ('+app.env+'/'+require('../config/db-'+app.env+'.json').db.database+')', function() {

    describe('login', function() {
        let location = null;

        it('has home page with login link in nav when not logged-in', function*() {
            const response = yield request.get('/').set(headers).end();
            expect(response.status).to.equal(200, response.text);
            const $ = cheerio.load(response.text);
            expect($('title').html()).to.equal('Koa Test Middleware');
            expect($('nav ul li').length).to.equal(2); // nav should be just '/', 'login'
        });

        it('redirects to / on login', function*() {
            const values = { username: 'admin@user.com', password: 'admin' };
            const response = yield request.post('/login').set(headers).send(values).end();
            expect(response.status).to.equal(302, response.text);
            location = response.headers.location;
            expect(location).to.equal('/');
        });

        it('has home page with full nav links when logged-in', function*() {
            // get from location supplied by login
            const response = yield request.get(location).set(headers).end();
            expect(response.status).to.equal(200, response.text);
            const $ = cheerio.load(response.text);
            expect($('title').html()).to.equal('Koa Test Middleware');
            expect($('nav ul.nav>li').length).to.equal(5); // '/', 'questions' , 'tags' ,'types' , 'admin login',
        });
    });

    describe('CRUD', function() {
        let id = null;

        it('adds new question', function*() {
            const values = { use_case: 'Test', title: 'Test', description: 'Test',difficulty:'2'};
            const response = yield request.post('/questions/add').set(headers).send(values).end();
            expect(response.status).to.equal(302, response.text);
            expect(response.headers.location).to.equal('/questions');
            id = response.headers['x-insert-id'];
        });

        it('lists questions including test question', function*() {
            const response = yield request.get('/questions').set(headers).end();
            expect(response.status).to.equal(200, response.text);
            const $ = cheerio.load(response.text);
            expect($('#question'+id+' td:first-child a').html()).to.equal('Test');
        });

        it('gets details of test question', function*() {
            const response = yield request.get('/questions/'+id).set(headers).end();
            expect(response.status).to.equal(200, response.text);
            const $ = cheerio.load(response.text);
            expect($('h1').html()).to.equal('Test');
        });

        it('deletes test question', function*() {
            const response = yield request.post('/questions/'+id+'/delete').set(headers).end();
            expect(response.status).to.equal(302, response.text);
            expect(response.headers.location).to.equal('/questions');
        });
    });

    describe('ajax', function() { // NOTE THIS REQUIRES THE APP TO BE STARTED TO ACCESS THE API
        let id = null;

        it('responds (ie server running)', function*() {
            const response = yield request.get('/ajax/').set(headers).end();
            expect(response.status).to.equal(200, response.text);
            expect(response.body.resources.auth._uri).to.equal('/auth');
        });

        it('adds new question', function*() {
            const values = { use_case: 'Test', title: 'Test', description: 'Test',difficulty:'2'};
            const response = yield request.post('/ajax/questions').set(headers).send(values).end();
            expect(response.status).to.equal(201, response.text);
            expect(response.body).to.be.an('object');
            expect(response.body).to.contain.keys('use_case', 'title', 'description', 'difficulty');
            expect(response.body.difficulty).to.equal(2);
            id = response.body.question_id;
        });

        it('lists questions including test question', function*() {
            const response = yield request.get('/ajax/questions').set(headers).end();
            expect(response.status).to.equal(200, response.text);
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.length.above(1);
        });

        it('gets details of test question', function*() {
            const response = yield request.get('/ajax/questions/'+id).set(headers).end();
            expect(response.status).to.equal(200, response.text);
            expect(response.body).to.be.an('object');
            expect(response.body).to.contain.keys('use_case', 'title', 'description', 'difficulty');
            expect(response.body.difficulty).to.equal(2);
            expect(response.body.description).to.equal('Test');
        });

        it('deletes test question', function*() {
            const response = yield request.delete('/ajax/questions/'+id).set(headers).end();
            expect(response.status).to.equal(200, response.text);
            expect(response.body).to.be.an('object');
            expect(response.body).to.contain.keys('use_case', 'title', 'description', 'difficulty');
            expect(response.body.difficulty).to.equal(2);
            expect(response.body.description).to.equal('Test');
        });
    });

    describe('misc', function() {
        it('returns 404 for non-existent page', function*() {
            const response = yield request.get('/zzzzzz').set(headers).end();
            expect(response.status).to.equal(404, response.text);
            const $ = cheerio.load(response.text);
            expect($('h1').html()).to.equal(':(');
        });

        it('returns 404 for non-existent question', function*() {
            const response = yield request.get('/questions/9999999999').set(headers).end();
            expect(response.status).to.equal(404, response.text);
            const $ = cheerio.load(response.text);
            expect($('h1').html()).to.equal(':(');
        });
    });

    describe('logout', function() {
        it('logs out and redirects to /', function*() {
            const response = yield request.get('/logout').set(headers).end();
            expect(response.status).to.equal(302, response.text);
            expect(response.headers.location).to.equal('/');
        });
    });
});
