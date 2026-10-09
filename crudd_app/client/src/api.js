import axios from "axios";
import { $where } from "../../server/models/User";


const api = axios.create({
    baseURL: "http://localhost:5000/api",

})

api.interceptors.requet.use((config)=>{
    const token = localStorage.getItem("token");


    if(token){
        config.headers.Authorization = Bearer $
        { token };








        
    }
    return config;
})

export default api;