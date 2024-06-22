const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const path=require("path")
const cookieParser=require('cookie-parser')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')
const multer=require('multer')


const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")

    }
    catch(err){
        console.log(err)
    }
}

dotenv.config()
app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"/images")))
// app.use(cors({origin: 'http://localhost:5173',
//     credentials: true
// }))
// const allowedOrigins = ['http://localhost:5173', 'https://blog-app-gilt-three.vercel.app', 'https://rainbow-truffle-8c842f.netlify.app'];

// const corsOptions = {
//     origin: function (origin, callback) {
//         console.log('Request Origin:', origin);
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));
var whitelist = ["http://localhost:5173", "https://steady-crepe-102dc1.netlify.app/"];
var corsOptions = { origin: whitelist, credentials: true };
app.use(cors(corsOptions));

app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

//image upload
const storage=multer.diskStorage({
     destination:(req,file,fn)=>{
        fn(null,"images")
     },
     filename:(req,file,fn)=>{
        fn(null,req.body.img)
     }
})

const upload=multer({storage:storage})
app.post('/api/upload',upload.single("file"),(req,res)=>{
    res.status(200).json("Image has been uploaded succesfully!")
})


app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("app is running on port "+process.env.PORT)
})