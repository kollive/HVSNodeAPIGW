'use strict';

const jwt = require('jsonwebtoken-refresh');
//const passport = require('passport');
//const passportJWT = require('passport-jwt');
const mssql = require('mssql');
const DBase = require('./api/mssql');
const stream = require('stream');
const _ = require('lodash');
const fs = require('fs');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const upload = require('jquery-file-upload-middleware');
const PDFDocument = require('pdfkit');


import * as config from "config";
import * as wrap from 'express-async-wrap';
import * as os from "os";
//const axios = require('axios');

//const ExtractJwt = passportJWT.ExtractJwt;
//const JwtStrategy = passportJWT.Strategy;
var env = process.env.NODE_ENV || "Dev";

var jwtOptions = {}
//jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil';

// configure upload middleware
upload.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/uploads'
});


/*
imageVersions: {
        thumbnail: {
            width: 80,
            height: 80
        }
    }
var strategy = new JwtStrategy(jwtOptions,  function (jwt_payload, next) {
   
    console.log('payload received', jwt_payload);
    const tmpData,resultObj;
    
    //Log the token in database
    try {
        var parm = [];        
        parm[0] = jwt_payload.authID;
        
        tmpData =  DBase.DB.execSP("sps_checktoken", parm);
        console.log(tmpData)
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
         next(null, false);
    }
    
});

function wrapMiddleware(fn) {
    return function(req, res, next) {
      // If promise resolves, call `next()` with no args, otherwise call `next()`
      // with the error from the promise rejection
      fn(req).then(() => next(), next);
    };
  }

passport.use(strategy);
*/

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

    /*
    token = token.toString().replace("JWT ", "")
    console.log(token);
    var originalDecoded = jwt.decode(token, { complete: true });
    console.log(JSON.stringify(originalDecoded));

    var refreshed = jwt.refresh(originalDecoded, 300, jwtOptions.secretOrKey);
    // new 'exp' value is later in the future. 
    console.log(JSON.stringify(jwt.decode(refreshed, { complete: true })));

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //token = token.toString().replace("JWT ", "")
    console.log(token);
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token,jwtOptions.secretOrKey, function(err, decoded) {      
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
        }
        });
    
    } else {    
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    
    }
    */
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


//app.use(passport.initialize());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/apiupload', upload.fileHandler());


// events
upload.on('begin', function (fileInfo, req, res) {
    console.log(fileInfo)
    // fileInfo structure is the same as returned to browser
    // { 
    //     name: '3 (3).jpg',
    //     originalName: '3.jpg',
    //     size: 79262,
    //     type: 'image/jpeg',
    //     delete_type: 'DELETE',
    //     delete_url: 'http://yourhost/upload/3%20(3).jpg',
    //     url: 'http://yourhost/uploads/3%20(3).jpg',
    //     thumbnail_url: 'http://youhost/uploads/thumbnail/3%20(3).jpg' 
    // }
});
upload.on('abort', function (fileInfo, req, res) { });
upload.on('end', function (fileInfo, req, res) {
    var pdf = new PDFDocument({
        size: 'A4', // See other page sizes here: https://github.com/devongovett/pdfkit/blob/d95b826475dd325fb29ef007a9c1bf7a527e9808/lib/page.coffee#L69
        info: {
            Title: 'Tile of File Here',
            Author: 'Buraq',
        }
    });
    console.log("in PDF")
    //console.log(req.body.filename)
    // Write stuff into PDF
    //Set the font size
    pdf.fontSize(11);
    //Using a standard PDF font
    pdf.font('Times-Roman')
        .text('Hello from Times Roman!')
        .moveDown(0.5)

    pdf.text('PO Number 123 -- Buraq');
    pdf.moveDown(0.5);

    pdf.image(__dirname + '/public/uploads/' + fileInfo.name, {
        fit: [500, 550],
        align: 'center',
        valign: 'center'
    });

//595,842
    // Stream contents to a file
    pdf.pipe(
        fs.createWriteStream(__dirname + '/public/uploads/file.pdf')
    )
        .on('finish', function () {
            console.log('PDF closed');
        });

    // Close PDF and write file.
    pdf.end();
});
upload.on('delete', function (fileInfo, req, res) { });
upload.on('error', function (e, req, res) {
    console.log(e.message);
});

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
/*
upload.on("end", function(fileinfo){

    var user = "buraq";
    var filemanager = upload.fileManager({
        targetDir: __dirname + '/public/uploads/' + user,
        targetUrl: "/uploads/" + fileInfo.sessionID
    });

    filemanager.move(fileInfo.name, "", function(err, result) {
        console.dir(result);
        var pdf = new PDFDocument({
            size: 'LEGAL', // See other page sizes here: https://github.com/devongovett/pdfkit/blob/d95b826475dd325fb29ef007a9c1bf7a527e9808/lib/page.coffee#L69
            info: {
              Title: 'Tile of File Here',
              Author: 'Buraq',
            }
          });
          
          console.log(req.body.filename)
          pdf.image(__dirname + '/public/uploads/' + user + '/' + req.body.filename, {
            fit: [250, 300],
            align: 'center',
            valign: 'center'
         });
          
          // Write stuff into PDF
          //pdf.text('Hello World');
          
          // Stream contents to a file
          pdf.pipe(
            fs.createWriteStream(__dirname + '/public/uploads/' + user + '/file.pdf')
          )
            .on('finish', function () {
              console.log('PDF closed');
            });
          
          // Close PDF and write file.
          pdf.end();
    })
});
*/
/*
app.use('/apiupload', function (req, res, next) {
    var user = "buraq";

    console.log("in ")
    req.filemanager = upload.fileManager({
        targetDir: __dirname + '/public/uploads/' + user,
        targetUrl: '/uploads/' + user,
    });

    
    req.filemanager.move(req.body.filename, '', function (err, result) {
        // file gets moved to __dirname + '/public/u/' + user._id + '/profile'
        if (!err) {
            var pdf = new PDFDocument({
                size: 'LEGAL', // See other page sizes here: https://github.com/devongovett/pdfkit/blob/d95b826475dd325fb29ef007a9c1bf7a527e9808/lib/page.coffee#L69
                info: {
                  Title: 'Tile of File Here',
                  Author: 'Buraq',
                }
              });
              
              console.log(req.body.filename)
              pdf.image(__dirname + '/public/uploads/' + user + '/' + req.body.filename, {
                fit: [250, 300],
                align: 'center',
                valign: 'center'
             });
              
              // Write stuff into PDF
              //pdf.text('Hello World');
              
              // Stream contents to a file
              pdf.pipe(
                fs.createWriteStream(__dirname + '/public/uploads/' + user + '/file.pdf')
              )
                .on('finish', function () {
                  console.log('PDF closed');
                });
              
              // Close PDF and write file.
              pdf.end();
        }
    });
});
*/

app.get('/excel', async function (req, res) {
    const nodeExcel = require('excel-export');
    const dateFormat = require('dateformat');
    var conf = {}

    var arr = [];

    conf.cols = [{
        caption: 'ID.',
        type: 'number',
        width: 3
    },
    {
        caption: 'User ID',
        type: 'string',
        width: 50
    },
    {
        caption: 'Location',
        type: 'string',
        width: 75
    },
    {
        caption: 'SQL',
        type: 'string',
        width: 150
    },
    {
        caption: 'Start TM',
        type: 'string',
        width: 75
    },
    {
        caption: 'End TM',
        type: 'string',
        width: 75
    },
    {
        caption: 'Error',
        type: 'string',
        width: 150
    },
    {
        caption: 'Error Desc',
        type: 'string',
        width: 150
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

        arr = [];
        for (var i = 0; i < resultObj.data[0].length; i++) {
            var a = [
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
        conf.rows = arr;

        //conf.rows= resultObj.data[0];
        var result = nodeExcel.execute(conf);
        console.log(Date.now())
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment;filename=" + "todo.xlsx");
        console.log(Date.now())
        res.end(result, 'binary');
        //res.status(200).send(new Buffer(result.toString(),'binary').toString("base64"));
    }
});

app.get('/cadetexcel', async function (req, res) {
    var file = __dirname + '/public/CadetListDownloadExcel.xlsx';
    res.download(file); // Set disposition and send it.
});

app.get('/budgetexcel', async function (req, res) {
    var file = __dirname + '/public/budget.xlsx';
    res.download(file); // Set disposition and send it.
});

app.get('/statusexcel', async function (req, res) {
    var file = __dirname + '/public/StatusOfCadetApplications.xlsx';
    res.download(file); // Set disposition and send it.
});


//passport.authenticate('jwt', { session: false })
app.post("/toLoadSvc", function (req, res) {
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
        parm[0] = req.body.hv_email;
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

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            var output = JSON.stringify({ "message": "ok", "token": null, "result": { val: 1, msg: "email sent to reset your password." } });
            res.status(200).json(output);
        } else {
            var output = JSON.stringify({ "message": "ok", "token": null, "result": { val: -1, msg: "Please Enter a Valid email that was registered." } });
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
        parm[0] = req.body.name;

        const tmpData = await new DBase.DB.execSP("sps_getcadets", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {

            var output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
            res.status(200).json(output);
        } else {
            var output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
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
        parm[0] = req.body.name;

        const tmpData = await new DBase.DB.execSP("sps_getMentors", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {

            var output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
            res.status(200).json(output);
        } else {
            var output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
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
        parm[0] = req.body.name;

        const tmpData = await new DBase.DB.execSP("sps_getBudgets", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {

            var output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
            res.status(200).json(output);
        } else {
            var output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
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
        parm[0] = req.body.name;

        const tmpData = await new DBase.DB.execSP("sps_getPurchases", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {

            var output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
            res.status(200).json(output);
        } else {
            var output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
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
        parm[0] = req.body.name;

        const tmpData = await new DBase.DB.execSP("sps_getApprovals", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {

            var output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
            res.status(200).json(output);
        } else {
            var output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
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
        parm[0] = req.body.name;

        const tmpData = await new DBase.DB.execSP("sps_getSchedules", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        //console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {

            var output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
            res.status(200).json(output);
        } else {
            var output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
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
        parm[0] = req.body.userID;
        parm[1] = req.body.currPWD;
        parm[2] = req.body.newPWD;
        parm[3] = req.body.emailReset

        const tmpData = await DBase.DB.execSP("spu_updatePWD", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {

            var output = JSON.stringify({ "message": "ok", "token": null, "result": { val: resultObj.data[0][0].hv_return, msg: resultObj.data[0][0].hv_msg } });
            res.status(200).json(output);
        } else {
            var output = JSON.stringify({ "message": "ok", "token": null, "result": { val: -1, msg: "Please contact HelpDesk." } });
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
        parm[0] = req.body.secToken;


        const tmpData = await DBase.DB.execSP("sps_checkPWDToken", parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        if (resultObj.data[0].length > 0) {

            var output = JSON.stringify({ "message": "ok", "token": null, "result": { hv_user_id: resultObj.data[0][0].hv_user_id, msg: "", val: 1 } });
            res.status(200).json(output);
        } else {
            var output = JSON.stringify({ "message": "ok", "token": null, "result": { val: -1, msg: "Reset Link is not valid. Please contact HelDesk." } });
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


async function getRoles(uid, lstupdts, funcId) {

    var result;
    try {
        var url = await getURLs('roles');
        //var url = "http://localhost:3001/loginsvc";        
        console.log(url);
        /*
        var parmstr = JSON.stringify(req.body);
        console.log(parmstr)
        //let parmstr = JSON.stringify(req.query);
        var parms = JSON.parse(parmstr);

        console.log(parms)
        var uid;
        var lstupdts;
        var funcId;
        
        if (req.body.uid && req.body.lstupdts && req.body.funcId) {
            uid = req.body.uid;
            lstupdts = req.body.lstupdts;
            funcId =  req.body.funcId;
        }
        

        uid = parms.uid;
        lstupdts = parms.lstupdts;
        funcId = parms.funcId;
        
        //console.log(name)
        //console.log(password)
        */

        var parmsObj = JSON.stringify({
            uid: uid,
            lstupdts: lstupdts,
            funcId: funcId
        });

        //console.log(parmsObj);

        const data = await fetch(url, {
            method: 'POST',
            body: parmsObj,
            headers: { 'Content-Type': 'application/json' },
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            //headers: { 'Content-Type': 'application/json',
            //'Content-Length': parms.length    
        })

        result = await data.json();

    } catch (e) {
        //console.log("in catch")
        var output = JSON.stringify({ "message": "fail", "val": "-1", "result": e.message, "roles": {} });
        return output;
        //res.status(400).json(output);
        //res.status(500).end();
    }

    //console.log("out")
    //console.log(result)
    //console.log(JSON.parse(result));

    //console.log(JSON.parse(result).message)
    var resultObj = JSON.parse(result);
    if (resultObj.message == "ok") {
        if (resultObj.hasAccess == "N") {
            var output = JSON.stringify({ "message": "fail", "val": "-2", "result": resultObj.result, "roles": {} });
            //res.status(400).json(output);
            return output;
        } else {
            var output = JSON.stringify({ "message": "ok", "val": "0", "result": "", "roles": resultObj.roles });
            return output;
        }
        //res.status(200).json(output);
    } else {
        if (resultObj.hasAccess == "N") {
            var output = JSON.stringify({ "message": "fail", "val": "-2", "result": resultObj.result, "roles": {} });
            //res.status(400).json(output);
            return output;
        } else {
            var output = JSON.stringify({ "message": "fail", "val": "-1", "result": resultObj.result, "roles": {} });
            return output;
            //res.status(400).json(output);
        }
    }
}

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

        var lastupdts = (new Date()).toLocaleDateString();
        if (req.body.lstupdts) {
            lastupdts = req.body.lstupdts
        }
        var funcId = "0";
        var roleStr = await getRoles(name, lastupdts, funcId);
        //console.log(roleStr)

        var roleObj = JSON.parse(roleStr);
        var roles = {};
        var lstUpdTs = null;
        if (roleObj.message == "ok") {
            if (roleObj.roles) {
                roles = roleObj.roles;
            }
            if (roleObj.lstUpdTs) {
                lstUpdTs = roleObj.lstUpdTs;
            }
        }

        var payload = { userId: name, authID: authId, lstUpdTs: lstUpdTs };
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


        var output = JSON.stringify({ "message": "ok", "token": token, "result": JSON.parse(result).result, "name": JSON.parse(result).name, roles: roles });
        res.status(200).json(output);

    } else {
        var output = JSON.stringify({ "message": JSON.parse(result).result, "result": JSON.parse(result).message });
        res.status(200).json(output);
    }
    //res.send(result);
    //console.log(result);
});


app.post("/rolesvc", async function (req, res) {
    var result;

    try {
        var url = await getURLs('roles');
        //var url = "http://localhost:3001/loginsvc";        
        console.log(url);


        var parmstr = JSON.stringify(req.body);
        console.log(parmstr)
        //let parmstr = JSON.stringify(req.query);
        var parms = JSON.parse(parmstr);

        console.log(parms)
        var uid;
        var lstupdts;
        var funcId;
        /*
        if (req.body.uid && req.body.lstupdts && req.body.funcId) {
            uid = req.body.uid;
            lstupdts = req.body.lstupdts;
            funcId =  req.body.funcId;
        }
        */

        uid = parms.uid;
        lstupdts = parms.lstupdts;
        funcId = parms.funcId;

        //console.log(name)
        //console.log(password)

        var parmsObj = JSON.stringify({
            uid: uid,
            lstupdts: lstupdts,
            funcId: funcId
        });

        console.log(parmsObj);

        const data = await fetch(url, {
            method: 'POST',
            body: parmsObj,
            headers: { 'Content-Type': 'application/json' },
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            //headers: { 'Content-Type': 'application/json',
            //'Content-Length': parms.length    
        })

        result = await data.json();

    } catch (e) {
        var output = JSON.stringify({ "message": "fail", "token": null, "val": "-1", "result": e.message });
        res.status(400).json(output);
        //res.status(500).end();
    }

    console.log(result)
    //console.log(JSON.parse(result).message)
    var resultObj = JSON.parse(result);

    if (resultObj.message == "ok") {

        var output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.roles });
        res.status(200).json(output);

    } else {
        if (resultObj.hasAccess == "N") {
            var output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": resultObj.result });
            res.status(400).json(output);
        } else {
            var output = JSON.stringify({ "message": "fail", "token": null, "val": "-1", "result": resultObj.result });
            res.status(400).json(output);
        }
    }
    //res.send(result);
    console.log(result);
});

app.post("/getTables", async function (req, res) {
    var result;

    try {

        const parm = [];
        parm[0] = req.body.tableTag;
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
        console.log(req.body.hv_table_i)

        const parm = [];
        parm[0] = req.body.hv_table_i;
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
        parm[0] = req.body.hv_table_i;
        parm[1] = req.body.hv_universal_i;
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
        parm[0] = req.body.hv_table_i;
        parm[1] = req.body.hv_universal_i;
        parm[2] = req.body.hv_universal_name;

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
        parm[0] = req.body.hv_table_i;
        parm[1] = req.body.hv_universal_name;

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

app.post('/ExportToExcel', async function (req, res) {
    const nodeExcel = require('excel-export');
    const dateFormat = require('dateformat');
    var conf = {}
    var arr = [];

    conf.stylesXmlFile = "./styles.xml";
    conf.name = "mysheet";

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

        arr = [];
        for (var i = 0; i < resultObj.data[0].length; i++) {
            let a = [];
            colNameArr.forEach((key, index) => {
                //console.log(key)
                //console.log(resultObj.data[0][i])
                //console.log(resultObj.data[0][i][key])                   
                a.push(resultObj.data[0][i][key])
            });

            //console.log(a)
            arr.push(a);
        }
        conf.rows = arr;

        //console.log(arr)
        //conf.rows= resultObj.data[0];
        var result = nodeExcel.execute(conf);
        console.log(Date.now())
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment;filename=" + "todo.xlsx");
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

const checkToken = async (token) => {

    console.log('payload received', token);
    const tmpData, resultObj;

    //Log the token in database
    try {
        var parm = [];
        parm[0] = token;

        tmpData = await DBase.DB.execSP("sps_checktoken", parm);
        console.log(tmpData)
        resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        console.log(resultObj.data[0][0].validToken);

    } catch (e) {
        console.log(e)
        //res.status(500).end();
    }

    if (resultObj.data[0][0].validToken == "Y") {
        return true;
    } else {
        return false;
    }
};


app.post("/ExecSP", async function (req, res, next) {
    var result;
    var refreshedToken = null;
    var roles = {};
    var lstUpdTs;
    var funcId;
    //console.log("execSp")
    //console.log(req)
    console.log(req.body.token)
    //console.log(config.get(env + ".token").timeout);

    /*
    passport.authenticate('jwt', function (err,user,info) {
        if(err) { return next(err); }
        console.log(user)
        console.log(info)
    }
    )(req,res,next);
    */

    //passport.authenticate('jwt', { session: false }),
    //console.log(req.get('Authorization'))
    if (req.body.token) {
        var token = req.body.token;//req.get('Authorization');
        token = token.toString().replace("JWT ", "")

        //console.log(token);
        var originalDecoded = jwt.decode(token, { complete: true });
        //console.log(JSON.stringify(originalDecoded));
        //console.log(originalDecoded.payload.authID);
        //console.log( Number(originalDecoded.payload.exp))
        //console.log((Date.now().valueOf()/ 1000))
        //console.log(new Date(originalDecoded.payload.exp * 1000))


        if (Number(originalDecoded.payload.exp) < (Date.now().valueOf() / 1000)) {
            var output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "Token expired." });
            return res.status(400).json(output);
        }

        var retVal = await checkToken(originalDecoded.payload.authID)
        if (!retVal) {
            var output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "Not a valid token." });
            return res.status(400).json(output);
        }

        //var output = JSON.stringify({ "message": "fail", "token": null, "result": "expired" });
        //res.status(200).json(output);
        /*
        lstUpdTs = (new Date()).toLocaleDateString();
        if(req.body.lstUpdTs) {
            lstUpdTs = req.body.lstUpdTs
        }
        */
        refreshedToken = jwt.refresh(originalDecoded, Number(config.get(env + ".token").timeout || 300), jwtOptions.secretOrKey);

        if (originalDecoded.payload.lstUpdTs) {
            lstUpdTs = originalDecoded.payload.lstUpdTs;
        } else {
            lstUpdTs = (new Date()).toLocaleDateString();
        }

        funcId = "0";
        if (req.body.funcId) {
            funcId = req.body.funcId
        }

        var roleStr = await getRoles(originalDecoded.payload.userId, lstUpdTs, funcId);
        console.log(roleStr)
        var roleObj = JSON.parse(roleStr);
        if (roleObj.message == "ok") {
            if (roleObj.roles) {
                roles = roleObj.roles;
                lstUpdTs = roleObj.lstUpdTs;
                originalDecoded.payload.lstUpdTs = lstUpdTs;
                refreshedToken = jwt.refresh(originalDecoded, Number(config.get(env + ".token").timeout || 300), jwtOptions.secretOrKey);
            }
        } else {
            var output;
            if (roleObj.val == "-2") {
                output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": roleObj.result });
                return res.status(400).json(output);
            } else {
                output = JSON.stringify({ "message": "fail", "token": refreshedToken, "val": roleObj.val, "result": roleObj.result });
                return res.status(400).json(output);
            }
        }
        //console.log(refreshedToken)
        // new 'exp' value is later in the future. 
        //console.log(JSON.stringify(jwt.decode(refreshed, { complete: true })));           

    } else {
        // if there is no token
        // return an error
        var output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "No token provided." });
        return res.status(400).json(output);
    }


    let spName = req.body.spName;
    let parmstr = JSON.stringify(req.body.parms);
    //console.log(parmstr) 
    let parms = JSON.parse(parmstr);
    //console.log(parms)
    const parm = [];

    try {

        let keyArr = Object.keys(parms);
        //console.log(keyArr);
        // loop through the object, pushing values to the return array
        keyArr.forEach((key, index) => {
            //console.log(key);
            parm[index] = parms[key];
        });

        //parm[0] =  req.body.hv_table_i;
        //parm[1] =  req.body.hv_universal_name;

        const tmpData = await DBase.DB.execSP(spName, parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        var output = JSON.stringify({ "message": "ok", "token": refreshedToken, "val": "0", "result": resultObj.data[0], roles: roles });
        res.status(200).json(output);
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        var output = JSON.stringify({ "message": "fail", "token": null, "val": "-1", "result": e.message });
        res.status(400).json(output);
        //res.status(500).end();
    }

    //res.send(result);
});

app.post("/ExecSPM", async function (req, res, next) {
    var result;
    var refreshedToken = null;
    var roles = {};
    var lstUpdTs;
    var funcId;
    //console.log("execSp")
    //console.log(req)
    console.log(req.body.token)
    //console.log(config.get(env + ".token").timeout);

    /*
    passport.authenticate('jwt', function (err,user,info) {
        if(err) { return next(err); }
        console.log(user)
        console.log(info)
    }
    )(req,res,next);
    */

    //passport.authenticate('jwt', { session: false }),
    //console.log(req.get('Authorization'))
    if (req.body.token) {
        var token = req.body.token;//req.get('Authorization');
        token = token.toString().replace("JWT ", "")

        //console.log(token);
        var originalDecoded = jwt.decode(token, { complete: true });
        //console.log(JSON.stringify(originalDecoded));
        //console.log(originalDecoded.payload.authID);
        //console.log( Number(originalDecoded.payload.exp))
        //console.log((Date.now().valueOf()/ 1000))
        //console.log(new Date(originalDecoded.payload.exp * 1000))


        if (Number(originalDecoded.payload.exp) < (Date.now().valueOf() / 1000)) {
            var output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "Token expired." });
            return res.status(400).json(output);
        }

        var retVal = await checkToken(originalDecoded.payload.authID)
        if (!retVal) {
            var output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "Not a valid token." });
            return res.status(400).json(output);
        }

        //var output = JSON.stringify({ "message": "fail", "token": null, "result": "expired" });
        //res.status(200).json(output);
        /*
        lstUpdTs = (new Date()).toLocaleDateString();
        if(req.body.lstUpdTs) {
            lstUpdTs = req.body.lstUpdTs
        }
        */
        refreshedToken = jwt.refresh(originalDecoded, Number(config.get(env + ".token").timeout || 300), jwtOptions.secretOrKey);

        if (originalDecoded.payload.lstUpdTs) {
            lstUpdTs = originalDecoded.payload.lstUpdTs;
        } else {
            lstUpdTs = (new Date()).toLocaleDateString();
        }

        funcId = "0";
        if (req.body.funcId) {
            funcId = req.body.funcId
        }

        var roleStr = await getRoles(originalDecoded.payload.userId, lstUpdTs, funcId);
        console.log(roleStr)
        var roleObj = JSON.parse(roleStr);
        if (roleObj.message == "ok") {
            if (roleObj.roles) {
                roles = roleObj.roles;
                lstUpdTs = roleObj.lstUpdTs;
                originalDecoded.payload.lstUpdTs = lstUpdTs;
                refreshedToken = jwt.refresh(originalDecoded, Number(config.get(env + ".token").timeout || 300), jwtOptions.secretOrKey);
            }
        } else {
            var output;
            if (roleObj.val == "-2") {
                output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": roleObj.result });
                return res.status(400).json(output);
            } else {
                output = JSON.stringify({ "message": "fail", "token": refreshedToken, "val": roleObj.val, "result": roleObj.result });
                return res.status(400).json(output);
            }
        }
        //console.log(refreshedToken)
        // new 'exp' value is later in the future. 
        //console.log(JSON.stringify(jwt.decode(refreshed, { complete: true })));           

    } else {
        // if there is no token
        // return an error
        var output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "No token provided." });
        return res.status(400).json(output);
    }


    let spName = req.body.spName;
    let parmstr = JSON.stringify(req.body.parms);
    //console.log(parmstr) 
    let parms = JSON.parse(parmstr);
    //console.log(parms)
    const parm = [];

    try {

        let keyArr = Object.keys(parms);
        //console.log(keyArr);
        // loop through the object, pushing values to the return array
        keyArr.forEach((key, index) => {
            //console.log(key);
            parm[index] = parms[key];
        });

        //parm[0] =  req.body.hv_table_i;
        //parm[1] =  req.body.hv_universal_name;

        const tmpData = await DBase.DB.execSP(spName, parm);

        //console.log(tmpData)
        const resultObj = JSON.parse(tmpData);
        console.log(resultObj.data[0]);
        var output = JSON.stringify({ "message": "ok", "token": refreshedToken, "val": "0", "result": resultObj.data, roles: roles });
        res.status(200).json(output);
        //console.log(resultObj.data[0][0].validToken);
        //console.log(tmpData)
        //console.log(tmpData.data[0].hv_auth_code)
    } catch (e) {
        var output = JSON.stringify({ "message": "fail", "token": null, "val": "-1", "result": e.message });
        res.status(400).json(output);
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