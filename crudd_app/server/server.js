const express = require ("express");
const mongoose = require("mongoose");
const cors = require ("cors");

require("dotenv").config();

const autRoutes = require ("./routes/authRoutes")
const taskRoutes = require ("./routes/taskRoutes")

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) =>{
    res.join({ message: "Task Managemnet API is running "})
})


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


const PORT = process.env.PORT || 5000;

async function startServer(){
    try{
        if(!process.env,MONGO_URI || !process.env.JWT_SECRET){
            throw new Error("MONGO_URI and JWT_SECRET must be configured")
        }
        app.listen(PORT, ()=>{
            console.log(`Server running on http://localhost:${PORT}`);
        })
    }catch (error){
        console.error("Server startup failed:", error.message)
        process.exit(1)
    }
}


startServer();