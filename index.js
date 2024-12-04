const express=require('express');
const PORT= 5070 ||8000;
const app=express();
const {connectToMongoDB}=require('./connect');
const urlRoute=require('./routes/url');
const URL = require('./model/user');
const path=require('path');
const staticRouter=require('./routes/staticRouter')
app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.set("view engine","ejs");
app.set('views',path.resolve('./views'));

// app.get("/test",async(req,res)=>{
// const allUrls=await URL.find({});
// return res.render('./home',{
//     urls:allUrls,
// })
// // return res.end(
// //     `<html> 
// //     <head></head>
// //     <body>
// //     <ol>
// //     ${allUrls.map(url=>`<li>${url.shortId}-${url.redirectURL}-${url.visitHistory.length}</li>`)}
// //     </ol>
// //     </body>
    
    
// //     </html>`
// // )
// })

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log('connect succesfully'))
.catch(err=>console.log("error is" ,err))


app.use("/url",urlRoute);
app.use("/",staticRouter)

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