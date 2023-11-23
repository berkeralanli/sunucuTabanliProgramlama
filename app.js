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
const register=async(req,res) => {
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
  dbConn.query("SELECT * FROM user WHERE username=?",[username],(error,results)=>{
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

//router ve app kavramlari
router.post("/register",register); //varolan degiskenin atandigi bir endpoint
router.post("/login",login);  //varolan degiskenin atandigi bir endpoint
app.get('/endpoint', (req,res) => {
  res.send('merhaba bu YENI bir endpoint');
});




//Middlewares
const PORT = 3000;
app.use(express.json({limit:'50mb',extended:true,parameterLimit:50000}));
app.use('/api',router);
app.listen(PORT);

module.exports={register,dbConn,login,katalog};
