const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const Item = require("./schema");
const User = require("./userSchema");
const ExportedItem = require("./exported");
const ImportedItem = require("./importedItem");
// const db='mongodb+srv://tushar:tushar432@cluster0.pvtih2d.mongodb.net/db2?retryWrites=true&w=majority';
const db =
// const db='mongodb+srv://tushar:tushar432@cluster0.pvtih2d.mongodb.net/testing?retryWrites=true&w=majority';
  "mongodb+srv://tushar:tushar123@cluster0.bnlzgl7.mongodb.net/rishi?retryWrites=true&w=majority";
// mongodb+srv://tushar:<password>@cluster0.pvtih2d.mongodb.net/?retryWrites=true&w=majority
mongoose
  .connect(db, {
    // useNewUrlParser:true,
    // useCreateIndex: true,
    // useUnifiedTopology:true,
    // useFindAndModify:false
  })
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log(err);
    console.log("Couldn't connect to database");
  });

const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

//adds and item to both curent inventory and imported item if id is null and if id is given then the item with the given id is updated and also added in the imported items
app.post("/setitem", (req, res) => {
    var result = 200;
    // if(req.params.id===-1){
      const p = new Item(req.body);
  p.save()
    .then(() => {
      console.log("added to current inventory");
    })
    .catch((err) => {
      console.log("Could not add");
      res.status(500).json({ error: "server error" });
    });
    // }else{
      // const result = Item.findByIdAndUpdate(req.params.id, req.body);
      // console.log(result);
    // }
  console.log(result);
  res.send(result);
});

app.post("/setimporteditem", (req, res) => {
  const q = new ImportedItem(req.body);
  var result = 200;
  q.save()
    .then(() => {
      console.log("added to importeditems");
    })
    .catch((err) => {
      res.status(500).json({ error: "server error" });
    });
    res.send(result);
}
)
app.get("/getimporteditems", async (req, res) => {
  try {
    const data = await ImportedItem.find();
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch {
    // console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
app.get("/getitem", async (req, res, next) => {
  try {
    const data = await Item.find();
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
app.delete("/deleteitem/:id", async (req, res) => {
  const result = await Item.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});
app.delete("/deleteimporteditem/:id", async (req, res) => {
  const result = await ImportedItem.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});
app.delete("/deleteexporteditem/:id", async (req, res) => {
  const result = await ExportedItem.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});
app.get("/getuser", async (req, res, next) => {
  try {
    const data = await User.find();
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
app.put("/update/:id", async (req, res) => {
  console.log(req.params.id, req.body);
  const result = await Item.findByIdAndUpdate(req.params.id, req.body);
  res.send("Updated data" + result);
});
app.post("/exportitem", (req, res) => {
  const q = new ExportedItem(req.body);
  var result = 200;
  q.save()
    .then(() => {
      console.log("added to exported items");
    })
    .catch((err) => {
      res.status(500).json({ error: "server error" });
    });
  console.log(result);
  res.send(result);
});
app.get("/getexported", async (req, res, next) => {
  try {
    const data = await ExportedItem.find();
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
app.post("/setuser", (req, res) => {
  const p = new User();
  p.save()
    .then(() => {
      res.send("Successfully added " + p.name);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/undoExport/:id",async (req,res)=>{
  console.log(req.params.id);
  const exportedItem=await ExportedItem.findById(req.params.id);
  const inventoryItem=await Item.find({name:exportedItem.name});
  // console.log(inventoryItem[0]);
  var result=false;
  if(inventoryItem[0]){
    // console.log(inventoryItem[0]);
    const updateRes=await Item.findByIdAndUpdate(inventoryItem[0]._id, {quantity:exportedItem.quantity+inventoryItem[0].quantity});
  // console.log(updateRes);
  if(updateRes){
    result=true;
  }else{
    result=false;
  }
  }else{
    // console.log("nort exist");
    const item= Item({
      name:exportedItem.name,
      quantity:exportedItem.quantity,
      date:exportedItem.date,
      expiry:exportedItem.expiry,
      description:exportedItem.description,
      receivedBy:exportedItem.receivedBy,
      receivedFrom:exportedItem.receivedFrom
    });
    item.save()
    .then((res) => {
    })  
    .catch((err) => {
    });
    result=true;
  }
  if(result){
    const deleteRes=await ExportedItem.deleteOne({_id:req.params.id});
    console.log(deleteRes);
    console.log("done success");
    res.status(200).send({res:true,message:"Operation undone"});
  }else{
    res.status(500).send({res:false,message:"Could not undo"});
  }
  // res.send(true);
})
app.listen(3001, () => {
  console.log("Server is listening at port 3001");
});
