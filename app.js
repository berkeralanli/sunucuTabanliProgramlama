//gerekli package'larin tanimlanmasi
const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { create } = require('domain');


//db baglantisi
var dbConn=mysql.createConnection({
  user:'root',
  password:'18734100',
  host:'localhost',
  database:'kullanicilar',
})

dbConn.connect((err)=>{
  if (!err) {
    console.log('Baglanti basarili')
  }else{
    console.log('baglanti hatasi'+ err)
  }
})

//register fonksiyonu olusturma 
const musteri_ekle=async(req,res) => {
  const username=req.body.username;
  const email=req.body.email;
  const password= await bcrypt.hash(req.body.password,10);
  

  dbConn.query("INSERT INTO user (username, email, password) VALUES (?,?,?)", [username,email,password], (err,results) => {
    if (err){
      console.log(err)
    }else{
      return res.status(201).json({
        success:true,
        message:'kayit basarili'
      });
    }
  });
  };

//login fonksiyonun olusturulmasi
const login=async(req,res) =>{
  const username=req.body.username;
  const password=req.body.password;
  //database username varliginin sorgusu > var ise sifre ve sonucun.sifresinin karsilastirilmasi
  dbConn.query("SELECT * FROM user WHERE username=?",[username],(err,results)=>{
    if(results.length>0){
      //bcryptin'compare fonksiyonu kullanarak karsilastirma yapilmasi
      const comparePassword=bcrypt.compare(password,results[0].password)
      //bcrpyt olmadan karsilastirma yapilmak istenirse asagidaki duz string karsilastirmasi yapilabilir === 
        //if(password === results[0].password){}

        if(comparePassword){
          return res.status(203).json({
            success:true,
            message:"Giris basarili"
          })
        }else{
          return res.status(203).json({
            success:false,
            message:"Giris basarisiz"
          })
        }
      }else{
        return res.status(203).json({
          success:false,
          message:"Kullanici adi veya sifre hatali"
        })
      }
    })
};
const musteri_getir=(req,res)=>{
  dbConn.query("SELECT username,password,eposta, FROM user",(error,result)=>{
      if(error){
          console.log("Sunucu yanıt vermiyor")
          return new Response().error500(res)
      }else{
          res.json({data:result})
      }
  })
};
const musteri_guncelle=async(req,res)=>{
  const eposta=req.params.eposta
  const username=req.body.username
  const password=req.body.password

 
      dbConn.query("UPDATE user SET username=?,password=? WHERE eposta=?",
      [username,password,eposta],(error,result)=>{
          if(error){
              console.log(error)
              return new Response().error500(res)
          }else{
              return new Response().kayit_guncelle(res)
              location.reload()
          }
      })  
}

const musteri_sil=async(req,res)=>{
  const eposta=req.params.eposta
  dbConn.query("DELETE FROM user WHERE eposta=?",[eposta],(error,result)=>{
    if(error){
      console.log("Sunucu yanıt vermiyor")
      return new Response().error500(res)
  }else{
      res.json({data:result})
  }
  })
}

//router ve app kavramlari
router.post("/musteri_ekle",musteri_ekle); //varolan degiskenin atandigi bir endpoint
router.post("/login",login);
router.get("/musteri_getir",musteri_getir);
router.delete("/musteri_sil/:eposta",musteri_sil);
router.put("/musteri_guncelle/:eposta",musteri_guncelle);


// sayfa linkleri
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,"index.html"))
})
app.get('/musteri_ekle', function (req, res) {
  res.sendFile(path.join(__dirname,"musteri_ekle.html"))
})
app.get('/musteri_sil', function (req, res) {
  res.sendFile(path.join(__dirname,"musteri_sil.html"))
})
app.get('/musteri_guncelle', function (req, res) {
  res.sendFile(path.join(__dirname,"musteri_guncelle.html"))
})
app.get('/musteri_getir', function (req, res) {
  res.sendFile(path.join(__dirname,"musteri_getir.html"))
})




//Middlewares
const PORT = 3000;
app.use(express.json({limit:'50mb',extended:true,parameterLimit:50000}));
app.use('/api',router);
app.listen(PORT);
module.exports={musteri_ekle,dbConn,login,musteri_getir,musteri_sil,musteri_guncelle};
