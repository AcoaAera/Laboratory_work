const app = require('express')()
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const {exec} = require("child_process");
var uniqid = require('uniqid');

var querystring = require('querystring');
var request = require('request');

const host = '127.0.0.1'
const port = 7000



app.get('/', (req, res) => {
	res.status(200).type('text/html');
	res.sendFile(__dirname + "/index.html");
})



app.post('/upload',upload.any(),(req, res) => {
	fs.writeFileSync("/home/name/"+req.files[0].originalname,req.files[0].buffer);
	

	var name = req.files[0].originalname;

	exec("curl -k -v 'https://smarty.mail.ru/api/v1/objects/detect?oauth_provider=mcs&oauth_token=22DCthWsf3dNSVcfrD93YFacmQHYnR3X3razSHqE4JZkcQWyKC' \
		-F file_0=@/home/name/"+name+" -F meta='{\"mode\":[\"pedestrian\",\"multiobject\",\"object\"], \"images\":[{\"name\": \"file_0\"}]}'", (error, stdout, stderr) => {
			console.log(error);
			console.log(stdout);
			res.send(stdout);
			//return;
		});


	// var mt = '{"mode":["pedestrian","multiobject","scene","object"],"images":[{"name": "file_0"}]}';

	// var workerProcess = child_process.spawn("curl", ["-k", "-v", "https://smarty.mail.ru/api/v1/objects/detect?oauth_provider=mcs&oauth_token=22DCthWsf3dNSVcfrD93YFacmQHYnR3X3razSHqE4JZkcQWyKC", "-F", 
	// 	'file_0=@/home/name/'+name, "-F", "meta="+mt]);

	// workerProcess.stdout.on('data', function (data) {
	// 	console.log(data.toString('utf8'));
	// 	//res.setHeader("application/json");
	// 	res.status(200).type("application/json");
	// 	res.send(data);
	// 	//workerProcess.kill();
	// });

	// var id = uniqid();

	// var eol = "\r\n";
	// var x2eol = "\r\n\r\n";

	// var request = "Content-Type: multipart/form-data; boundary=----" + eol + id + x2eol +
	// 	"------" + id + eol +
	// 	'Content-Disposition: form-data; name="file_0"; filename="'+ name + "\"" + eol +
	// 	"Content-Type: image/jpeg" + eol + eol +
	// 	'Content-Transfer-Encoding: binary' + x2eol + req.files[0].buffer + eol +
	// 	"------" + id + eol +
	// 	'Content-Disposition: form-data; name="meta"' + x2eol + mt+eol+
	// 	"------" + id + "--";

	//req.files[0].buffer



	//var formData = JSON.stringify(form);
	// var contentLength = S.length;

	// fs.writeFileSync(__dirname + "/asd.txt",S);

	// request({
	// 	headers: {
	// 		'Content-Length': contentLength,
	// 		'Content-Type': 'multipart/form-data'
	// 	},
	// 	uri: 'https://smarty.mail.ru/api/v1/objects/detect?oauth_provider=mcs&oauth_token=22DCthWsf3dNSVcfrD93YFacmQHYnR3X3razSHqE4JZkcQWyKC',
	// 	body: S,
	// 	method: 'POST'
	// }, function (err, res, data) {
	// 	console.log(data);
	// });

})


app.listen(port, host, function () {
	console.log(`Server listens http://${host}:${port}`)
})


