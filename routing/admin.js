//===========================================================================================================================    
//                                            SERVER CONFIGURATION
//===========================================================================================================================   

const express = require('express');
const fileupload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');

const app = express.Router();
const upload = fileupload();
app.use(cookieParser(['%CN{NeU&c=3US`t-', '{SAZRmL~?.9b!`Qn', '!3$uXhK:<cF}qvN+', 'r`ceWB-/s2L+-/x@', 'crz#GP7,F?hf:DMX']));

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

/*
Note :
dev = in development mode
prod = in production/hosted mode

*/

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
//    var userDb = "diisi dengan user MySQL hostingan";
//    var passwordDb = "diisi dengan password MySQL hostingan";
//    var datbase = "diisi dengan nama database hostingan";
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
//                                            FUNCTIONS
//===========================================================================================================================

function uniqueIdCreation() {
    var newID            = '';
    var characters       = 'ABCYZ123abFmnop5678DEGHQRSTUVcdJKLe456fghijkOP0123rstuvwxWX789lqyzIMN49';
    var charactersLength = characters.length;
    for ( var i = 0; i < 16; i++ ) {
        newID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return newID
}

//===========================================================================================================================    
//                                            ROUTING PAGE
//===========================================================================================================================

app.get("/admin", (req, res) => {
    const cookie = req.signedCookies;
    if(cookie["inSession"] === "true") {
        res.redirect("/admin/home")
    }
    else {
        res.render("admin_login.ejs")
    }
})

app.post("/admin", [allowedCORS, urlencodedParser], (req, res) => {
    var data = req.body;
    if(data["loginAdmin"] !== "smartcoastal@gmail.com") {
        res.render("admin_login.ejs", {errormsg: "Wrong email address"})
    }
    else if(data["loginPassword"] !== "smart159!coastal") {
        res.render("admin_login.ejs", {errormsg: "Wrong password"})
    }
    else {
        res.cookie("inSession", true, {signed: true});
        res.redirect("/admin/home")
    }
})

app.post("/signout", (req, res) => {
    res.clearCookie("inSession");
    res.redirect("/admin");
})

app.get("/admin/home", (req, res) => {
    const cookie = req.signedCookies;
    if(cookie["inSession"] !== "true") {
        res.redirect("/admin");
    }
    else {
        let sql = "SELECT nama, filename, ID, kategori FROM " + bantai_tab + " ORDER BY kategori, nama";
        db.query(sql, (err, result) => {
            if(err) {
                console.log(err)
                var date = new Date;
                logger.debug(date.toLocaleString() + ": " + err);
                res.sendStatus(500);
            }
            else {
                var kumban = "";
                result.forEach(function(data) {
                    var filestring = data.filename.substring(data.filename.lastIndexOf(".")+1, data.filename.length);
                    var ban = `<div class="bangunan">
                                <img class="gambar" src="../temp/img/` + data.ID + "." + filestring + `"></img>
                                <div class="tulisan">
                                    <h3>` + data.nama + `</h3>
                                    <p>Jenis: ` + data.kategori + `</p>
                                </div>
                                <div class="buttongroup">
                                    <button type="button" class="editbtn" onclick="location.assign('/admin/edit?id=` + data.ID + `')"><span></span>Edit</button>
                                    <button type="button" class="hapusbtn" onclick="deleteBP('` + data.ID + `', '` + filestring + `')"><span></span>Hapus</button>
                                </div>
                            </div>`;
                    kumban += ban;
                })
                res.render("admin_home.ejs", {kumpulban: kumban})
            }
        })
    }
})

app.post("/admin/delete", (req, res) => {
    var id = req.query.id;
    var ext = req.query.type;
    fs.unlinkSync("./public/temp/img/" + id + "." + ext);
    let sql = "DELETE FROM " + bantai_tab + " WHERE ID = '" + id + "'";
    db.query(sql, (err, h) => {
        if(err) {
            console.log(err)
            var date = new Date;
            logger.debug(date.toLocaleString() + ": " + err);
            res.sendStatus(500);
        }
        else {
            res.status(200).send("OK");
        }
    })
})

app.get("/admin/tambahbp", (req, res) => {
    const cookie = req.signedCookies;
    if(cookie["inSession"] !== "true") {
        res.redirect("/admin");
    }
    else {
        res.render("admin_tambahbp.ejs")
    }
})

app.post("/admin/addbppic", upload, (req, res) => {
    var itemID = req.query.id;
    var file = req.files.undefined;
    var filename = file.name;
    var filestring = filename.substring(filename.lastIndexOf(".")+1, filename.length);
    if(filestring !== "JPG" && filestring !== "jpg" && filestring !== "PNG" && filestring !== "png" && filestring !== "JPEG" && filestring !== "jpeg" && filestring !== "GIF" && filestring !== "gif") {
        res.status(403).send("Wrong type file !");
    }
    else {
        fs.writeFileSync("./public/temp/img/" + itemID + "." + filestring, file.data);
        res.status(200).send("OK")  
    }  
})

app.get("/admin/edit", (req, res) => {
    const cookie = req.signedCookies;
    if(cookie["inSession"] !== "true") {
        res.redirect("/admin");
    }
    else {
        var id = req.query.id;

        let sql = "SELECT * FROM " + bantai_tab + " WHERE ID = '" + id + "'";
        db.query(sql, (err,result) => {
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
                var category = data.kategori;
                var biaya = data.biaya;
                var teori = data.teori;
                var deskripsi = data.deskripsi;
                var kelekura = data.lebihKurang;
                var cara = data.caraPembangunan;

                if(category === "breakwater") {
                    var cat = `<select id="category" name="category" required>
                                    <option value="">--Pilih kategori bangunan pantai--</option>
                                    <option value="breakwater" selected>Breakwater</option>
                                    <option value="groin">Groin</option>
                                    <option value="jetty">Jetty</option>
                                    <option value="seawall">Seawall</option>
                                    <option value="lainlain">Lain lain</option>
                                </select>`
                } else if(category === "groin") {
                    var cat = `<select id="category" name="category" required>
                                    <option value="">--Pilih kategori bangunan pantai--</option>
                                    <option value="breakwater">Breakwater</option>
                                    <option value="groin" selected>Groin</option>
                                    <option value="jetty">Jetty</option>
                                    <option value="seawall">Seawall</option>
                                    <option value="lainlain">Lain lain</option>
                                </select>`
                } else if(category === "jetty") {
                    var cat = `<select id="category" name="category" required>
                                    <option value="">--Pilih kategori bangunan pantai--</option>
                                    <option value="breakwater">Breakwater</option>
                                    <option value="groin">Groin</option>
                                    <option value="jetty" selected>Jetty</option>
                                    <option value="seawall">Seawall</option>
                                    <option value="lainlain">Lain lain</option>
                                </select>`
                } else if(category === "seawall") {
                    var cat = `<select id="category" name="category" required>
                                    <option value="">--Pilih kategori bangunan pantai--</option>
                                    <option value="breakwater">Breakwater</option>
                                    <option value="groin" selected>Groin</option>
                                    <option value="jetty">Jetty</option>
                                    <option value="seawall" selected>Seawall</option>
                                    <option value="lainlain">Lain lain</option>
                                </select>`
                } else {
                    var cat = `<select id="category" name="category" required>
                                    <option value="">--Pilih kategori bangunan pantai--</option>
                                    <option value="breakwater">Breakwater</option>
                                    <option value="groin" selected>Groin</option>
                                    <option value="jetty">Jetty</option>
                                    <option value="seawall">Seawall</option>
                                    <option value="lainlain" selected>Lain lain</option>
                                </select>`
                }

                res.render("admin_editbp.ejs", {bid: id, btitle: title, bcat: cat, bbiaya: biaya, bteori: teori, bdeskripsi: deskripsi, bkk: kelekura, bcara: cara})
            }
        })
    }
})

app.post("/admin/tambahbp", [allowedCORS, urlencodedParser], (req, res) => {
    var data = req.body;
    var id = req.query.id;
    var title = data['title'];
    var category = data['category'];
    var biaya = data['biaya'];
    var gambar = data['gambar'];
    var teori = data['isiteori'];
    var deskripsi = data['isideskripsi'];
    var kelekura = data['isikk'];
    var cara = data['isicara'];

    var newban = {
        "ID": id,
        "nama": title,
        "kategori": category,
        "filename": gambar,
        "biaya": biaya,
        "teori": teori,
        "deskripsi": deskripsi,
        "lebihKurang": kelekura,
        "caraPembangunan": cara
    }

    let sql = "INSERT INTO " + bantai_tab + " SET ?";
    db.query(sql, newban, (err, f) => {
        if(err) {
            console.log(err)
            var date = new Date;
            logger.debug(date.toLocaleString() + ": " + err);
            res.sendStatus(500);
        }
        else {
            res.redirect("/admin/home")
        }
    })
})

app.post("/admin/editbp", [allowedCORS, urlencodedParser], (req, res) => {
    var data = req.body;
    var id = req.query.id;
    var title = data['title'];
    var category = data['category'];
    var biaya = data['biaya'];
    var gambar = data['gambar'];
    var teori = data['isiteori'];
    var deskripsi = data['isideskripsi'];
    var kelekura = data['isikk'];
    var cara = data['isicara'];

    if(gambar !== "") {
        var newban = {
            "ID": id,
            "nama": title,
            "kategori": category,
            "filename": gambar,
            "biaya": biaya,
            "teori": teori,
            "deskripsi": deskripsi,
            "lebihKurang": kelekura,
            "caraPembangunan": cara
        }   
    }
    else {
        var newban = {
            "ID": id,
            "nama": title,
            "kategori": category,
            "biaya": biaya,
            "teori": teori,
            "deskripsi": deskripsi,
            "lebihKurang": kelekura,
            "caraPembangunan": cara
        }
    }

    let sql = "UPDATE " + bantai_tab + " SET ? WHERE ID = '" + id + "'";
    db.query(sql, newban, (err, f) => {
        if(err) {
            console.log(err)
            var date = new Date;
            logger.debug(date.toLocaleString() + ": " + err);
            res.sendStatus(500);
        }
        else {
            res.redirect("/admin/home")
        }
    })
})

app.post('/uploadimage', upload, (req, res) => {
    var file = req.files.upload;
    var date = new Date;
    var filedate = String(date.getFullYear()) + String(date.getMonth()) + String(date.getDate()) + String(date.getHours()) + String(date.getMinutes());
    file.mv("./public/img/" + filedate + "_" + file.name, function(err) {
        if(err) {
            res.sendStatus(503);
        }
        else {
            var link =  {
                "resourceType": "Images",
                "currentFolder": {
                    "path": "/",
                    "url": "/img/",
                    "acl": 255
                },
                "fileName": filedate + "_" + file.name,
                "url": "/img/" + filedate + "_" + file.name,
                "uploaded": 1
            }
            res.status(200).send(link);
        }
    })
})

app.get("/admin/aturpertanyaan", (req, res) => {
    const cookie = req.signedCookies;
    if(cookie["inSession"] !== "true") {
        res.redirect("/admin");
    }
    else {
        let sql = "SELECT * FROM " + pertanyaan_tab;
        db.query(sql, (err, result) => {
            if(err) {
                console.log(err)
                var date = new Date;
                logger.debug(date.toLocaleString() + ": " + err);
                res.sendStatus(500);
            }
            else if(typeof result[0] === "undefined") {
                res.render('admin_pertanyaan.ejs', {pertanyaan: ""});
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
                        let sql = "SELECT ID, nama, kategori FROM " + bantai_tab;
                        db.query(sql, (err, dabantai) => {
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
                                    var urutanjawaban = 1;
                                    var kumjaw = "";

                                    kolen.forEach(function(didi) {
                                        if(didi.pertaID === derrdata.ID) {
                                            var kumbangid = didi.banID.split(",");
                                            var bw = "";
                                            var sw = "";
                                            var gro = "";
                                            var jet = "";
                                            var lain = "";

                                            dabantai.forEach(function(data) {
                                                if(data.kategori === "breakwater") {
                                                    if(kumbangid.includes(data.ID)) {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" checked><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    else {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `"><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    bw += bantai;
                                                } else if(data.kategori === "jetty") {
                                                    if(kumbangid.includes(data.ID)) {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" checked><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    else {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `"><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    jet += bantai;
                                                } else if(data.kategori === "groin") {
                                                    if(kumbangid.includes(data.ID)) {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" checked><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    else {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `"><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    gro += bantai;
                                                } else if(data.kategori === "seawall") {
                                                    if(kumbangid.includes(data.ID)) {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" checked><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    else {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `"><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    sw += bantai;
                                                } else {
                                                    if(kumbangid.includes(data.ID)) {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" checked><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    else {
                                                        var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `"><label for="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.` + data.ID + `" class="tulisan2">` + data.nama + `</label><br>`;
                                                    }
                                                    lain += bantai;
                                                }
                                            })

                                            kumjaw += `<li class="jawabanBaru" id="` + urutanjawaban + `.jawabanBaru"><input class="jawaban" type="text" value="` + didi.jawaban + `" name="` + add + `.` + String.fromCharCode(96 + urutanjawaban) +`.jawaban" placeholder="Tuliskan karakteristik" required>
                                                        <p class="tulisan1">Breakwater</p>
                                                        ` + bw + `

                                                        <p class="tulisan1">Jetty</p>
                                                        ` + jet + `

                                                        <p class="tulisan1">Groin</p>
                                                        ` + gro + `

                                                        <p class="tulisan1">Seawall</p>
                                                        ` + sw + `

                                                        <p class="tulisan1">Lainnya</p>
                                                        ` + lain + `</li>`;

                                            urutanjawaban += 1;
                                        }
                                    })

                                    daisi += '<li class="pertanyaanBaru" id="' + add + '.pertanyaanBaru"><article class="question">' +
                                                '<input class="pertanyaan" type="text" name="'+ add +'.pertanyaan" placeholder="Tuliskan Pertanyaannya" value="' + derrdata.pertanyaan + '" required>' +
                                            '</article>' +
                                            '<ol class="ol2" id="'+ add +'.ol2" type="a">' +
                                                kumjaw +
                                            '</ol>' +
                                            '<div id="add-answer" class="add-answer">' +
                                                '<button type="button" class="addAnswerbtn" onclick="addAnswerFunc('+ add +')">Add Answer</button>' +
                                                '<button type="button" class="delAnswerbtn" onclick="deleteAnswerFunc('+ add +')">Delete Answer</button>' +
                                            '</div></li>';

                                    add += 1;
                                })

                                res.render('admin_pertanyaan.ejs', {pertanyaan: daisi});
                            }
                        })
                    }
                })
            }
        })
    }
})

app.post("/admin/aturpertanyaan", [allowedCORS, urlencodedParser], (req, res) => {
    var data = req.body;
    var urutan = 0;
    var idpertanyaan = "";
    var jawaban = "";
    var kumbanId = [];
    let sql = "DELETE FROM " + pertanyaan_tab + " WHERE 1";
    db.query(sql, (err, k) => {
        if(err) {
            console.log(err)
            var date = new Date;
            logger.debug(date.toLocaleString() + ": " + err);
            res.sendStatus(500);
        }
        else {
            Object.keys(data).forEach(function(niii) {
                var here = niii.split(".");
                var newu = "-";
                if(parseInt(here[0]) !== urutan) {
                    if(kumbanId.length !== 0) {
                        newChart(kumbanId.join(','), idpertanyaan, jawaban);
                    }
                    kumbanId = [];
                    urutan += 1;
                    idpertanyaan = uniqueIdCreation();
                    let sql = "INSERT INTO " + pertanyaan_tab + " SET ID = '" + idpertanyaan + "', pertanyaan = '" + data[niii] + "'";
                    db.query(sql, (err, k) => {
                        if(err) {
                            console.log(err)
                            var date = new Date;
                            logger.debug(date.toLocaleString() + ": " + err);
                            res.sendStatus(500);
                        }
                    })
                }
                else if(here[1] !== newu && here[2] === "jawaban") {
                    if(kumbanId.length !== 0) {
                        newChart(kumbanId.join(','), idpertanyaan, jawaban);
                    }
                    kumbanId = [];
                    newu = here[1];
                    jawaban = data[niii];
                }
                else {
                    kumbanId.push(here[2]);
                }
            })
            newChart(kumbanId.join(','), idpertanyaan, jawaban);

            function newChart(banId, pertaId, jawab) {
                var dajs = {
                    "ID": uniqueIdCreation(),
                    "banID": banId,
                    "pertaID": pertaId,
                    "jawaban": jawab
                }
                let sql = "INSERT INTO " + jawaban_tab + " SET ?";
                db.query(sql, dajs, (err, k) => {
                    if(err) {
                        console.log(err)
                        var date = new Date;
                        logger.debug(date.toLocaleString() + ": " + err);
                        res.sendStatus(500);
                    }
                })
            }
        
            res.redirect("/admin/home");
        }
    })
})

app.post("/admin/getitems", (req, res) => {
    let sql = "SELECT ID, nama, kategori FROM " + bantai_tab;
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
            var date = new Date;
            logger.debug(date.toLocaleString() + ": " + err);
            res.sendStatus(500);
        }
        else {
            var bw = [];
            var jet = [];
            var gro = [];
            var sw = [];
            var lain = [];

            result.forEach(function(data) {
                if(data.kategori === "breakwater") {
                    bw.push(data.ID);
                    bw.push(data.nama);
                } else if(data.kategori === "jetty") {
                    jet.push(data.ID);
                    jet.push(data.nama);
                } else if(data.kategori === "groin") {
                    gro.push(data.ID);
                    gro.push(data.nama);
                } else if(data.kategori === "seawall") {
                    sw.push(data.ID);
                    sw.push(data.nama);
                } else {
                    lain.push(data.ID);
                    lain.push(data.nama);
                }
            })

            var jsonres = {
                "breakwater": bw,
                "jetty": jet,
                "seawall": sw,
                "groin": gro,
                "other": lain
            }

            res.status(200).json(jsonres);
        }
    })
})

module.exports = app;