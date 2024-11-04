const express=require("express");
const cors=require("cors");
const app=express();
const config=require("./config.json");
const mongoose= require("mongoose");
const User=require('./models/user.model.js');
const Note=require('./models/note.model.js')
const jwt=require("jsonwebtoken");
const {authenticationToken}=require("./utilities.js");

require("dotenv").config();

app.use(express.json());

mongoose.connect(config.connectionString).then(()=>{console.log("connected to mongoDB")}).catch((err)=>{console.log(err.message)})

app.use(
    cors({
        origin:"*"
    })
)

app.get("/",(req,res)=>{
    res.json({data:"hello"});
})

app.post("/create-account",async(req,res)=>{
    const {fullName,email,password}=req.body;
    //console.log(fullName);
    if(!fullName) return res.status(401).json({error:true,message:"full name is required"});

    if(!email) return res.status(401).json({error:true,message:"email is required"});

    if(!password) return res.status(401).json({error:true,message:"password is required"});

    const isUser= await User.findOne({email:email});

    if(isUser){
        //console.log(isUser);
        return res.json({
            error:true,
            message:"user already exist"
        })
    }

    const user=new User({
        fullName,
        email,
        password
    })

    await user.save();

    const accessToken=jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"3600m"
    })

    return res.json({
        error:false,
        user,
        accessToken,
        message:"Registration Succesfull"
    })
    
})

app.post("/login",async(req,res)=>{
    const{email,password}=req.body;

    if(!email){
        return res.json({error:true,message:"email is required"});
    }
    if(!password){
        return res.json({error:true,message:"password is required"});
    }

    const userInfo=await User.findOne({email:email});

    if(!userInfo){
        return res.json({message:"user not foune"});
    }

    if(userInfo.email==email && userInfo.password==password){
        const user={user:userInfo};
        const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"3600m"
        })

        return res.json({
            error:false,
            message:"login successfull",
            email,
            accessToken
        })
    }else{
        return res.json({
            error:true,
            message:"Invalid credentials"
        })
    }

})

app.post("/add-note",authenticationToken,async(req,res)=>{
    // console.log("got request");
    // console.log(req.body);
    const{title,content,tags}=req.body;
    const{user}=req.user;
    
    if(!title){
        res.status(401).json({error:true,message:"title is required"})
        return;
    }

    if(!content){
        res.status(401).json({error:true,message:"content is required"})
        return;
    }
    try{
        const note=new Note({
            title,
            content,
            tags:tags ||[],
            userId:user._id
        });

        await note.save();

        return res.json({
            error:false,
            note,
            message:"Note added successfully"
        })
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"internal server error"
        })
    }

});

app.put('/edit-note/:noteId',authenticationToken,async(req,res)=>{
    const {title,content,tags,isPinned}=req.body;
    const {noteId}=req.params;
   //console.log(noteId)
    const {user}=req.user;
    if(!title && !content && !tags){
        return res.status(400).json({error:false,messge:"no changes provided"});
    }

    try{
       
        const note=await Note.findOne({_id:noteId,userId:user._id});
        //console.log(note);
        //console.log("saved");
        if(!note){
            return res.status(400).json({error:true,message:"note not found"});
        }

        if(title) note.title=title;
        if(content) note.content=content;
        if(tags) note.tags=tags;
        if(isPinned) note.isPinned=isPinned;

        await note.save();
        
        return res.json({
            error:true,
            note,
            message:"note updated succesfully"
        })

    }catch(error){
        return res.status(500).json({error:true,message:"internal server error"});
    }

})

app.get("/get-all-notes",authenticationToken,async(req,res)=>{
    const {user}=req.user;
   // console.log("got request");
    try{
        const notes=await Note.find({userId:user._id,}).sort({isPinned:-1});
        //console.log(notes);
        return res.json({
            error:false,
            notes,
            message:"all notes reveived successfully"
        })
    }catch(error){
        return res.status(500).json({error:false,message:"internal sever error"})
    }
})

app.delete("/delete-note/:noteId",authenticationToken,async(req,res)=>{
    const {noteId}=req.params;
    const {user}=req.user;


    try{
        const note=await Note.findOne({_id:noteId,userId:user._id});

        if(!note){
            return res.status(400).json({error:true, message:"note not found"});
        }

        await Note.deleteOne({_id:noteId,userId:user._id});

        return res.status(200).json({error:false,message:"note deleted successfully"});
    }catch(error){
        return res.status(500).json({error:true,message:"internal server error"});
    }
})


app.put('/update-note-isPinned/:noteId',authenticationToken,async(req,res)=>{
    const {isPinned}=req.body;
    const {noteId}=req.params;
    const {user}=req.user;
    

    try{
       
        const note=await Note.findOne({_id:noteId,userId:user._id});
        //console.log("saved");
        if(!note){
            return res.status(400).json({error:true,message:"note not found"});
        }

        
        note.isPinned=isPinned ;

        await note.save();
        
        return res.json({
            error:true,
            note,
            message:"note updated succesfully"
        })

    }catch(error){
        return res.status(500).json({error:true,message:"internal server error"});
    }

})

app.get('/get-user',authenticationToken,async (req,res)=>{
    const {user}=req.user;

    const isUser=await User.findOne({_id:user._id});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user:isUser,
        message:""
    })
})

app.get("/search-notes",authenticationToken,async(req,res)=>{
    const {user}=req.user;
    const {query}=req.query;
    //console.log(query);
    if(!query){
        return res.status(400).json({error:true,message:"search query is required"});

    }
    try{
        const matchingNotes=await Note.find({
            userId:user._id,
            $or:[{title:{$regex:new RegExp(query,"i")}},
                {content:{$regex:new RegExp(query,"i")}}
            ]

        })
        return res.json({
            error:false,
            notes:matchingNotes,
            message:"Notes matching the search query retrived successfully"

        })
        
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"internal server error"
        })
    }
})
app.listen(8000);


module.exports=app