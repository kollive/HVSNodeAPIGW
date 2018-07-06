'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var jwt = require('jsonwebtoken-refresh');
//const passport = require('passport');
//const passportJWT = require('passport-jwt');
var mssql = require('mssql');
var DBase = require('./api/mssql');
var stream = require('stream');
var _ = require('lodash');
var fs = require('fs');
var fetch = require('node-fetch');
var nodemailer = require('nodemailer');
var upload = require('jquery-file-upload-middleware');
var config = require("config");
//const axios = require('axios');
//const ExtractJwt = passportJWT.ExtractJwt;
//const JwtStrategy = passportJWT.Strategy;
var env = process.env.NODE_ENV || "Dev";
var jwtOptions = {};
//jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil';
// configure upload middleware
upload.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/uploads',
    imageVersions: {
        thumbnail: {
            width: 80,
            height: 80
        }
    }
});
/*
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
var PORT = process.env.PORT || 3003;
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = http.Server(app);
var io = require("socket.io")(server);
//var pool;
app.use('*', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Headers");
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
            console.log('Time:', Date.now());
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
            next();
            return [2 /*return*/];
        });
    });
});
// Socket.io
//const io = socket_io().listen(server);
//app.io = socket_io;
//DB = new DBase.DB();
DBase.DB.on('error', function (err) {
    console.log(err.message);
});
function getURLs(svcName) {
    return __awaiter(this, void 0, void 0, function () {
        var result, resultObj, results, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, DBase.DB.execSQl("select gs_name, gs_url from tAPIURL")];
                case 1:
                    result = _a.sent();
                    resultObj = JSON.parse(result);
                    console.log(resultObj.data[0]);
                    results = _.filter(resultObj.data[0], function (obj) {
                        //console.log(obj.gs_name)
                        return obj.gs_name.indexOf(svcName) !== -1;
                    });
                    return [2 /*return*/, results[0].gs_url];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, err_1];
                case 3: return [2 /*return*/];
            }
        });
    });
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
app.use('/upload', upload.fileHandler());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.io = io.sockets.on('connection', function (socket) {
    console.log('a user connected');
    //send Ping to client connection
    socket.emit('ping', { type: 'INCOMING_PONG_PAYLOAD', payload: 'ping from server' });
    // receive from client (index.ejs) with socket.on
    socket.on('add-message', function (msg) {
        console.log('new add message: ' + msg);
        // send to client (index.ejs) with app.io.emit
        // here it reacts direct after receiving a message from the client
        //app.io.emit('chat-message', msg);
    });
    socket.on('pong-message', function (data) {
        console.log('new pong message: ' + data);
        //socket.emit('ping', { type: 'INCOMING_PONG_PAYLOAD', payload: 'pong response from server' });
        // send to client (index.ejs) with app.io.emit
        // here it reacts direct after receiving a message from the client
        //app.io.emit('chat-message', msg);
    });
});
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
app.get('/excel', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var nodeExcel, dateFormat, conf, arr, parm, tmpData, resultObj, i, a, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nodeExcel = require('excel-export');
                    dateFormat = require('dateformat');
                    conf = {};
                    arr = [];
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
                    parm = [];
                    console.log("Before SQL");
                    console.log(Date.now());
                    return [4 /*yield*/, DBase.DB.execSQl("select top 100 gs_id,gs_user_i,gs_oru_i,gs_Sql,gs_strt_tm,gs_end_tm,gs_err,gs_err_desc from tdblog")];
                case 1:
                    tmpData = _a.sent();
                    console.log(tmpData);
                    resultObj = JSON.parse(tmpData);
                    //console.log(resultObj.data[0]);
                    console.log(Date.now());
                    if (resultObj.data[0].length > 0) {
                        arr = [];
                        for (i = 0; i < resultObj.data[0].length; i++) {
                            a = [
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
                        result = nodeExcel.execute(conf);
                        console.log(Date.now());
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                        res.setHeader("Content-Disposition", "attachment;filename=" + "todo.xlsx");
                        console.log(Date.now());
                        res.end(result, 'binary');
                        //res.status(200).send(new Buffer(result.toString(),'binary').toString("base64"));
                    }
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/cadetexcel', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            file = __dirname + '/public/CadetListDownloadExcel.xlsx';
            res.download(file); // Set disposition and send it.
            return [2 /*return*/];
        });
    });
});
app.get('/budgetexcel', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            file = __dirname + '/public/budget.xlsx';
            res.download(file); // Set disposition and send it.
            return [2 /*return*/];
        });
    });
});
app.get('/statusexcel', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            file = __dirname + '/public/StatusOfCadetApplications.xlsx';
            res.download(file); // Set disposition and send it.
            return [2 /*return*/];
        });
    });
});
//passport.authenticate('jwt', { session: false })
app.post("/toLoadSvc", function (req, res) {
    try {
        console.log(req.get('Authorization'));
        var token = req.get('Authorization');
        token = token.toString().replace("JWT ", "");
        var originalDecoded = jwt.decode(token, { complete: true });
        console.log(JSON.stringify(originalDecoded));
        var refreshed = jwt.refresh(originalDecoded, 300, jwtOptions.secretOrKey);
        // new 'exp' value is later in the future. 
        console.log(JSON.stringify(jwt.decode(refreshed, { complete: true })));
        var output = JSON.stringify({ "message": "token refreshed", "token": refreshed, "result": 0 });
        res.status(200).json(output);
        //res.status(200).json({ "message": "Success! You can not see this without a token" });
    }
    catch (e) {
        console.log("error");
        console.log(e);
        var output = JSON.stringify({ "message": e, "token": null, "result": 0 });
        res.status(200).json(output);
    }
});
app.post("/sendEmail", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, transporter, htm, mailOptions, output, output, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log(req.body.hv_email);
                    parm = [];
                    parm[0] = req.body.hv_email;
                    return [4 /*yield*/, DBase.DB.execSP("sps_checkemail", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    console.log(resultObj.data[0]);
                    if (resultObj.data[0].length > 0) {
                        transporter = nodemailer.createTransport({
                            service: 'gmail',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'hvscadet@gmail.com',
                                pass: 'HudsonCadet!'
                            }
                        });
                        htm = "<div>Hi " + resultObj.data[0][0].hv_first_name + ",<br/><br/> We have received a request to reset your password. <br/> If you did not make this request, just ignore this message.";
                        htm += "Otherwise, you can reset your password using this link<br/><br/>";
                        //htm += "<a href=\'http://localhost:3000/changepwd/" + resultObj.data[0][0].hv_pwd_token + "\'> Click here to reset your password</a><br/>"
                        htm += "<a href=\'http://hvs.selfip.net:3000/changepwd/" + resultObj.data[0][0].hv_pwd_token + "\'> Click here to reset your password</a><br/>";
                        htm += "<br/>Thanks,<br/> The HVS Cadet Team";
                        console.log(htm);
                        mailOptions = {
                            from: 'HVSCadet@gmail.com',
                            to: 'kollive@hotmail.com;' + req.body.hv_email,
                            subject: 'Reset your Password',
                            html: htm
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        output = JSON.stringify({ "message": "ok", "token": null, "result": { val: 1, msg: "email sent to reset your password." } });
                        res.status(200).json(output);
                    }
                    else {
                        output = JSON.stringify({ "message": "ok", "token": null, "result": { val: -1, msg: "Please Enter a Valid email that was registered." } });
                        res.status(200).json(output);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/getCadets", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, output, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.name;
                    return [4 /*yield*/, new DBase.DB.execSP("sps_getcadets", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    //console.log(resultObj.data[0]);
                    if (resultObj.data[0].length > 0) {
                        output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
                        res.status(200).json(output);
                    }
                    else {
                        output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
                        res.status(200).json(output);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    console.log(e_2);
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/getMentors", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, output, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.name;
                    return [4 /*yield*/, new DBase.DB.execSP("sps_getMentors", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    //console.log(resultObj.data[0]);
                    if (resultObj.data[0].length > 0) {
                        output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
                        res.status(200).json(output);
                    }
                    else {
                        output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
                        res.status(200).json(output);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_3 = _a.sent();
                    console.log(e_3);
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/getBudgets", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, output, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.name;
                    return [4 /*yield*/, new DBase.DB.execSP("sps_getBudgets", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    //console.log(resultObj.data[0]);
                    if (resultObj.data[0].length > 0) {
                        output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
                        res.status(200).json(output);
                    }
                    else {
                        output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
                        res.status(200).json(output);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_4 = _a.sent();
                    console.log(e_4);
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/getPurchases", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, output, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.name;
                    return [4 /*yield*/, new DBase.DB.execSP("sps_getPurchases", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    //console.log(resultObj.data[0]);
                    if (resultObj.data[0].length > 0) {
                        output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
                        res.status(200).json(output);
                    }
                    else {
                        output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
                        res.status(200).json(output);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_5 = _a.sent();
                    console.log(e_5);
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/getApprovals", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, output, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.name;
                    return [4 /*yield*/, new DBase.DB.execSP("sps_getApprovals", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    //console.log(resultObj.data[0]);
                    if (resultObj.data[0].length > 0) {
                        output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
                        res.status(200).json(output);
                    }
                    else {
                        output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
                        res.status(200).json(output);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_6 = _a.sent();
                    console.log(e_6);
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/getSchedules", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, output, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.name;
                    return [4 /*yield*/, new DBase.DB.execSP("sps_getSchedules", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    //console.log(resultObj.data[0]);
                    if (resultObj.data[0].length > 0) {
                        output = JSON.stringify({ "token": null, "result": { items: resultObj.data[0], msg: "" } });
                        res.status(200).json(output);
                    }
                    else {
                        output = JSON.stringify({ "token": null, "result": { items: {}, msg: "Not Found." } });
                        res.status(200).json(output);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_7 = _a.sent();
                    console.log(e_7);
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/changePWD", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, output, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log(req.body.userID);
                    console.log(req.body.currPWD);
                    console.log(req.body.newPWD);
                    parm = [];
                    parm[0] = req.body.userID;
                    parm[1] = req.body.currPWD;
                    parm[2] = req.body.newPWD;
                    parm[3] = req.body.emailReset;
                    return [4 /*yield*/, DBase.DB.execSP("spu_updatePWD", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    console.log(resultObj.data[0]);
                    if (resultObj.data[0].length > 0) {
                        output = JSON.stringify({ "message": "ok", "token": null, "result": { val: resultObj.data[0][0].hv_return, msg: resultObj.data[0][0].hv_msg } });
                        res.status(200).json(output);
                    }
                    else {
                        output = JSON.stringify({ "message": "ok", "token": null, "result": { val: -1, msg: "Please contact HelpDesk." } });
                        res.status(200).json(output);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_8 = _a.sent();
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/checkToken", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, output, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log(req.body.userID);
                    console.log(req.body.currPWD);
                    console.log(req.body.newPWD);
                    parm = [];
                    parm[0] = req.body.secToken;
                    return [4 /*yield*/, DBase.DB.execSP("sps_checkPWDToken", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    console.log(resultObj.data[0]);
                    if (resultObj.data[0].length > 0) {
                        output = JSON.stringify({ "message": "ok", "token": null, "result": { hv_user_id: resultObj.data[0][0].hv_user_id, msg: "", val: 1 } });
                        res.status(200).json(output);
                    }
                    else {
                        output = JSON.stringify({ "message": "ok", "token": null, "result": { val: -1, msg: "Reset Link is not valid. Please contact HelDesk." } });
                        res.status(200).json(output);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_9 = _a.sent();
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
function getRoles(uid, lstupdts, funcId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, url, parmsObj, data, e_10, output, resultObj, output, output, output, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getURLs('roles')];
                case 1:
                    url = _a.sent();
                    //var url = "http://localhost:3001/loginsvc";        
                    console.log(url);
                    parmsObj = JSON.stringify({
                        uid: uid,
                        lstupdts: lstupdts,
                        funcId: funcId
                    });
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            body: parmsObj,
                            headers: { 'Content-Type': 'application/json' }
                        })];
                case 2:
                    data = _a.sent();
                    return [4 /*yield*/, data.json()];
                case 3:
                    result = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_10 = _a.sent();
                    output = JSON.stringify({ "message": "fail", "val": "-1", "result": e_10.message, "roles": {} });
                    return [2 /*return*/, output];
                case 5:
                    resultObj = JSON.parse(result);
                    if (resultObj.message == "ok") {
                        if (resultObj.hasAccess == "N") {
                            output = JSON.stringify({ "message": "fail", "val": "-2", "result": resultObj.result, "roles": {} });
                            //res.status(400).json(output);
                            return [2 /*return*/, output];
                        }
                        else {
                            output = JSON.stringify({ "message": "ok", "val": "0", "result": "", "roles": resultObj.roles });
                            return [2 /*return*/, output];
                        }
                        //res.status(200).json(output);
                    }
                    else {
                        if (resultObj.hasAccess == "N") {
                            output = JSON.stringify({ "message": "fail", "val": "-2", "result": resultObj.result, "roles": {} });
                            //res.status(400).json(output);
                            return [2 /*return*/, output];
                        }
                        else {
                            output = JSON.stringify({ "message": "fail", "val": "-1", "result": resultObj.result, "roles": {} });
                            return [2 /*return*/, output];
                            //res.status(400).json(output);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
app.post("/loginsvc", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, url, name, password, parms, data, e_11, uuidv4, authId, lastupdts, funcId, roleStr, roleObj, roles, lstUpdTs, payload, token, parm, tmpData, e_12, output, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getURLs('logon')];
                case 1:
                    url = _a.sent();
                    //var url = "http://localhost:3001/loginsvc";        
                    console.log(url);
                    if (req.body.usr && req.body.pwd) {
                        name = req.body.usr;
                        password = req.body.pwd;
                    }
                    console.log(name);
                    console.log(password);
                    parms = JSON.stringify({
                        usr: name,
                        pwd: password
                    });
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            body: parms,
                            headers: { 'Content-Type': 'application/json' }
                        })];
                case 2:
                    data = _a.sent();
                    return [4 /*yield*/, data.json()];
                case 3:
                    result = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_11 = _a.sent();
                    res.status(500).end();
                    return [3 /*break*/, 5];
                case 5:
                    console.log(result);
                    console.log(JSON.parse(result).message);
                    if (!(JSON.parse(result).message == 1)) return [3 /*break*/, 11];
                    uuidv4 = require('uuid/v4');
                    authId = uuidv4();
                    lastupdts = (new Date()).toLocaleDateString();
                    if (req.body.lstupdts) {
                        lastupdts = req.body.lstupdts;
                    }
                    funcId = "0";
                    return [4 /*yield*/, getRoles(name, lastupdts, funcId)];
                case 6:
                    roleStr = _a.sent();
                    roleObj = JSON.parse(roleStr);
                    roles = {};
                    lstUpdTs = null;
                    if (roleObj.message == "ok") {
                        if (roleObj.roles) {
                            roles = roleObj.roles;
                        }
                        if (roleObj.lstUpdTs) {
                            lstUpdTs = roleObj.lstUpdTs;
                        }
                    }
                    payload = { userId: name, authID: authId, lstUpdTs: lstUpdTs };
                    token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1h' });
                    console.log(token);
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    parm = [];
                    parm[0] = token;
                    parm[1] = name;
                    parm[2] = authId;
                    return [4 /*yield*/, DBase.DB.execSP("spi_taccesstoken", parm)];
                case 8:
                    tmpData = _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_12 = _a.sent();
                    console.log(e_12);
                    return [3 /*break*/, 10];
                case 10:
                    output = JSON.stringify({ "message": "ok", "token": token, "result": JSON.parse(result).result, "name": JSON.parse(result).name, roles: roles });
                    res.status(200).json(output);
                    return [3 /*break*/, 12];
                case 11:
                    output = JSON.stringify({ "message": JSON.parse(result).result, "result": JSON.parse(result).message });
                    res.status(200).json(output);
                    _a.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
});
app.post("/rolesvc", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, url, parmstr, parms, uid, lstupdts, funcId, parmsObj, data, e_13, output, resultObj, output, output, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getURLs('roles')];
                case 1:
                    url = _a.sent();
                    //var url = "http://localhost:3001/loginsvc";        
                    console.log(url);
                    parmstr = JSON.stringify(req.body);
                    console.log(parmstr);
                    parms = JSON.parse(parmstr);
                    console.log(parms);
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
                    parmsObj = JSON.stringify({
                        uid: uid,
                        lstupdts: lstupdts,
                        funcId: funcId
                    });
                    console.log(parmsObj);
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            body: parmsObj,
                            headers: { 'Content-Type': 'application/json' }
                        })];
                case 2:
                    data = _a.sent();
                    return [4 /*yield*/, data.json()];
                case 3:
                    result = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_13 = _a.sent();
                    output = JSON.stringify({ "message": "fail", "token": null, "val": "-1", "result": e_13.message });
                    res.status(400).json(output);
                    return [3 /*break*/, 5];
                case 5:
                    console.log(result);
                    resultObj = JSON.parse(result);
                    if (resultObj.message == "ok") {
                        output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.roles });
                        res.status(200).json(output);
                    }
                    else {
                        if (resultObj.hasAccess == "N") {
                            output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": resultObj.result });
                            res.status(400).json(output);
                        }
                        else {
                            output = JSON.stringify({ "message": "fail", "token": null, "val": "-1", "result": resultObj.result });
                            res.status(400).json(output);
                        }
                    }
                    //res.send(result);
                    console.log(result);
                    return [2 /*return*/];
            }
        });
    });
});
app.post("/getTables", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, e_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.tableTag;
                    return [4 /*yield*/, new DBase.DB.execSP("sps_getAttribTables", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
                    res.status(200).json(output);
                    return [3 /*break*/, 3];
                case 2:
                    e_14 = _a.sent();
                    console.log(e_14);
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/GetAttribTable", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, e_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("sps_getAttribTableValues");
                    console.log(req.body.hv_table_i);
                    parm = [];
                    parm[0] = req.body.hv_table_i;
                    return [4 /*yield*/, DBase.DB.execSP("sps_getAttribTableValues", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    console.log(resultObj.data[0]);
                    output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
                    res.status(200).json(output);
                    return [3 /*break*/, 3];
                case 2:
                    e_15 = _a.sent();
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/delAttribTable", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, e_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.hv_table_i;
                    parm[1] = req.body.hv_universal_i;
                    return [4 /*yield*/, DBase.DB.execSP("spd_AttribTableValues", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    console.log(resultObj.data[0]);
                    output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
                    res.status(200).json(output);
                    return [3 /*break*/, 3];
                case 2:
                    e_16 = _a.sent();
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/updAttribTable", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, e_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.hv_table_i;
                    parm[1] = req.body.hv_universal_i;
                    parm[2] = req.body.hv_universal_name;
                    return [4 /*yield*/, DBase.DB.execSP("spu_AttribTableValues", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    console.log(resultObj.data[0]);
                    output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
                    res.status(200).json(output);
                    return [3 /*break*/, 3];
                case 2:
                    e_17 = _a.sent();
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/insAttribTable", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result, parm, tmpData, resultObj, output, e_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parm = [];
                    parm[0] = req.body.hv_table_i;
                    parm[1] = req.body.hv_universal_name;
                    return [4 /*yield*/, DBase.DB.execSP("spi_AttribTableValues", parm)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    console.log(resultObj.data[0]);
                    output = JSON.stringify({ "message": "ok", "token": null, "result": resultObj.data[0] });
                    res.status(200).json(output);
                    return [3 /*break*/, 3];
                case 2:
                    e_18 = _a.sent();
                    res.status(500).end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post('/ExportToExcel', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var nodeExcel, dateFormat, conf, arr, SQL, parm, tmpData, resultObj, colNameArr, _loop_1, i, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nodeExcel = require('excel-export');
                    dateFormat = require('dateformat');
                    conf = {};
                    arr = [];
                    conf.stylesXmlFile = "./styles.xml";
                    conf.name = "mysheet";
                    conf.cols = JSON.parse(JSON.stringify(req.body.cols));
                    console.log(conf.cols);
                    SQL = req.body.spName;
                    console.log(SQL);
                    parm = [];
                    return [4 /*yield*/, DBase.DB.execSQl(SQL)];
                case 1:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    colNameArr = Object.keys(resultObj.columns);
                    if (resultObj.data[0].length > 0) {
                        arr = [];
                        _loop_1 = function () {
                            var a = [];
                            colNameArr.forEach(function (key, index) {
                                //console.log(key)
                                //console.log(resultObj.data[0][i])
                                //console.log(resultObj.data[0][i][key])                   
                                a.push(resultObj.data[0][i][key]);
                            });
                            //console.log(a)
                            arr.push(a);
                        };
                        for (i = 0; i < resultObj.data[0].length; i++) {
                            _loop_1();
                        }
                        conf.rows = arr;
                        result = nodeExcel.execute(conf);
                        console.log(Date.now());
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                        res.setHeader("Content-Disposition", "attachment;filename=" + "todo.xlsx");
                        console.log(Date.now());
                        res.end(result, 'binary');
                        //res.status(200).send(new Buffer(result.toString(),'binary').toString("base64"));
                    }
                    return [2 /*return*/];
            }
        });
    });
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
var checkToken = function (token) { return __awaiter(_this, void 0, void 0, function () {
    var tmpData, resultObj, parm, e_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('payload received', token);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                parm = [];
                parm[0] = token;
                return [4 /*yield*/, DBase.DB.execSP("sps_checktoken", parm)];
            case 2:
                tmpData = _a.sent();
                console.log(tmpData);
                resultObj = JSON.parse(tmpData);
                console.log(resultObj.data[0]);
                console.log(resultObj.data[0][0].validToken);
                return [3 /*break*/, 4];
            case 3:
                e_19 = _a.sent();
                console.log(e_19);
                return [3 /*break*/, 4];
            case 4:
                if (resultObj.data[0][0].validToken == "Y") {
                    return [2 /*return*/, true];
                }
                else {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
        }
    });
}); };
app.post("/ExecSP", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var result, refreshedToken, roles, lstUpdTs, funcId, token, originalDecoded, output, retVal, output, roleStr, roleObj, output, output, spName, parmstr, parms, parm, keyArr, tmpData, resultObj, output, e_20, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refreshedToken = null;
                    roles = {};
                    //console.log("execSp")
                    //console.log(req)
                    console.log(req.body.token);
                    if (!req.body.token) return [3 /*break*/, 3];
                    token = req.body.token;
                    token = token.toString().replace("JWT ", "");
                    originalDecoded = jwt.decode(token, { complete: true });
                    //console.log(JSON.stringify(originalDecoded));
                    //console.log(originalDecoded.payload.authID);
                    //console.log( Number(originalDecoded.payload.exp))
                    //console.log((Date.now().valueOf()/ 1000))
                    //console.log(new Date(originalDecoded.payload.exp * 1000))
                    if (Number(originalDecoded.payload.exp) < (Date.now().valueOf() / 1000)) {
                        output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "Token expired." });
                        return [2 /*return*/, res.status(400).json(output)];
                    }
                    return [4 /*yield*/, checkToken(originalDecoded.payload.authID)];
                case 1:
                    retVal = _a.sent();
                    if (!retVal) {
                        output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "Not a valid token." });
                        return [2 /*return*/, res.status(400).json(output)];
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
                    }
                    else {
                        lstUpdTs = (new Date()).toLocaleDateString();
                    }
                    funcId = "0";
                    if (req.body.funcId) {
                        funcId = req.body.funcId;
                    }
                    return [4 /*yield*/, getRoles(originalDecoded.payload.userId, lstUpdTs, funcId)];
                case 2:
                    roleStr = _a.sent();
                    console.log(roleStr);
                    roleObj = JSON.parse(roleStr);
                    if (roleObj.message == "ok") {
                        if (roleObj.roles) {
                            roles = roleObj.roles;
                            lstUpdTs = roleObj.lstUpdTs;
                            originalDecoded.payload.lstUpdTs = lstUpdTs;
                            refreshedToken = jwt.refresh(originalDecoded, Number(config.get(env + ".token").timeout || 300), jwtOptions.secretOrKey);
                        }
                    }
                    else {
                        if (roleObj.val == "-2") {
                            output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": roleObj.result });
                            return [2 /*return*/, res.status(400).json(output)];
                        }
                        else {
                            output = JSON.stringify({ "message": "fail", "token": refreshedToken, "val": roleObj.val, "result": roleObj.result });
                            return [2 /*return*/, res.status(400).json(output)];
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "No token provided." });
                    return [2 /*return*/, res.status(400).json(output)];
                case 4:
                    spName = req.body.spName;
                    parmstr = JSON.stringify(req.body.parms);
                    parms = JSON.parse(parmstr);
                    parm = [];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    keyArr = Object.keys(parms);
                    //console.log(keyArr);
                    // loop through the object, pushing values to the return array
                    keyArr.forEach(function (key, index) {
                        //console.log(key);
                        parm[index] = parms[key];
                    });
                    return [4 /*yield*/, DBase.DB.execSP(spName, parm)];
                case 6:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    console.log(resultObj.data[0]);
                    output = JSON.stringify({ "message": "ok", "token": refreshedToken, "val": "0", "result": resultObj.data[0], roles: roles });
                    res.status(200).json(output);
                    return [3 /*break*/, 8];
                case 7:
                    e_20 = _a.sent();
                    output = JSON.stringify({ "message": "fail", "token": null, "val": "-1", "result": e_20.message });
                    res.status(400).json(output);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
});
app.post("/ExecSPM", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var result, refreshedToken, roles, lstUpdTs, funcId, token, originalDecoded, output, retVal, output, roleStr, roleObj, output, output, spName, parmstr, parms, parm, keyArr, tmpData, resultObj, output, e_21, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refreshedToken = null;
                    roles = {};
                    //console.log("execSp")
                    //console.log(req)
                    console.log(req.body.token);
                    if (!req.body.token) return [3 /*break*/, 3];
                    token = req.body.token;
                    token = token.toString().replace("JWT ", "");
                    originalDecoded = jwt.decode(token, { complete: true });
                    //console.log(JSON.stringify(originalDecoded));
                    //console.log(originalDecoded.payload.authID);
                    //console.log( Number(originalDecoded.payload.exp))
                    //console.log((Date.now().valueOf()/ 1000))
                    //console.log(new Date(originalDecoded.payload.exp * 1000))
                    if (Number(originalDecoded.payload.exp) < (Date.now().valueOf() / 1000)) {
                        output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "Token expired." });
                        return [2 /*return*/, res.status(400).json(output)];
                    }
                    return [4 /*yield*/, checkToken(originalDecoded.payload.authID)];
                case 1:
                    retVal = _a.sent();
                    if (!retVal) {
                        output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "Not a valid token." });
                        return [2 /*return*/, res.status(400).json(output)];
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
                    }
                    else {
                        lstUpdTs = (new Date()).toLocaleDateString();
                    }
                    funcId = "0";
                    if (req.body.funcId) {
                        funcId = req.body.funcId;
                    }
                    return [4 /*yield*/, getRoles(originalDecoded.payload.userId, lstUpdTs, funcId)];
                case 2:
                    roleStr = _a.sent();
                    console.log(roleStr);
                    roleObj = JSON.parse(roleStr);
                    if (roleObj.message == "ok") {
                        if (roleObj.roles) {
                            roles = roleObj.roles;
                            lstUpdTs = roleObj.lstUpdTs;
                            originalDecoded.payload.lstUpdTs = lstUpdTs;
                            refreshedToken = jwt.refresh(originalDecoded, Number(config.get(env + ".token").timeout || 300), jwtOptions.secretOrKey);
                        }
                    }
                    else {
                        if (roleObj.val == "-2") {
                            output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": roleObj.result });
                            return [2 /*return*/, res.status(400).json(output)];
                        }
                        else {
                            output = JSON.stringify({ "message": "fail", "token": refreshedToken, "val": roleObj.val, "result": roleObj.result });
                            return [2 /*return*/, res.status(400).json(output)];
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    output = JSON.stringify({ "message": "fail", "token": null, "val": "-2", "result": "No token provided." });
                    return [2 /*return*/, res.status(400).json(output)];
                case 4:
                    spName = req.body.spName;
                    parmstr = JSON.stringify(req.body.parms);
                    parms = JSON.parse(parmstr);
                    parm = [];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    keyArr = Object.keys(parms);
                    //console.log(keyArr);
                    // loop through the object, pushing values to the return array
                    keyArr.forEach(function (key, index) {
                        //console.log(key);
                        parm[index] = parms[key];
                    });
                    return [4 /*yield*/, DBase.DB.execSP(spName, parm)];
                case 6:
                    tmpData = _a.sent();
                    resultObj = JSON.parse(tmpData);
                    console.log(resultObj.data[0]);
                    output = JSON.stringify({ "message": "ok", "token": refreshedToken, "val": "0", "result": resultObj.data, roles: roles });
                    res.status(200).json(output);
                    return [3 /*break*/, 8];
                case 7:
                    e_21 = _a.sent();
                    output = JSON.stringify({ "message": "fail", "token": null, "val": "-1", "result": e_21.message });
                    res.status(400).json(output);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
});
var api = require('./api');
app.use('/api', api.router);
app.use(express.static(__dirname + '/public'));
// app.use(express.json({limit:'50mb'}));
server.listen(PORT, function () {
    console.log("Listening on port " + PORT + "!");
});
//# sourceMappingURL=index.js.map