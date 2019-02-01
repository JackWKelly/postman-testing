const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.get('/hello', function (req, res){
    res.send('Hello World');
});

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

});

app.get('/chat', function (req, res){
    fs.readFile('chat.json', function(err, data){
        if (err){
            if (err.code === 'ENOENT'){
                console.log('File not found!');
                chatCreateJson();
                res.status(201);
                res.send('Reload to see the chatlog.');
                return;

            } else {
                throw err;
            }
        }
        var chatJson = JSON.parse(data);
        var chatLog = chatJson.logs;
        
        var toSend = "";

        var index = 0;
        for (index; index < chatLog.length; ++index){
            toSend = toSend.concat(chatLog[index],'\n');
        }

        console.log(`Current log being sent: ${toSend}`);
        res.send(toSend);
        return;


    });
});

app.post('/chat/submit', function (req, res) {
    var input = req.body.formData;

    fs.readFile('chat.json', function(err, data) {
        if (err){
            if (err.code === 'ENOENT'){
                console.log('File not found!');
                chatCreateJson();
                res.status(201);
                res.send('Chatlog created. Please submit your data again.');
                return;

            } else {
                throw err;
            }
        }

        var chatJson = JSON.parse(data);
        var chatLog = chatJson.logs;
        chatLog.push(input);
        fs.writeFile("chat.json", JSON.stringify(chatJson), function(err, result){
            if(err){
                console.log('error writing to chatlog');
            }
        });
        res.status(200);
        console.log('Chat submitted');
        res.send("Chat submitted.");
    });

});

function chatCreateJson(){
    var newJson = {
        "logs":["Welcome to chat!"]
    };
    newJson = JSON.stringify(newJson);
    fs.writeFile('chat.json', newJson, JSON, (err) => {
        if(!err){
            console.log('File successfully created');
        }
    });
};

app.listen(port = 3000, function (){
    console.log(`Listening on port ${port}!`);
});