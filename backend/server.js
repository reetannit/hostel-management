const express=require('express');
const cors=require('cors');
const connectDB = require('./utils/db');
const cookieParser=require('cookie-parser');
const adminRoute=require('./routes/admin.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app=express();
const PORT=process.env.PORT || 3000;



app.use(
  cors({
    origin: "*", // allow all domains
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(cookieParser());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.use('/api/auth',authRoutes);

app.use('/api/user',userRoutes);

app.use('/api/admin',adminRoute)




app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);

})
