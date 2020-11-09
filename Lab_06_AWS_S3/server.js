const AWS = require('aws-sdk');
const app = require('express')()
const multer = require("multer");
const upload = multer();
const fs = require("fs");

const host = '127.0.0.1'
const port = 7000

const BUCKET_NAME = "test_bucket_lab_work";
AWS.config.update({
  region: 'ru-msk',
  endpoint: 'http://hb.bizmrg.com'
});

var s3 = new AWS.S3();


const uploadFile = (file, res) => {
  const fileContent = file.buffer;
  const params = {
    Bucket: BUCKET_NAME,
    Key: file.originalname, 
    Body: fileContent
  };

  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
      res.sendStatus(200);
  });
};

//app

app.get('/', (req, res) => {
  res.status(200).type('text/html');
  res.sendFile(__dirname + "/index.html");
})

app.post('/upload',upload.any(),(req, res) => {
  uploadFile(req.files[0], res);

})


app.post('/download',(req, res) => {
  var result = [];


  s3.listObjects({Bucket : BUCKET_NAME}, function(err, data) {

    if (err) {
      console.log("Error", err);
    } else {
      var count = 0;
      for(var i = 0; i < data.Contents.length; ++i){
       s3.getObject({Bucket: BUCKET_NAME, Key: data.Contents[i].Key}, (error, data_) => {
        result.push(Buffer.from(data_.Body).toString('base64'));

        count++;
        if(count == data.Contents.length){
          res.setHeader("Content-Type", "application/json");
          res.send(result);
        }
      });
     }

   }

 })

})



app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`)
})


