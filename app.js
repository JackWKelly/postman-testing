var express = require('express');
var app = express();

app.get('/hello', function (req, res){
    res.send('Hello World');
})

app.get('/calculate', function (req, res){
    //try to read url parameters
    var answer = 0;
    var n1 = parseInt(req.query.n1, 10);
    var n2 = parseInt(req.query.n2, 10);
    var op = req.query.op.toString();

    if(Number.isInteger(n1) && Number.isInteger(n2)){
        switch(op){
            case "+":           //+ is reserved on GET requests so use encoded %2B
                answer = n1 + n2;
                break;
            case "-":
                answer = n1 - n2;
                break;
            case "*":
                answer = n1 * n2;
                break;
            case "/":
                answer = n1 / n2;
                break;
            default:
                res.send('Invalid Operator Input');
                return;
        }
    } else {
        res.send('Invalid Numerical Input');
        return;
    }

    res.send(`Your answer is ${answer}.`);

})

app.listen(port = 3000, function (){
    console.log(`Listening on port ${port}!`);
})