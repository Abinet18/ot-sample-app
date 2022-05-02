'use strict';
const express = require('express')
const request = require('request');
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
const port = 5000
const path=require('path');

app.use('/',express.static(path.resolve(__dirname,'./public')));

app.get('/', (req,res)=> {
    res.sendFile(__dirname+'/index.html');
})

const products = [{ name: 'Switch' },{ name: 'Ip Phone' },{name: 'Firewall'}];
const regions = [{name:'Americas'},{name:'EMEA'},{name:'Pacific'}];

app.get('/products',(req,res)=> {
    res.json(products);
})
app.get('/regions',(req,res)=> {
    res.json(regions);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
