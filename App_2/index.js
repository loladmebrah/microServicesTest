var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var https = require('https');
var http = require('http');
var port = process.env.PORT || 690;

var app = express();

var whitelist = [
  'http://localhost:8100',
  'http://localhost:8200',
  'http://localhost:8300',
];

var baseUrl = 'https://vpic.nhtsa.dot.gov/api/';
var auxiliarUrl = 'http://localhost:420/';

var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error('Not allowed by CORS, try again <br/> \n'+JSON.stringify(origin,null,2)), false);
  }
}

function regularSafeRequest(url, callback){
    https.get(url, (resp)=>{
        let info = {data:''};
        resp.on('data', (chunk) => info.data += chunk);
        resp.on('end', () => callback(null, JSON.parse(JSON.stringify(info.data))));
    }).on('error', (err)=>{
        callback(err, null);
    });
}

function regularUnsafeRequest(url, callback){
    http.get(url, (resp)=>{
        let info = {data:''};
        resp.on('data', (chunk) => info.data += chunk);
        resp.on('end', () => callback(null, JSON.parse(JSON.stringify(info.data))));
    }).on('error', (err)=>{
        callback(err, null);
    });
}


app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.get('/', function(req, res){
    return res.send('Hello, Api 2 here');
});

app.get('/base2', function(req, res){
    regularSafeRequest(baseUrl+'/vehicles/GetAllManufacturers?format=json&page=1',(err, data)=>{
        if(err) return res.status(400).json({msg:err});
        else if(data) return res.status(200).json(JSON.parse(data));
    })
    
});

app.get('/magic2', function(req, res){
    const finalUrl = auxiliarUrl+'base1';
    regularUnsafeRequest(finalUrl,(err, data)=>{
        if(err) return res.status(400).json({msg:err});
        else if(data) {
            return res.status(200).json({msg: "from api 1 with love", response: data});
        }
    })
});

app.listen(port);
console.log('Hello! Api service running on port '+port);