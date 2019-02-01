var express = require('express');
var app = express();

app.get('/hello', function (req, res){
    res.send('Hello World');
})

app.listen(port = 3000, function (){
    console.log(`Listening on port ${port}!`);
})