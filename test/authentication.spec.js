'use strict';

const app = require('../server');
const request = require('supertest');
const chai = require('chai');
const faker = require('faker');

chai.should();

describe('Authentication API', () => {

  describe('GET /API', () => {
    it('should return a connect ok', (done) => {
      request(app)
        .post('/api/auth/sign-in')
        .send({ email: 'teste@email.com', senha: 'teste' })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          request(app)
            .get('/api/')
            .set('authorization', `Bearer ${res.body.token}`)
            .expect(200)
            .end((erro, resp) => {
              if (erro) {
                done(erro);
                throw erro;
              }
              resp.body.should.to.be.an('object').that.has.property('mensagem');
              done();
            });
        });
    });

  });

  describe('POST /API/auth/sign-in', () => {
    it('should return a object of a sign-in user', (done) => {

      request(app)
        .post('/api/auth/sign-in')
        .send({
          email: 'teste@email.com',
          senha: 'teste',
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          res.body.should.to.be.an('object').that.has.property('id');
          done();
        });
    });

    it('should return error 404 with wrong email', (done) => {
      request(app)
        .post('/api/auth/sign-in')
        .send({
          email: '123a4@email.com',
          senha: 'teste',
        })
        .expect(404)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          res.body.should.to.be.an('object').that.has.property('mensagem');
          done();
        });
    });
    it('should return error 401 with wrong password', (done) => {
      request(app)
        .post('/api/auth/sign-in')
        .send({
          email: '1234@email.com',
          senha: 'tesate',
        })
        .expect(401)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          res.body.should.to.be.an('object').that.has.property('mensagem');
          done();
        });
    });
  });

  describe('POST /API/auth/sign-up', () => {
    it('should return a error 400 when create a new user', (done) => {
      request(app)
        .post('/api/auth/sign-up')
        .send({
          nome: 'teste',
          email: '1234@email.com',
          senha: 'teste',
          telefones: [{
            numero: '123',
            ddd: '11',
          }],
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          res.body.should.to.be.an('object').that.has.property('mensagem');
          done();
        });
    });
    it('should return a create a new user', (done) => {
      const nome = faker.name.firstName();
      const email = faker.internet.email();
      request(app)
        .post('/api/auth/sign-up')
        .send({
          nome: nome,
          email: email,
          senha: 'teste',
          telefones: [{
            numero: '123',
            ddd: '11',
          }],
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          res.body.should.to.be.an('object').that.has.property('id');
          done();
        });
    });
  });

  describe('GET /API/user/', () => {

    it('should return a user not authorized', (done) => {
      request(app)
        .get('/api/user/id/3')
        .expect(403)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          res.body.should.to.be.an('object').that.has.property('mensagem');
          done();
        });
    });

    it('should return a user with wrong token', (done) => {
      request(app)
        .get('/api/user/id/3')
        .set('authorization', 'testToken')
        .expect(403)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          res.body.should.to.be.an('object').that.has.property('mensagem');
          done();
        });
    });

    it('should return a user with correct token', (done) => {
      request(app)
        .post('/api/auth/sign-in')
        .send({ email: 'teste@email.com', senha: 'teste' })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          request(app)
            .get('/api/user/id/5cc33a99dd16c15b8866703b')
            .set('authorization', `Bearer ${res.body.token}`)
            .expect(200)
            .end((erro, resp) => {
              if (erro) {
                done(erro);
                throw erro;
              }
              resp.body.should.to.be.an('object').that.has.property('nome');
              done();
            });
        });
    });

    it('should return a 404 error by token and invalid id', (done) => {
      request(app)
        .post('/api/auth/sign-in')
        .send({
          email: '1234@email.com',
          senha: 'teste',
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          request(app)
            .get('/api/user/id/5cc26836e78c2f0004cbde5a')
            .set('authorization', `Bearer ${res.body.token}`)
            .expect(404)
            .end((erro, resp) => {
              if (erro) {
                done(erro);
                throw erro;
              }
              resp.body.should.to.be.an('object').that.has.property('mensagem');
              done();
            });
        });
    });

    it('should return error by error id from path', (done) => {
      request(app)
        .post('/api/auth/sign-in')
        .send({
          email: '1234@email.com',
          senha: 'teste',
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          request(app)
            .get('/api/user/id/5cc26836e78c2fbde5a')
            .set('authorization', `Bearer ${res.body.token}`)
            .expect(500)
            .end((erro, resp) => {
              if (erro) {
                done(erro);
                throw erro;
              }
              resp.body.should.to.be.an('object').that.has.property('mensagem');
              done();
            });
        });
    });

    it('should return error by token of removed user', (done) => {
      request(app)
        .get('/api/user/id/5cc26836e78c2f0004cbde5b')
        .set(
          'authorization',
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        .eyJpZCI6IjVjYzI1ZGM2MTI3NDU0NmNlNDM2NTRkZiIsImlhdCI6MTU1NjI4NzYyNywiZXhwIjoxNTU2MzMwODI3fQ
        .OxqMwman0jRYZEN5rAqL7kwyqX6rj0LkqHkv3WvFEh4`
        )
        .expect(403)
        .end((err, res) => {
          if (err) {
            done(err);
            throw err;
          }
          res.body.should.to.be.an('object').that.has.property('mensagem');
          done();
        });
    });
  });
});
