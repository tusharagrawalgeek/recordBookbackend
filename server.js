const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')

const app=express();

const Customer=require('./schema');
const db='mongodb+srv://tushar:tushar432@cluster0.pvtih2d.mongodb.net/db2?retryWrites=true&w=majority';
mongoose.connect(db,{
    // useNewUrlParser:true,
    // useCreateIndex: true,
    // useUnifiedTopology:true,
    // useFindAndModify:false
}).then(()=>{
    console.log("Connection established");
}).catch(err=>{
    console.log("Couldn't connect to database");
})

const bp=require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({extended:true}))

app.use(express.json());
app.use(cors());

app.post('/setitem',(req,res)=>{
    const p=new Customer(req.body)
    p.save().then(()=>{
        res.send("Successfully added "+p.name);
    }).catch((err)=>{
        console.log(err);
    })
})
app.get('/getitem', async (req,res,next)=>{
  try{
    const data = await Customer.find();
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'server error' });
  }
});
// app.delete('/deleteitem/:id', async(req,res)=>{
//     const result=await Item.findByIdAndDelete(req.params.id)
//     res.json(result)
// })

app.listen(3001,()=>{
    console.log("Server is listening at port 3001");
})