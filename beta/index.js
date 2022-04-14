'use strict';
const express = require('express')
const request = require('request');
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
const port = 5000
const path=require('path');


var PROTO_PATH = __dirname + '/helloworld.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

var client = new hello_proto.Greeter(process.env.CHARLIE_SVC,
                                       grpc.credentials.createInsecure());
app.use('/beta',express.static(path.resolve(__dirname,'./public')));
app.post('/beta', (req, res) => {
    // console.log("/beta called");

    let name = req.body["name"]
    client.sayHello({name: name}, function(err, response) {
        // console.log('Greeting:', response.message);
        res.json({"data": `Hello ${name} from Beta Service!`, "charlie_response": response.message});
    });
})

app.get('/beta', (req,res)=> {
    res.sendFile(__dirname+'/index.html');
})



const products = [{ name: 'Switch' },{ name: 'Ip Phone' },{name: 'Firewall'}];

app.get('/products',(req,res)=> {
    res.json(products);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
