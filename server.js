'use strict'
const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server= express();

server.use(cors());

server.use(express.json());

const PORT=process.env.PORT;


const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/retakeexam401');
}


const currencySchema = new mongoose.Schema({
    description: String,
    toUSD: String,
    image_url: String,

});

const userSchema = new mongoose.Schema({
  emil:{type:String,unique:true},
  favArr: [currencySchema]

});

const userModel = mongoose.model('retakeexam401', userSchema);


 function seedfunction(){

   const arrOfuser=[
{
    emil:"ghaidagharaibeh@gmail.com",
favArr:[
    {
        description: "Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.",
        toUSD: "48,285.50",
        image_url: "https://m.economictimes.com/thumb/msid-79280279,width-1200,height-900,resizemode-4,imgsize-678018/bitcoin.jpg"
    }
]


},
{
    emil:"v.salvatore7.gs@gmail.com",
favArr:[
    {
        description: "Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.",
        toUSD: "48,285.50",
        image_url: "https://m.economictimes.com/thumb/msid-79280279,width-1200,height-900,resizemode-4,imgsize-678018/bitcoin.jpg"
    }
]


},



    ]

    userModel.create(arrOfuser)
}

seedfunction();


// http://localhost:3010/getDat
server.get('/getDat',getDatHandle)
async function getDatHandle(req,res){

await axios.get('https://crypto-explorer.herokuapp.com/crypto-list/')
.then((result)=>{
    res.status(200).send(result.data)
})


}


// http://localhost:3010/addDat
server.post('/addDat',addDatHandle)
async function addDatHandle(req,res){
    const {email,description,toUSD,image_url}=req.body;
    await userModel.findOne({email:email},(err,result)=>{
        if(err){res.send(err)}
        if(result){
            result.favArr.push({description:description,toUSD:toUSD,image_url:image_url})
            result.save()
            res.status(200).send('updated')
        }

    })
}


// http://localhost:3010/getFavData
server.get('/getFavData',getFavDataHandle)
async function getFavDataHandle(req,res){
    const email=req.query.email;
    await userModel.findOne({email:email},(err,result)=>{
        if(err){res.send(err)}
        if(result){
            res.status(200).send(result.favArr)
        }

    })
}


// http://localhost:3010/deleteData/id
server.delete('/deleteData/:id',deleteDataHandle)

async function deleteDataHandle(req,res){
    const email=req.query.email;
    const id=req.params.id;
    await userModel.findOne({email:email},(err,result)=>{
        if(err){res.send(err)}
        if(result){
            const newArr=result.favArr.filler(
                (item=>item._id ==id?false:true));
            result.favArr=newArr;
            result.save();
            res.send(result.favArr)
        }

    })


}


// http://localhost:3010/updateData/id
server.put('/updateData/:id',updateDataHandle)
async function updateDataHandle(req,res){
    const id=req.params.id;
    const {email,description,toUSD,image_url}=req.body;

    await userModel.findOne({email:email},(err,result)=>{
        if(err){res.send(err)}

        if(result){
            const newArr=result.favArr.map((item)=>{
                if(item._id==id){
                    item={description:description,toUSD:toUSD,image_url:image_url}
                    return iteml
                }
                else {return item}
            });
            result.favArr=newArr;
            result.save();
            res.send(result.favArr)



        }


    });



}



server.listen(PORT,()=>{
    console.log(`Iam listing to ${PORT}`)
})