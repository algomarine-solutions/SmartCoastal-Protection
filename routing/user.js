//===========================================================================================================================    
//                                            SERVER CONFIGURATION
//===========================================================================================================================   

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const mysql = require('mysql');
const app = express.Router();

//===========================================================================================================================    
//                                             LOGGER SETUP
//===========================================================================================================================

log4js.configure({
    appenders: { everything: { type: 'file', filename: 'logs.log' } },
    categories: { default: { appenders: ['everything'], level: 'ALL' } }
});
  
const logger = log4js.getLogger();

//===========================================================================================================================    
//                                              MIDDLEWARE SETTING
//===========================================================================================================================
const allowedCORS = cors({ origin: true });
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//===========================================================================================================================    
//                                              SCRIPT STATUS
//===========================================================================================================================
const ENV = "dev";

//===========================================================================================================================    
//                                           MYSQL TABLES NAME
//===========================================================================================================================
const bantai_tab = "bangunanpantai";
const pertanyaan_tab = "pertanyaan";
const jawaban_tab = "jawaban";

//===========================================================================================================================    
//                                           MYSQL DATABASE
//===========================================================================================================================
if(ENV === 'dev') {
    var userDb = "root";
    var passwordDb = "abcdefgh1234!";
    var datbase = "smartcoastal_db";
}
//else {
//    var userDb =;
//    var passwordDb = ;
//    var datbase = ;
//}

const db = mysql.createConnection({
    host: "localhost",
    user: userDb,
    password: passwordDb,
    database: datbase
})

db.connect(function(err) {
    if(err) {
        var errDate = new Date;
        console.log(err);
        logger.debug(String(errDate) + ": " + err);
    }
})

//===========================================================================================================================    
//                                            ROUTING PAGE
//===========================================================================================================================

app.get('/', (req, res) => {
    res.render("user_home.ejs")
})

app.get('/tipebangunan', (req, res) => {
    let sql = "SELECT nama, filename, ID, kategori FROM " + bantai_tab;
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
            var date = new Date;
            logger.debug(date.toLocaleString() + ": " + err);
            res.sendStatus(500);
        }
        else {
            var bw = "";
            var sw = "";
            var gro = "";
            var jet = "";
            var lain = "";
            result.forEach(function(data) {
                var filestring = data.filename.substring(data.filename.lastIndexOf(".")+1, data.filename.length);
                var ban = `<div class="bangunan">
                            <div class="gambar"></div>
                                <a href="/detail?id=` + data.ID + `"><img src="../temp/img/` + data.ID + "." + filestring + `" width="300px"></a>
                            <div class="tulisan">
                                <a href="/detail?id=` + data.ID + `"><h3>` + data.nama + `</h3></a>
                            </div>
                           </div>`;

                var category = data.kategori;
                if(category === "breakwater") {
                    bw += ban;
                } else if(category === "groin") {
                    gro += ban;
                } else if(category === "jetty") {
                    jet += ban;
                } else if(category === "seawall") {
                    sw += ban;
                } else {
                    lain += ban;
                }
            })
            res.render("user_tipebangunan.ejs", {bre: bw, gro: gro, sea: sw, jet: jet, lai: lain})
        }
    })
})

app.get('/quiz', (req, res) => {
    let sql = "SELECT * FROM " + pertanyaan_tab;
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
            var date = new Date;
            logger.debug(date.toLocaleString() + ": " + err);
            res.sendStatus(500);
        }
        else if(typeof result[0] === "undefined") {
            res.render('user_quiz.ejs', {pertanyaan: ""});
        }
        else {
            let sql = "SELECT * FROM " + jawaban_tab;
            db.query(sql, (err, kolen) => {
                if(err) {
                    console.log(err)
                    var date = new Date;
                    logger.debug(date.toLocaleString() + ": " + err);
                    res.sendStatus(500);
                }
                else {
                    var daisi = "";
                    var add = 1;

                    result.forEach(function(derrdata) {
                        var kumjaw = "";

                        kolen.forEach(function(didi) {
                            if(didi.pertaID === derrdata.ID) {
                                kumjaw += `<p class="tulisan2"><input class="choose" type="radio" name="` + didi.pertaID + `" id="` + didi.ID + `" value="` + didi.ID + `" required><label for="` + didi.ID + `">` + didi.jawaban + `</label></p>`
                            }
                        })

                        if(add === 1) {
                            var buttongroup = `<div class="btn-box">
                                                    <button type="button" id="next.` + add + `" value="` + add + `" onclick="nextfunc(value)">Next</button>
                                                </div>`
                        }
                        else if(add === result.length) {
                            var buttongroup = `<div class="btn-box">
                                                    <button type="button" id="back.` + add + `" value="` + add + `" onclick="backfunc(value)">Back</button>
                                                    <button type="submit" onclick="formcheck()">Submit</button>
                                                </div>`
                        }
                        else {
                            var buttongroup = `<div class="btn-box">
                                                    <button type="button" id="back.` + add + `" value="` + add + `" onclick="backfunc(value)">Back</button>
                                                    <button type="button" id="next.` + add + `" value="` + add + `" onclick="nextfunc(value)">Next</button>
                                                </div>`
                        }

                        if(add === 1) {
                            daisi += `<div class="form" id="Form` + add + `">
                                    <p class="question"><b>` + derrdata.pertanyaan + `</b></p>
                                    <div class="baris1">
                                        ` + kumjaw + `
                                    </div>
                                    ` + buttongroup + `
                                </div>`
                        }
                        else {
                            daisi += `<div class="form" id="Form` + add + `" style="left: 450px;">
                                    <p class="question"><b>` + derrdata.pertanyaan + `</b></p>
                                    <div class="baris1">
                                        ` + kumjaw + `
                                    </div>
                                    ` + buttongroup + `
                                </div>`
                        }

                        add += 1;
                    })

                    res.render("user_quiz.ejs", {pertanyaan: daisi});
                }
            })
        }
    })
})

app.post('/quiz', [allowedCORS, urlencodedParser], (req, res) => {
    var data = req.body;
    var perta = Object.values(data);
    var kumban = [];

    let sql = "SELECT * FROM " + jawaban_tab + " WHERE ID IN ('" + perta.join("','") + "')";
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
            var date = new Date;
            logger.debug(date.toLocaleString() + ": " + err);
            res.sendStatus(500);
        }
        else if(typeof result[0] === "undefined") {
            res.sendStatus(403);
        }
        else {
            result.forEach(function(redida) {
                var perban = redida.banID.split(",");
                if(perban.length > 1) {
                    perban.forEach(function(apada) {
                        kumban.push(apada);
                    })
                }
                else {
                    kumban.push(redida["banID"]);
                }
            })

            function mode(arr){
                return arr.sort((a,b) =>
                      arr.filter(v => v===a).length
                    - arr.filter(v => v===b).length
                ).pop();
            }

            var hasil = mode(kumban);
            let sql = "SELECT * FROM " + bantai_tab + " WHERE ID = '" + hasil + "'";
            db.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                    var date = new Date;
                    logger.debug(date.toLocaleString() + ": " + err);
                    res.sendStatus(500);
                }
                else if(typeof result[0] === "undefined") {
                    res.sendStatus(404);
                }
                else {
                    var data = result[0];
                    var id = data.ID;
                    var title = data.nama.toUpperCase();
                    var filestring = data.filename.substring(data.filename.lastIndexOf(".")+1, data.filename.length);

                    res.render("user_hasil.ejs", {bantai: title, daid: id, ext: filestring})
                }
            })
        }
    })
})

app.get('/detail', (req, res) => {
    var id = req.query.id;
    let sql = "SELECT * FROM " + bantai_tab + " WHERE ID = '" + id + "'";
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
            var date = new Date;
            logger.debug(date.toLocaleString() + ": " + err);
            res.sendStatus(500);
        }
        else if(typeof result[0] === "undefined") {
            res.sendStatus(404);
        }
        else {
            var data = result[0];
            var title = data.nama;
            var teori = data.teori;
            var deskripsi = data.deskripsi;
            var kelekura = data.lebihKurang;
            var cara = data.caraPembangunan;

            res.render("user_detail.ejs", {title: title, teori: teori, deskripsi: deskripsi, lebihkurang: kelekura, caraba: cara})
        }
    })
})

module.exports = app;