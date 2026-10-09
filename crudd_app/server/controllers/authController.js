const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

function createToken(User){
    return jwt.sign(
        {
            id: user ._id.toString(),
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d"}
    );
}

exports.register = async (req, res)=>{
    try{
        const {name, email, password, role, adminKey} = req.body;
        if (!name?.trim() || !email?.trim || !password.trim){
            return res.status(400).json({
                message: "Please provide name, email and password",
            })
        }

        if (password.length < 6){
            return res.status(400).json({
                message: "Password must contain atleast 6 characters"
            })
        }
            const normalizedEmail = email.trim().toLowerCase();


            const existingUser = await User.findOne({
                email: normalizedEmail,
            })

            if (existingUser){
                return res.status(409).json({
                    message: "Email already registered",

                })
            }

            let assignedRole = "user";

            if (role === "admin"){
                if(
                    !process.env.ADMIN_REGISTRATION_KEY ||
                    adminKey !== process.env.ADMIN_REGISTRATION_KEY

                ){
                    return res.status(403).json({
                        message: "Valid admin registration key required",

                    })
                }

                assignedRole ="admin";
            }else if(role && role !== "user"){
                return res.status(400).json({
                    message: "invalid role"
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10);


            const user = await User.create({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: assignedRole
            })


            const token = createToken(user);
            return res.status(201).json({
                message: "Registration successfull",
                token,
                user:{
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,

                },

    
            });


    }catch (error){
        if(error.code === 1100){
            return res.status(409).json({
                message: "Email is already registered",

            })
        }
        console.error(error);
        return res.status(500).json({
            message: "Registration failed",
        })
    }
};

exports.login = async (req, res) =>{
    try{
        const { email, password } = req.body;
        if(!email?.trim() || !password){
            return res.status(400).json({
                message: "Please provide email and password",
            })

        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        });
        if(!user){
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }


        const token = createToken(user);

        return res.status(200).json({
            message:"Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })

    }catch (error){
        console.error(error)
            return res.status(500).json({
                message: "Login Failed",
            })
        }
    }
    
