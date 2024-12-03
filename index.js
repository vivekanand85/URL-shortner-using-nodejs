const express=require('express');
const PORT= 5070 ||8000;
const app=express();
const {connectToMongoDB}=require('./connect');
const urlRoute=require('./routes/url');
const URL = require('./model/user');

app.use(express.json());

app.use(express.urlencoded({extended:true}));


connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log('connect succesfully'))
.catch(err=>console.log("error is" ,err))


app.use("/url",urlRoute);
app.get("/:shortId",async(req,res)=>{
    try{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId,
    },
    {
        $push:{
            visitHistory:{
                Timestamp:Date.now(),
            }
        }
    },
    {new:true}
);

res.redirect(entry.redirectURL);
    }
    catch (error) {
        console.error('Error fetching or updating short URL:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(PORT,()=>{
    console.log(`app port is runnning on ${PORT}`);
    
})