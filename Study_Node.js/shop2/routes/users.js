var express = require('express');
var router = express.Router();

var db = require("../db");
var multer = require("multer");

//업로드함수
var upload = multer({
    storage:multer.diskStorage({
        destination:(req, file, done) => {
            done(null, './public/upload/photo')
        },
        filename:(req, file, done) => {
            var fileName=Date.now() + ".jpg";
            done(null, fileName);
        }
    })
});

/*사용자 목록 페이지로*/
router.get('/', function(req, res, next) {
    res.render("index", {title:"사용자 목록", pageName:"users/list.ejs"})
});

//사용자 목록 json
router.get("/list.json", function(req, res) {
    const sql = "select * from users order by uname";
    db.get().query(sql, function(err, rows) {
        res.send(rows);
    })
});

//로그인 페이지로 이동하는 라우터
router.get("/login", function(req, res) {
    res.render("index", {title:"로그인", pageName:"users/login.ejs"})
});

//로그인이 성공했는지안했는지 비번이맞는지안맞는지
//폼에서 로그인 눌리면 그 데이터는 일로옴
router.post("/login", function(req, res) {
    const uid = req.body.uid;
    const upass = req.body.upass;
    const sql = "select * from users where uid = ?"
    db.get().query(sql, [uid], function(err, rows) {
        let result = '0';
        if (rows[0]) {
            if (rows[0].upass == upass) {
                result = '1';
            } else {
                result = '2';
            }
        }
        res.send(result);
    });
});

//회원가입 페이지로 이동하는 라우터(페이지를 가져오는 작업)
router.get("/insert", function(req, res) {
    res.render("index", {title:"회원가입", pageName:"users/insert.ejs"})
}),

//실제로 DB에 회원가입정보
router.post("/insert", function(req, res) {
    const uid = req.body.uid;
    const upass = req.body.upass;
    const uname = req.body.uname;
    const phone = req.body.phone;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    console.log(uid, upass, uname, phone, address1, address2);
    const sql = "insert into users(uid, upass, uname, phone, address1, address2) values(?, ?, ?, ?, ?, ?)"
    db.get().query(sql, [uid, upass, uname, phone, address1, address2], function(err, rows) {
        res.redirect("/users/login");
    });
});

//마이페이지로 이동하는거
router.get("/mypage", function(req, res) {
    const uid = req.query.uid;
    const sql = "select * from users where uid=?"
    db.get().query(sql, [uid], function(err, rows) {
        //console.log(rows[0]);
        res.render("index", {title:"마이페이지", pageName:"users/mypage.ejs", user:rows[0]});
    });
});

//회원정보 수정하는 페이지로 이동하는
router.get("/update", function(req, res) {
    const uid = req.query.uid;
    const sql = "select * from users where uid=?"
    db.get().query(sql, [uid], function(err, rows) {
        // console.log(rows[0]);
        res.render("index", {title:"정보수정", pageName:"users/update.ejs", user:rows[0]});
    });
});

//정보 수정한거 DB로
router.post("/update", upload.single("file"), function(req, res) {
    const uid = req.body.uid;
    const uname = req.body.uname;
    const phone = req.body.phone;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    let photo = req.body.photo;
    if (req.file) {
        photo = req.file.filename;
    } 

    console.log("!!!!!!!!!!!!!!!!!!!!!!!", photo);

    //console.log(uid, uname, phone, address1, address2);
    const sql = "update users set uname=?, phone=?, address1=?, address2=?, photo=? where uid=?";
    db.get().query(sql, [uname, phone, address1, address2, photo, uid], function(err,rows) {
        if(err) console.log('error........' , err);
        res.redirect("/users/mypage?uid=" + uid);
    });
});

//비밀번호 변경 페이지로
router.get("/change", function(req, res) {
    res.render("index", {title:"비밀번호변경", pageName:"users/change.ejs"});
});

//비밀번호 DB
router.post("/change", function(req, res) {
    const uid = req.body.uid;
    const upass = req.body.npass;
    const sql = "update users set upass=? where uid=?"
    db.get().query(sql, [upass, uid], function(err, rows) {
        if(err) console.log(err);
        // res.redirect("/users/login");
        res.sendStatus(200);
    });
});

module.exports = router;
