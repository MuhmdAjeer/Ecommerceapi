const request = require('supertest');
const app = require('./server');


describe('api', () => {

    it('test',()=>{
        return request(app).get('/api/v1').expect(201)
    })

    // it('index route', () => {
    //     return request(app)
    //         .post('/api/v1/register')
    //         .expect('Content-Type',/json/)
    //         .expect(200)
    //         .then((response)=>{

    //         })
    // })
})