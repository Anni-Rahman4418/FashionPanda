const express = require("express");

const router = express.Router();

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if(email === "admin@gmail.com" &&
       password === "123456"){

        return res.json({
            success:true,
            message:"Login Successful"
        });
    }

    return res.json({
        success:false,
        message:"Invalid Email or Password"
    });

});

module.exports = router;
