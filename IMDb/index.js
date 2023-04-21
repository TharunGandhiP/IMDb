const express=require("express");
const express=require("mongoose");
const app=express();
mongoose.connect( "mongodb://localhost:27017/search",{
    useNewUrlParser:true,useUnifiedTopology:true
},(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("successful")
    }
})

app.listen(3000,()=>{
    console.log("On port 3000")
})
