const { check } = require('express-validator');
let EmailMatch=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

const checkInputUser=()=>{
    return [
        check('first_name')
            .not()
            .isEmpty()
        ,
        check('date_birth')
            .not()
            .isEmpty()
        ,
        check('is_terms')
            .not()
            .isEmpty().isBoolean()
        ,
        check('email')
            .normalizeEmail() // Test@test.com => test@test.com
            .isEmail(),
        check('password',
            "Password must:8 characters , one number," +
            "one special character , one upper character " +
            ", one lower character").matches(EmailMatch)

    ]
}

module.exports={checkInputUser}
