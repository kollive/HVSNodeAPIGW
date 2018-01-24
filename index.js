'use strict';

const jwt = require('jsonwebtoken-refresh');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const mssql = require('mssql');
const DBase = require('./api/mssql');
const stream = require('stream');
const _ = require('lodash');
const fs = require('fs');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

import * as config from "config";


import * as os from "os";
//const axios = require('axios');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
var env = process.env.NODE_ENV || "Dev";

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil';


var strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    console.log('payload received', jwt_payload);
    const tmpData,resultObj;
    //Log the token in database
    try {
        var parm = [];        
        parm[0] = jwt_payload.authID;

        tmpData = await DBase.DB.execSP("sps_checktoken", parm);
        //console.log(tmpData)
        resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        console.log(resultObj.data[0][0].validToken);

    } catch (e) {
        console.log(e)
        //res.status(500).end();
    }

    if(resultObj.data[0][0].validToken == "Y") {
        next(null, true);
    } else {
        next(null, true);
    }
    
});

passport.use(strategy);

//const env = require("env.js");
const PORT = process.env.PORT || 3003;
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = http.Server(app);
const io = require("socket.io")(server);
//var pool;

app.use('*', async function (req, res, next) {
    console.log("Headers")
    //console.log(req.header("Access-Control-Request-Headers"));
    //console.log(req)
    //console.log(TestAsync());
    //,,
    //res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    //pool = await new mssql.connect(config.get(env + ".dbConfig"));

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,Access-Control-Allow-Origin,Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", true);
    //res.header("Transfer-Encoding", "chunked");
    //res.header("Content-Type", "text/plain");
    //res.header("Content-Type", "application/json");
    res.io = app.io;
    //res.header("Accept", "q=0.8;application/json;q=0.9"); ,
    //res.header("Connection", "keep-alive");
    console.log('Time:', Date.now())
    //console.log(await getURLs('db'));
    next()
});

// Socket.io
//const io = socket_io().listen(server);
//app.io = socket_io;

//DB = new DBase.DB();
DBase.DB.on('error', function (err) {
    console.log(err.message);
});

async function getURLs(svcName) {
    try {
        var result = await DBase.DB.execSQl("select gs_name, gs_url from tAPIURL")
        var resultObj = JSON.parse(result);
        console.log(resultObj.data[0]);

        var results = _.filter(resultObj.data[0], function (obj) {
            //console.log(obj.gs_name)
            return obj.gs_name.indexOf(svcName) !== -1;
        });

        return results[0].gs_url;
    } catch (err) {
        return err;
        //response.send(err); 
    }
}


// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}


app.use(passport.initialize());
app.use(bodyParser.urlencoded({limit :'50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));


app.io = io.sockets.on('connection', function (socket) {
    console.log('a user connected')
    //send Ping to client connection
    socket.emit('ping', { type: 'INCOMING_PONG_PAYLOAD', payload: 'ping from server' });

    // receive from client (index.ejs) with socket.on
    socket.on('add-message', function (msg) {
        console.log('new add message: ' + msg)
        // send to client (index.ejs) with app.io.emit
        // here it reacts direct after receiving a message from the client
        //app.io.emit('chat-message', msg);
    })

    socket.on('pong-message', function (data) {
        console.log('new pong message: ' + data)
        //socket.emit('ping', { type: 'INCOMING_PONG_PAYLOAD', payload: 'pong response from server' });
        // send to client (index.ejs) with app.io.emit
        // here it reacts direct after receiving a message from the client
        //app.io.emit('chat-message', msg);
    })
})
/*
app.get('/ExportToExcel',async function (req, res) {
    const nodeExcel=require('excel-export');
    const dateFormat = require('dateformat');
    var conf={}
    var arr=[];

    conf.cols = JSON.parse(JSON.stringify(req.body.cols));
console.log(conf.cols)
       const parm = [];
       console.log("Before SQL")
       console.log(Date.now())
        const tmpData = await DBase.DB.execSQl("select top 100 gs_id,gs_user_i,gs_oru_i,gs_Sql,gs_strt_tm,gs_end_tm,gs_err,gs_err_desc from tdblog");

        console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        console.log(Date.now())
        if (resultObj.data[0].length > 0) {
            
            arr=[];
            for(var i=0;i<resultObj.data[0].length;i++){                
                var a=[
                    resultObj.data[0][i].gs_id,
                    resultObj.data[0][i].gs_user_i,
                    resultObj.data[0][i].gs_oru_i,
                    resultObj.data[0][i].gs_Sql,
                    (dateFormat(resultObj.data[0][i].gs_strt_tm, "mm/dd/yyyy HH:MM:ss")),
                    (dateFormat(resultObj.data[0][i].gs_end_tm, "mm/dd/yyyy HH:MM:ss")),
                    resultObj.data[0][i].gs_err,
                    resultObj.data[0][i].gs_err_desc,
                ];
                arr.push(a);
                }
                conf.rows=arr;
               
                //conf.rows= resultObj.data[0];
    var result=nodeExcel.execute(conf);
    console.log(Date.now())
    res.setHeader('Content-Type','application/vnd.openxmlformats');
    res.setHeader("Content-Disposition","attachment;filename="+"todo.xlsx");
    console.log(Date.now())
    res.end(result, 'binary');
    //res.status(200).send(new Buffer(result.toString(),'binary').toString("base64"));
    }
});
*/

app.get('/excel',async function (req, res) {
    const nodeExcel=require('excel-export');
    const dateFormat = require('dateformat');
    var conf={}
   
    var arr=[];

    conf.cols=[{
            caption:'ID.',
            type:'number',
            width:3
        },
        {
            caption:'User ID',
            type:'string',
            width:50
        },
        {
            caption:'Location',
            type:'string',
            width:75
        },
        {
            caption:'SQL',
            type:'string',
            width:150
        },
        {
            caption:'Start TM',
            type:'string',
            width:75
        },
        {
            caption:'End TM',
            type:'string',
            width:75
        },
        {
            caption:'Error',
            type:'string',
            width:150
        },
        {
            caption:'Error Desc',
            type:'string',
            width:150
        }
        ];
  
        const parm = [];
       console.log("Before SQL")
       console.log(Date.now())
        const tmpData = await DBase.DB.execSQl("select top 100 gs_id,gs_user_i,gs_oru_i,gs_Sql,gs_strt_tm,gs_end_tm,gs_err,gs_err_desc from tdblog");

        console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        console.log(Date.now())
        if (resultObj.data[0].length > 0) {
            
            arr=[];
            for(var i=0;i<resultObj.data[0].length;i++){                
                var a=[
                    resultObj.data[0][i].gs_id,
                    resultObj.data[0][i].gs_user_i,
                    resultObj.data[0][i].gs_oru_i,
                    resultObj.data[0][i].gs_Sql,
                    (dateFormat(resultObj.data[0][i].gs_strt_tm, "mm/dd/yyyy HH:MM:ss")),
                    (dateFormat(resultObj.data[0][i].gs_end_tm, "mm/dd/yyyy HH:MM:ss")),
                    resultObj.data[0][i].gs_err,
                    resultObj.data[0][i].gs_err_desc,
                ];
                arr.push(a);
                }
                conf.rows=arr;
               
                //conf.rows= resultObj.data[0];
    var result=nodeExcel.execute(conf);
    console.log(Date.now())
    res.setHeader('Content-Type','application/vnd.openxmlformats');
    res.setHeader("Content-Disposition","attachment;filename="+"todo.xlsx");
    console.log(Date.now())
    res.end(result, 'binary');
    //res.status(200).send(new Buffer(result.toString(),'binary').toString("base64"));
    }
});

app.get('/cadetexcel',async function (req, res) {    
    var file = __dirname + '/public/CadetListDownloadExcel.xlsx';
    res.download(file); // Set disposition and send it.
});
   
app.get('/budgetexcel',async function (req, res) {    
    var file = __dirname + '/public/budget.xlsx';
    res.download(file); // Set disposition and send it.
});

app.get('/statusexcel',async function (req, res) {    
    var file = __dirname + '/public/StatusOfCadetApplications.xlsx';
    res.download(file); // Set disposition and send it.
});



app.post("/toLoadSvc", passport.authenticate('jwt', { session: false }), function (req, res) {
    try {
        console.log(req.get('Authorization'))
        var token = req.get('Authorization');

        token = token.toString().replace("JWT ", "")
        var originalDecoded = jwt.decode(token, { complete: true });
        console.log(JSON.stringify(originalDecoded));

        var refreshed = jwt.refresh(originalDecoded, 300, jwtOptions.secretOrKey);
        // new 'exp' value is later in the future. 
        console.log(JSON.stringify(jwt.decode(refreshed, { complete: true })));
        var output = JSON.stringify({ "message": "token refreshed", "token": refreshed, "result": 0 });
        res.status(200).json(output);
        //res.status(200).json({ "message": "Success! You can not see this without a token" });
    } catch (e) {
        console.log("error")
        console.log(e)
        var output = JSON.stringify({ "message": e, "token": null, "result": 0 });
        res.status(200).json(output);
    }
});


app.post("/sendEmail", async function (req, res) {
    var result;
    try {
        console.log(req.body.hv_email)
        const parm = [];
        parm[0] =  req.body.hv_email;
        const tmpData = await DBase.DB.execSP("sps_checkemail", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {
        
           
        /*
        var transporter = nodemailer.createTransport({
            host: 'server54.web-hosting.com',
            port: 465,
            secure: true,
            auth: {
            user: 'venugopal.kolli@hudsonvalleysystems.com',
            pass: 'Mini8536!'
            }
        });
  
        var mailOptions = {
            from: 'venugopal.kolli@hudsonvalleysystems.com',
            to: 'kollive@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };
        */
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
            user: 'hvscadet@gmail.com',
            pass: 'HudsonCadet!'
            }
        });
  
        //console.log( resultObj.data[0][0].hv_pwd_token )
        var htm = "<div>Hi " + resultObj.data[0][0].hv_first_name + ",<br/><br/> We have received a request to reset your password. <br/> If you did not make this request, just ignore this message.";
        htm += "Otherwise, you can reset your password using this link<br/><br/>"
        //htm += "<a href=\'http://localhost:3000/changepwd/" + resultObj.data[0][0].hv_pwd_token + "\'> Click here to reset your password</a><br/>"
        htm += "<a href=\'http://hvs.selfip.net:3000/changepwd/" + resultObj.data[0][0].hv_pwd_token + "\'> Click here to reset your password</a><br/>"
        htm += "<br/>Thanks,<br/> The HVS Cadet Team"

        console.log(htm)
        var mailOptions = {
            from: 'HVSCadet@gmail.com',
            to: 'kollive@hotmail.com;' + req.body.hv_email,
            subject: 'Reset your Password',
            html: htm,          
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });

        var output = JSON.stringify({ "message": "ok", "token": null, "result": {val: 1, msg: "email sent to reset your password."} });
        res.status(200).json(output);
    }else {
        var output = JSON.stringify({ "message": "ok", "token": null, "result": {val: -1, msg: "Please Enter a Valid email that was registered."}  });
        res.status(200).json(output);
    }
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/getCadets", async function (req, res) {
    var result;
    try {
        
        const parm = [];
        parm[0] =  req.body.name;
       
        const tmpData = await new DBase.DB.execSP("sps_getcadets", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {
                   
        var output = JSON.stringify({ "token": null, "result": {items: resultObj.data[0], msg: ""} });
        res.status(200).json(output);
        }else {
            var output = JSON.stringify({ "token": null, "result": {items:{}, msg: "Not Found."}  });
            res.status(200).json(output);
        }
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        console.log(e)
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/getMentors", async function (req, res) {
    var result;
    try {
        
        const parm = [];
        parm[0] =  req.body.name;
       
        const tmpData = await new DBase.DB.execSP("sps_getMentors", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {
                   
        var output = JSON.stringify({ "token": null, "result": {items: resultObj.data[0], msg: ""} });
        res.status(200).json(output);
        }else {
            var output = JSON.stringify({ "token": null, "result": {items:{}, msg: "Not Found."}  });
            res.status(200).json(output);
        }
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        console.log(e)
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/getBudgets", async function (req, res) {
    var result;
    try {
        
        const parm = [];
        parm[0] =  req.body.name;
       
        const tmpData = await new DBase.DB.execSP("sps_getBudgets", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {
                   
        var output = JSON.stringify({ "token": null, "result": {items: resultObj.data[0], msg: ""} });
        res.status(200).json(output);
        }else {
            var output = JSON.stringify({ "token": null, "result": {items:{}, msg: "Not Found."}  });
            res.status(200).json(output);
        }
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        console.log(e)
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/getPurchases", async function (req, res) {
    var result;
    try {
        
        const parm = [];
        parm[0] =  req.body.name;
       
        const tmpData = await new DBase.DB.execSP("sps_getPurchases", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {
                   
        var output = JSON.stringify({ "token": null, "result": {items: resultObj.data[0], msg: ""} });
        res.status(200).json(output);
        }else {
            var output = JSON.stringify({ "token": null, "result": {items:{}, msg: "Not Found."}  });
            res.status(200).json(output);
        }
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        console.log(e)
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/getApprovals", async function (req, res) {
    var result;
    try {
        
        const parm = [];
        parm[0] =  req.body.name;
       
        const tmpData = await new DBase.DB.execSP("sps_getApprovals", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {
                   
        var output = JSON.stringify({ "token": null, "result": {items: resultObj.data[0], msg: ""} });
        res.status(200).json(output);
        }else {
            var output = JSON.stringify({ "token": null, "result": {items:{}, msg: "Not Found."}  });
            res.status(200).json(output);
        }
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        console.log(e)
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/getSchedules", async function (req, res) {
    var result;
    try {
        
        const parm = [];
        parm[0] =  req.body.name;
       
        const tmpData = await new DBase.DB.execSP("sps_getSchedules", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {
                   
        var output = JSON.stringify({ "token": null, "result": {items: resultObj.data[0], msg: ""} });
        res.status(200).json(output);
        }else {
            var output = JSON.stringify({ "token": null, "result": {items:{}, msg: "Not Found."}  });
            res.status(200).json(output);
        }
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        console.log(e)
        res.status(500).end();
    }
   
    //res.send(result);
});
app.post("/changePWD", async function (req, res) {
    var result;
    try {
        console.log(req.body.userID)
        console.log(req.body.currPWD)
        console.log(req.body.newPWD)
        const parm = [];
        parm[0] =  req.body.userID;
        parm[1] =  req.body.currPWD;
        parm[2] =  req.body.newPWD;
        parm[3] = req.body.emailReset

        const tmpData = await DBase.DB.execSP("spu_updatePWD", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {
                   
        var output = JSON.stringify({ "message": "ok", "token": null, "result": {val: resultObj.data[0][0].hv_return, msg: resultObj.data[0][0].hv_msg} });
        res.status(200).json(output);
    }else {
        var output = JSON.stringify({ "message": "ok", "token": null, "result": {val: -1, msg: "Please contact HelpDesk."}  });
        res.status(200).json(output);
    }
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/checkToken", async function (req, res) {
    var result;
    try {
        console.log(req.body.userID)
        console.log(req.body.currPWD)
        console.log(req.body.newPWD)
        const parm = [];
        parm[0] =  req.body.secToken;
       

        const tmpData = await DBase.DB.execSP("sps_checkPWDToken", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {
                   
        var output = JSON.stringify({ "message": "ok", "token": null, "result": {hv_user_id: resultObj.data[0][0].hv_user_id, msg: "", val: 1} });
        res.status(200).json(output);
    }else {
        var output = JSON.stringify({ "message": "ok", "token": null, "result": {val: -1, msg: "Reset Link is not valid. Please contact HelDesk."}  });
        res.status(200).json(output);
    }
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        res.status(500).end();
    }
   
    //res.send(result);
});


app.post("/loginsvc", async function (req, res) {
    var result;

    try {
        var url = await getURLs('logon');
        //var url = "http://localhost:3001/loginsvc";        
        console.log(url);

        var name;
        var password;

        if (req.body.usr && req.body.pwd) {
            name = req.body.usr;
            password = req.body.pwd;
        }

        console.log(name)
        console.log(password)

        var parms = JSON.stringify({
            usr: name,
            pwd: password
        });

        const data = await fetch(url, {
            method: 'POST',
            body: parms,
            headers: { 'Content-Type': 'application/json' },
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            //headers: { 'Content-Type': 'application/json',
            //'Content-Length': parms.length    
        })

        result = await data.json();

    } catch (e) {
        res.status(500).end();
    }

    console.log(result)
    console.log(JSON.parse(result).message)

    if (JSON.parse(result).message == 1) {

        const uuidv4 = require('uuid/v4');
        const authId = uuidv4(); // ⇨ 'df7cca36-3d7a-40f4-8f06-ae03cc22f045'

        var payload = { userId: name, role: "read", authID: authId };
        var token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1h' }); // '1h'
        console.log(token)

        //Log the token in database
        try {
            const parm = [];
            parm[0] = token;
            parm[1] = name;
            parm[2] = authId;

            const tmpData = await DBase.DB.execSP("spi_taccesstoken", parm);
            //console.log(tmpData)
            //console.log(tmpData.data[0].hv_auth_code)

        } catch (e) {
            console.log(e)
            //res.status(500).end();
        }

        var output = JSON.stringify({ "message": "ok", "token": token, "result": JSON.parse(result).result, "name": JSON.parse(result).name });
        res.status(200).json(output);

    } else {
        var output = JSON.stringify({ "message":  JSON.parse(result).result, "result": JSON.parse(result).message });
        res.status(200).json(output);
    }
    //res.send(result);
    console.log(result);
});

app.post("/getTables", async function (req, res) {
    var result;

    try {
      
        const parm = [];
        parm[0] =  req.body.tableTag;
        const tmpData = await new DBase.DB.execSP("sps_getAttribTables", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        var output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
        res.status(200).json(output);
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        console.log(e)
        res.status(500).end();
    }
   
    //res.send(result);
});


app.post("/GetAttribTable", async function (req, res) {
    var result;

    try {
        console.log("sps_getAttribTableValues")
        console.log( req.body.hv_table_i)
        
        const parm = [];
        parm[0] =  req.body.hv_table_i;
        const tmpData = await DBase.DB.execSP("sps_getAttribTableValues", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        var output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
        res.status(200).json(output);
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/delAttribTable", async function (req, res) {
    var result;

    try {
        const parm = [];
        parm[0] =  req.body.hv_table_i;
        parm[1] =  req.body.hv_universal_i;
        const tmpData = await DBase.DB.execSP("spd_AttribTableValues", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        var output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
        res.status(200).json(output);
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/updAttribTable", async function (req, res) {
    var result;

    try {
        const parm = [];
        parm[0] =  req.body.hv_table_i;
        parm[1] =  req.body.hv_universal_i;
        parm[2] =  req.body.hv_universal_name;

        const tmpData = await DBase.DB.execSP("spu_AttribTableValues", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        var output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
        res.status(200).json(output);
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/insAttribTable", async function (req, res) {
    var result;

    try {
        const parm = [];
        parm[0] =  req.body.hv_table_i;
        parm[1] =  req.body.hv_universal_name;

        const tmpData = await DBase.DB.execSP("spi_AttribTableValues", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        var output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
        res.status(200).json(output);
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        res.status(500).end();
    }
   
    //res.send(result);
});

app.post('/ExportToExcel',async function (req, res) {
    const nodeExcel=require('excel-export');
    const dateFormat = require('dateformat');
    var conf={}
    var arr=[];

    conf.stylesXmlFile = "./styles.xml";
    conf.name="mysheet";
    
    conf.cols = JSON.parse(JSON.stringify(req.body.cols));
    console.log(conf.cols)

    let SQL = req.body.spName;
    console.log(SQL)
    //console.log(req.body.cols)
    //conf.cols = JSON.parse(JSON.stringify(req.body.cols));
    //console.log(conf.cols)
    //conf.cols = JSON.stringify(req.body.cols);
    //console.log(conf.cols)
    /*
    conf.cols=[{
        caption:'First Name',
        type:'string',
        width: 50
    },
    {
        caption:'Last Name',
        type:'string',
        width:50
    }];
    console.log(conf.cols)
*/

        const parm = [];
       //console.log("Before SQL")
       //console.log(Date.now())
        const tmpData = await DBase.DB.execSQl(SQL);
        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        //console.log(Date.now())
        //console.log(resultObj.columns)
        //console.log(resultObj.columns[0].name)
    //console.log(Object.keys(resultObj.columns))
    let colNameArr = Object.keys(resultObj.columns);

        if (resultObj.data[0].length > 0) {
            
            arr=[];
            for(var i=0;i<resultObj.data[0].length;i++){  
                let a = [];
                colNameArr.forEach((key,index) => {
                    //console.log(key)
                    //console.log(resultObj.data[0][i])
                    //console.log(resultObj.data[0][i][key])                   
                    a.push(resultObj.data[0][i][key])
                  });

               //console.log(a)
                arr.push(a);
                }
                conf.rows=arr;
           
                //console.log(arr)
                //conf.rows= resultObj.data[0];
    var result=nodeExcel.execute(conf);
    console.log(Date.now())
    res.setHeader('Content-Type','application/vnd.openxmlformats');
    res.setHeader("Content-Disposition","attachment;filename="+"todo.xlsx");
    console.log(Date.now())
    res.end(result, 'binary');
    //res.status(200).send(new Buffer(result.toString(),'binary').toString("base64"));
    }
});

// app.post("/saveUserDetails", async function (req, res) {
//     var result;

//     try {
//         const parm = [];
//         console.log("saveuserdetails");
//         let parmstr= JSON.stringify(req.body.parms);  
//         let parms = JSON.parse(parmstr);
        
//         let keyArr = Object.keys(parms);
//         console.log(parms["hv_first_name"]);
//         parm[0] = parms["hv_first_name"];
//         parm[1] = parms["hv_last_name"];
//         parm[2] = parms["hv_user_id"];
//         parm[3] = parms["hv_pwd"];
//         parm[4] = parms["hv_email"];
//         parm[5] = parms["hv_mobile_no"];
//         parm[6] = parms["hv_home_no"];
//         parm[7] = parms["hv_other_no"];

//         // let imagedata = base64ArrayBuffer.encode(parms["hv_image"]);
//         // var imagedata = new Buffer.from(parms["hv_image"]).toString('base64');
//         // console.log(imagedata);
//         console.log(parms["hv_image"]);
//         parm[8] = parms["hv_image"];

//         const tmpData = await DBase.DB.execSP("spi_UserDetails", parm);

//         //console.log(tmpData)
//         const resultObj = JSON.parse(tmpData);
//         console.log(resultObj.data[0]);
//         var output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
//         res.status(200).json(output);
//     } catch (e) {
//         var output = JSON.stringify({ "message": "fail", "token": null, "result": e.message });
//         res.status(200).json(output);
//     }
  
// });

app.post("/ExecSP", async function (req, res) {
    var result;

    let spName = req.body.spName;
    let parmstr= JSON.stringify(req.body.parms);  
    //console.log(parmstr) 
    let parms = JSON.parse(parmstr);
    //console.log(parms)
    const parm = [];

    try {

        let keyArr = Object.keys(parms);
        //console.log(keyArr);

        // loop through the object, pushing values to the return array
        keyArr.forEach((key,index) => {
          //console.log(key);
          parm[index] = parms[key];          
        });

        //parm[0] =  req.body.hv_table_i;
        //parm[1] =  req.body.hv_universal_name;

        const tmpData = await DBase.DB.execSP(spName, parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        var output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
        res.status(200).json(output);
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        var output = JSON.stringify({ "message": "fail", "token": null, "result": e.message });
        res.status(200).json(output);
        //res.status(500).end();
    }
   
    //res.send(result);
});

app.post("/ExecSPM", async function (req, res) {
    var result;

    let spName = req.body.spName;
    let parmstr= JSON.stringify(req.body.parms);  
    //console.log(parmstr) 
    let parms = JSON.parse(parmstr);
    //console.log(parms)
    const parm = [];

    try {

        let keyArr = Object.keys(parms);
        //console.log(keyArr);

        // loop through the object, pushing values to the return array
        keyArr.forEach((key,index) => {
          //console.log(key);
          parm[index] = parms[key];          
        });

        //parm[0] =  req.body.hv_table_i;
        //parm[1] =  req.body.hv_universal_name;

        const tmpData = await DBase.DB.execSP(spName, parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        var output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data });
        res.status(200).json(output);
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        var output = JSON.stringify({ "message": "fail", "token": null, "result": e.message });
        res.status(200).json(output);
        //res.status(500).end();
    }
   
    //res.send(result);
});



const api = require('./api')
app.use('/api', api.router);
app.use(express.static(__dirname + '/public'));
// app.use(express.json({limit:'50mb'}));
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})