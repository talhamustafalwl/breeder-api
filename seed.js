const { Unit } = require("./models/Unit");
const { Category } = require("./models/Animal/Category");
const { Rotation } = require("./models/Rotation");
const mongoose = require("mongoose");
const config = require("./config/key");

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected..."))
.catch((err) => console.log(err));

dataseed()

async function dataseed(){
 // create some units of feed
  const feedunits= [
    { name: 'kilograms'}, { name: 'grams'},{ name: 'pounds'}, { name: 'boxes'},
    { name: 'bags'}, { name: 'tons'},
  ];

 
    await Unit.insertMany(feedunits).then(()=> console.log("units added"))
    .catch(err=>console.log("err unit present"))
 


  // create some categories of animals
  const categories= [
    { name: 'mammal',active:true}, { name: 'reptiles'},{ name: 'cattle',active:true}, { name: 'invertebrates'},
    { name: 'fish'}, { name: 'birds',active:true},
  ];

  await Category.insertMany(categories).then(()=> console.log("categoriess added"))
    .catch(err =>console.log("err name present"))
 

    const rotations= [
      { name: 'yearly'}, { name: 'monthly'},{ name: 'weekly'}, { name: 'daily'},
    ];
  
   
      await Rotation.insertMany(rotations).then(()=> console.log("rotations added"))
      .catch(err=>console.log("err rotations present"))
 
      

  await mongoose.connection.close()
}