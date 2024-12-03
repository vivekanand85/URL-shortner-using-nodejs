const URL = require('../model/user');

async function handleShortUrl(req, res) {
    try{
    const { nanoid } = await import('nanoid');
    const body = req.body;
    // console.log(req);
    
    console.log(body);
    
    if (!body) return res.status(400).json({ error: "url is required" });

    const shortID = nanoid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    return res.status(201).json({
        id: shortID,
    });
    }
    catch (error) {
        console.error("Error handling short URL:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


async function handleAnalitcs(req,res){
const shortId=req.params.shortId;
const result=await URL.findOne({shortId});

return res.json({
    totalClicks:result.visitHistory.length,

    analytics:result.visitHistory,
})
}
module.exports = {
    handleShortUrl,
    handleAnalitcs
};
