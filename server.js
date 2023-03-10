const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')

const app=express();

const Item=require('./schema');
const User=require('./userSchema');
const ExportedItem=require('./exported');
const ImportedItem=require('./importedItem');
const db='mongodb+srv://tushar:tushar432@cluster0.pvtih2d.mongodb.net/db2?retryWrites=true&w=majority';
// mongodb+srv://tushar:<password>@cluster0.pvtih2d.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(db,{
    // useNewUrlParser:true,
    // useCreateIndex: true,
    // useUnifiedTopology:true,
    // useFindAndModify:false
}).then(()=>{
    console.log("Connection established");
}).catch(err=>{
  console.log(err);
    console.log("Couldn't connect to database");
})

const bp=require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({extended:true}))

app.use(express.json());
app.use(cors());

app.post('/setitem',(req,res)=>{
    const p=new Item(req.body)
    const q=new ImportedItem(req.body)
    var result=200;
    p.save().then(()=>{
        console.log("added to current inventory");
    }).catch((err)=>{
      console.log("Could not add");
      res.status(500).json({ error: 'server error' });
    })
    q.save().then(()=>{
      console.log("added to importeditems");
    }).catch((err)=>{
      res.status(500).json({ error: 'server error' });
    })
    console.log(result);
    res.send(result)
})

app.get('/getimporteditems',async(req,res)=>{
  try{
    const data=await ImportedItem.find();
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  }catch{
    console.log(err);
    res.status(500).json({ error: 'server error' });
  }
})
app.get('/getitem', async (req,res,next)=>{
  try{
    const data = await Item.find();
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
app.delete('/deleteitem/:id', async(req,res)=>{
  // const count=await Item.find({_id:req.params.id}).limit(1).count()
    // if(count>0){
      const result=await Item.findByIdAndDelete(req.params.id)
    res.send("Deleetd")
    // }else{
      // res.send(0)
    // }
    
})
app.get('/getuser', async (req,res,next)=>{
    try{
      const data = await User.find();
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
  app.put('/update/:id',async (req,res)=>{
    console.log(req.params.id,req.body);
    const result=await Item.findByIdAndUpdate(req.params.id,req.body);
    res.send("Updated data"+result)
  })
  app.post('/exportitem',(req,res)=>{
    const q=new ExportedItem(req.body)
    var result=200;
    q.save().then(()=>{
      console.log("added to exported items");
    }).catch((err)=>{
      res.status(500).json({ error: 'server error' });
    })
    console.log(result);
    res.send(result)
  })
  app.get('/getexported', async (req,res,next)=>{
    try{
      const data = await ExportedItem.find();
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
  app.post('/setuser',(req,res)=>{
    const p=new User( )
    p.save().then(()=>{
        res.send("Successfully added "+p.name);
    }).catch((err)=>{
        console.log(err);
    })
})
app.listen(3001,()=>{
    console.log("Server is listening at port 3001");
})