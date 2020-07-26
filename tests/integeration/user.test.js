const request=require('supertest');

let server;
describe('/users',()=>{
    beforeEach(()=>{
        server=require('../../index');
    });
    afterEach(()=>{
        server.close();
    })

    // Must authorization
    it("should return all users",async ()=>{
        const res =await request(server).get('/users');
        expect(res.status).toBe(403)
        expect(res.body.message).toBe("Authentication Failed")
    })


    describe("POST /", ()=>{
        // Sign up with data object --notice the inputs object restricted
        // uncommit this test signup for first time
        // you should register user for one time and commit again to more testing

        // it("should Signup  , return object success",async ()=>{
        //     const res =await request(server)
        //         .post('/users/sign_up')
        //         .send({
        //                 email:"osama11@gmail.com",
        //                 password:"123456aA@",
        //                 first_name:"Osama",
        //                 last_name:"Almadhoun",
        //                 date_birth:new Date("2009-03-09"),
        //                 is_terms:true
        //         });
        //     expect(res.status).toBe(201);
        //     console.log(res.body)
        //     expect(res.body).toMatchObject(
        //         {status:"success",
        //         message:"1 user is created"})
        //
        // })



    //log in and I assume you user is registered
        it("login , return object success",async ()=>{
            const res =await request(server)
                .post('/users/login')
                .send({
                    email:"osama11@gmail.com",
                    password:"123456aA@"
                });
            expect(res.status).toBe(200);
            expect(res.body.token).not.toBeNull();
            expect(res.body.user).not.toBeNull();
            expect(res.body).toMatchObject(
                { status:"success",
                    message:"1 user is fetched- login in success"})

        })



    })
})
