const fs = require('fs');
const request = require('request')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.get('/hello', function (req, res){
    res.send('Hello World');
});

app.get('/nobacktick', function(req, res){
    var notick = "testing";
    res.send(notick);
});

app.get('/calculate', function (req, res){
    //try to read url parameters
    var answer = 0;
    var n1 = parseInt(req.query.number1, 10);
    var n2 = parseInt(req.query.number2, 10);
    var op = req.query.operator.toString();

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

//read and display chat
app.get('/chat', function (req, res){
    fs.readFile('chat.json', function(err, data){
        if (err){
            //if there is no file create it
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
        var chatLog = chatJson.logs; //the log[] array inside the json
        
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

//add something to the chatlog
app.post('/chat/submit', function (req, res) {
    var input = req.body.formData; //formData is the name of the field in the body

    fs.readFile('chat.json', function(err, data) {
        if (err){
            //if there is no file then then create it
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

//create the base json with a single array named "logs", will contain the chat messages
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

//todo
app.get('/promise', function (req, res){
    console.log("1");
    new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("2");
        },200);
        resolve();
    });
    console.log("3");
    res.send("Success");
});

//Initial 1, Callback 1, Callback 2, Initial 2
app.get('/callback', function (req, res){
    res.send("Success");
    console.log("Initial 1");
    callbackTest1(callbackTest2);
    console.log("Initial 2");
});

function callbackTest1(callbackFunc){
    console.log("Callback1");
    var index = 100000000;
    for(index; index > 0; index--){
        //waste time
    };
    callbackFunc();
}

function callbackTest2(){
    console.log("Callback2");
}

//Initial 1, Callback 1, Callback 1.1, Initial 2, Callback2, Callback2.await, Callback2.1
app.get('/asynccallback', function (req, res){
    res.send("Success");
    console.log("Initial 1");
    asyncCallbackTest1(asyncCallbackTest2);
    console.log("Initial 2");
});

function asyncCallbackTest1(callbackFunc){
    console.log("Callback1");
    setTimeout(callbackFunc, 200);
    console.log("Callback1.1");
}

async function asyncCallbackTest2(){
    console.log("Callback2");
    await new Promise(
        function(resolve, reject){
            setTimeout(function(){
                console.log("Callback2.await");
                resolve();
            }, 200)
        }
    );
    console.log("Callback2.1");
}

app.get('/api/time', function(req, res){
    console.log("Attempting to access API")
    apiResult = new Promise(function(resolve, reject){
        request('http://worldclockapi.com/api/json/utc/now', {json: true}, function (err, res, body){
            console.log("So I think this only appears once the data has arrived.");
            if(err) {
                reject(err);
            }
            var time = JSON.stringify(body);
            resolve(time);
        });
    })
    .then(function(test){
        console.log(`${test}`);
    })
    .catch(function(err){
        console.log(`PANIC ${err}`);
    });
    console.log("Now we're at the bottom of the main process thing.");
});

app.listen(port = 3000, function (){
    console.log(`Listening on port ${port}!`);
});