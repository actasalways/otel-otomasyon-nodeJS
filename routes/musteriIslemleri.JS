'use strict'

var express = require('express');
var router = express.Router();

//models
const Customer=require('../models/Customer');
const Room=require('../models/Room');


router.get('/ekle',(req,res)=>{
    const promise=Room.find({ isUsable:true });
    promise.then((rooms)=>{
      res.render('musteriEkle',{rooms , isAdmin:req.session.isAdmin});
      //res.json(room)
    }).catch((err)=>{
      res.json(err);
    });

}); 

router.post('/ekle',(req,res)=>{
  const data =req.body;
  if(data.isPaymentReceived=="on"){
    data.isPaymentReceived=true;
   }

   const customer=new Customer({
    name: data.name,
    surname:data.surname,
    tcno:data.tcno,
    telno:data.telno,
    roomNo:data.roomNo,
    payment:data.payment,
    isPaymentReceived:data.isPaymentReceived,
    entryTime:data.entryTime,
    outTime:data.outTime,
   });

    const promise = customer.save();
    promise.then(data=>{
      res.redirect('/musteri/listele');
    })
    .then(()=>{
      Room.findOneAndUpdate({ no: customer.roomNo },{
              isUsable:false,
              renterTc:data.tcno
            });

    })
    .catch(err=>{
      res.json(err);
    });
});

router.get('/guncelle',(req,res)=>{
  const promise=Room.find({ isUsable:true });
  promise.then((rooms)=>{
    res.render('musteriGuncelle',{rooms});
  }).catch((err)=>{
    res.json(err);
  });

});

router.post('/guncelle',(req,res)=>{
  const data=req.body;
  //res.json(data);

  if(data.isPaymentReceived=="on"){
    data.isPaymentReceived=true;
   }

   const promise=Customer.find({ tcno: data.guncellenecekTc });

   promise.then(Room.findOneAndUpdate({ no: 111  },{ isUsable: true },(err,room)=>{
     if(err)
     res.json(err)
   }))
   .then(Room.findOneAndUpdate({ no: 102  },{isUsable: false },(err,room)=>{
    if(err)
    res.json(err)
    res.render('musteriGuncelle',{ mesaj:"Güncelleme Başarılı"});
  }))
  .catch((err)=>{
    res.json(err);
  });



  // promise.then(
  //   Customer.findOne({ 
  //   tcno: data.guncellenecekTc
  //  }).findOneAndUpdate({
  //   name: data.ad,
  //   surname: data.soyad,
  //   tcno: data.tcno,
  //   roomNo: 103,
  //   telno:data.telno,
  //   entryTime: data.entryTime,
  //   outTime: data.outTime,
  //   payment: data.ucret,
  //   isPaymentReceived: data.isPaymentReceived
  // }), (err,data)=>{
  //   if(err)
  //     res.json(err);
  // })
    // .catch((err)=>{
    //     res.json(err);
    //   });
});

router.get('/',(req,res)=>{
  if(req.session.isAdmin){
    res.render('musteriIslemleri',{ isAdmin:req.session.isAdmin });
  }
  else{
    res.render('index',{ isAdmin:req.session.isAdmin });
  }
});

router.get('/listele',(req,res)=>{
  const promise=Customer.find({  }).sort({'roomNo' : 1 });
  //oda numarasına göre sıralar
  promise.then((customer)=>{
    res.render('musteriListele',{ customer, isAdmin:req.session.isAdmin});
  }).catch((err)=>{
    res.json(err);
  });

});


router.post('/ara',(req,res)=>{
  const data= req.body;
  let aranacak=data.tcno
  const promise=Customer.find({
    tcno: /aranacak/
   });

  promise.then((customer)=>{
    res.render('musteriListele', { isAdmin:req.session.isAdmin , customer } )
    }).catch((err)=>{
    res.json(err);
  });
});


module.exports = router;
