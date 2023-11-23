//  EKSTRA BIR KAC ORNEK
//Bir kullanıcının sifresini sifirlamak için bir endpoint oluşturun. Kullanıcı adını alın, veritabanında bu kullanıcıyı bulun ve eğer bulursanız, girilen newpassword degeri ile sifreyi veritabaninda güncelleyin.
const updatePassword = async(req,res)=>{
  const username=req.body.username;
  const newpassword= await bcrypt.hash(req.body.newpassword,10);
  dbConn.query("SELECT * FROM user WHERE username=?",[username],async(error,results)=>{
    if (results.length>0){
      dbConn.query("UPDATE user SET password = ? where USERNAME = ?",[newpassword,username],(err,updateResult)=>{
        if (!err){
          return res.status(203).json({
            succes:true,
            message:'sifre guncellendi'
    
          })
        }else{
          return res.status(203).json({
            success:false,
            message:'sifre guncelleme hatasi'
          })
        }
      });
    } else {
      return res.status(203).json({
        succes:false,
        message:'Kullanici bulunamadi'
      })
    };
  })
}


// Veritabaninda urunler adinda bir tablo olusturun. Tablo urun_adi, urun_fiyati ve urun_stok adinda 3 veriden olussun. Bu ürün kataloğunu cagirmak için bir endpoint yazın. Bu endpoint, veritabanında bulunan ürünlerin listesini getirecek. Her ürünün adı, fiyatı, stok durumu gibi bilgilerini içeren bir JSON formatında yanıt vermelidir."

////    VERITABANINA TABLO OLUSTURMAK 
const createTableQuery = `
  CREATE TABLE urunler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urun_adi VARCHAR(255),
    urun_fiyati INT NOT NULL,
    urun_stok INT NOT NULL
  )`;
dbConn.query(createTableQuery, (err, result)=>{
  if (err) {
    console.log('hata')
  }else{
    console.log('katlog tablosu olusturuldu')
}

});

const katalog = async(req,res) => {
  const urun_adi = req.body.urun_adi;
  const urun_fiyati = req.body.urun_fiyati;
  const urun_stok = req.body.urun_stok;

  dbConn.query("SELECT * from urunler WHERE urun_adi = ?",[urun_adi],(error,results)=>{
  if (results.length>0){
    return res.status(203).json({
      succes:true,
      message:`urun adi ${urun_adi}, urun fiyati ${results[0].urun_fiyati} urun stok, ${results[0].urun_stok}`
    })
  }else{
    return res.status(203).json({
      succes:false,
      message:'urun fiyat ve stok getirilemedi'
    })
  }
  })
}

//VERITABANINDA BIR TABLONUN OLUP OLMADIGINI GORMEK ICIN
const tablolar = dbConn.query("SHOW TABLES", (error, results) => {
   if (error) {
     console.log('Veritabanı görüntülenemedi');
   } else {
     const tables = results.map((row) => Object.values(row)[0]);
     if (tables.includes('urunler')) {
       console.log('urunler tablosu var');
     } else {
       console.log('urunler tablosu yok');
     }
   }
 });


router.put("/updatePassword",updatePassword);//varolan degiskenin atandigi bir endpoint 
router.get("/katalog",katalog);//varolan degiskenin atandigi bir endpoint 