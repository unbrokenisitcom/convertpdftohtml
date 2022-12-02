/**
 * 
 * les URL OBTENU SONT 
 * 
 * localhost:5000/gethtml/PDF1/output-html.html
 * localhost:5000/gethtml/PDF2/output-html.html
 * localhost:5000/gethtml/PDF3/output-html.html
 * localhost:5000/gethtml/PDF4/output-html.html
 * 
 *  tu peut tester manuellement les réultats dans le dossier upload si on clique sur output-html.html
 * 
 * NB installer pdftohtml dans linux (ubuntu)
 * 
 * run code avec > node index.js 
 * 
 * Et utiliser le postman avec l'url de collection suivante
 * 
 * https://www.getpostman.com/collections/82b1c82193046a634921
 * 
 * 
 */

var express = require('express');
const app = express();
var pdfcrowd = require("pdfcrowd");
const path = require('path');
const { exec } = require('child_process');

app.use(express.json());
app.use(express.static('public'));
app.use(express.static('upload'));


app.get('/gethtml/:filename/:file', function(req, res){

    console.log(req.params.filename); 
     
    res.sendFile(path.join(__dirname + "/upload/"+req.params.filename+"/" + req.params.file));
   
});

app.post('/api/tohtmllocal', function(req, res) {

    const user_id = req.body.user_id;
    const filename = req.body.filename;


    const cmdDownload = "cd upload && mkdir " + filename + " && cd " + filename + " && wget -c " + user_id + " -O " + filename + ".pdf";
    const cmdConver = " && pdftohtml -s " + filename + ".pdf output.html"
    const cmdFinal = cmdDownload + cmdConver; 
    console.log(cmdFinal);

exec(cmdFinal , (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }


  res.send({"Converted":"OK","URL": "localhost:5000/gethtml/"+filename+"/output-html.html"});


  // the *entire* stdout and stderr (buffered)
  console.log();(`stdout: ${stdout}`);
  console.log();(`stderr: ${stderr}`);
});


}); 

app.use(function(req, res, next) {
    let err = new Error('path not found');
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
    console.log(err);
    if (err.status === 404)
        res.status(404).json({ message: "path not found" });
    else
        res.status(500).json({ message: "something looks wrong" });
});
app.listen(5000, function() {
    console.log('running with 5000')
})