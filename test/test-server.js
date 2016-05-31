var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var expect = chai.expect;
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on get', function(done){
        chai.request(app)
            .get('/items')
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done){
        chai.request(app)
            .put('/items/1')
            .send({'name': 'orange'})
            .end(function(err, res){
                expect(storage.items[1].name).equal('orange');
                expect(storage.items[1].id).be.a('number');
                expect(res).have.status(200);
                done();
            });
        chai.request(app)
            .put('/items/25')
            .send({'name':'hello world'})
            .end(function(err, res){
                expect(storage.items[24].name).equal('hello world');
                expect(storage.items[24].id).be.a('number');
                expect(res).have.status(200);
                done();
            });

    });
    it('should delete an item on delete', function(done){
        chai.request(app)
            .delete('/items/2')
            .end(function(err, res){
                expect(res).have.status(200);
                expect(storage.items.length).equal(4);
                done();
            });
        chai.request(app)
            .delete('/items/10')
            .end(function(err, res){
                expect(res).have.status(204);
                expect(storage.items.length).equal(5);
                done();
            });

    });
});
