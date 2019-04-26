// const app = require('../server');
// const request = require('supertest');

// describe('Authentication API', () =>{

//     describe('POST /API/auth', () =>{
//         it('should return a object of a create user' , done =>{
//             request(app)
//             .post('/api/auth/sign-up')
//             .send({
//                     "nome": "teste",
//                     "email": "1234@email.com",
//                     "senha": "teste",
//                     "telefones": [
//                        {
//                            "numero": "123",
//                            "ddd": "12"
//                        }
//                     ]
//             })
//             .expect(200)
//             .end((err, res) => {
//                 console.log(res.body);
//                 if(err) {
//                     done(err);
//                     throw err;
//                 } 
//                 res.body.should.have.property('nome');
//                 done();
//             })
//         })

//     });
    
// }); 