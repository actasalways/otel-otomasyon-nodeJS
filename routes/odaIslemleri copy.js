const express = require('express');
const router = express.Router();

//models
const Room=require('../models/Room');

router.get('/', (req, res) => {
  res.render("odaIslemleri", {title:"Merhabalar"});
});

router.get('/new', function(req, res, next) {
    const room = new Room({
      no:101,
      dailyPrice:200,
      renterId:"5ebc1384d5cf0d124ce2b7b1"
    });

    room.save((err,data)=>{
        if(err)
        console.log(err);
        res.json(data);
    });

});


router.post('/',(req,res)=>{
  const data=req.body;

   if(data.yeni_odaNo){
    const room = new Room({
      no:data.yeni_odaNo,
      dailyPrice:data.yeni_odaGunlukUcret,
      capacityOfTheRoom: data.yeni_odaKapasite
    });

    room.save((err,data)=>{
        if(err)
        console.log(err);
        res.json(data);
    });

  }


  if(data.guncelle_ucret){
    const promise = Room.find({ 
      no : data.guncelle_odaNo
      });

    promise.then(room=>{
      res.json(room);
    }).catch((err)=>{
      res.json(err);
    });
  }


});



module.exports = router;