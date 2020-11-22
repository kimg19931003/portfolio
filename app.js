
var mysql = require('mysql');


var db = mysql.createConnection({
	host: 'kim-db.ctayfbasruuw.ap-northeast-2.rds.amazonaws.com',
	port: 3306,
	user: 'kim',
	password: 'sa435440',
	database: 'innodb',
	connectionLimit: 20
});




function handleDisconnect() {
   // Recreate the connection, since
                                                  // the old one cannot be reused.

  db.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  db.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();



const express = require('express');
const app = express();
var moment = require("moment");
const bodyparser = require('body-parser');

var http = app.listen(3000, function () {
	console.log("server started on port ");
});

const io = require('socket.io')(http);

var session = require('express-session');
var path = require('path');


app.use(session({
	key: 'sid',
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
	}
}));


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.static('js'));
app.use(express.static('css'));
app.use(express.static('img'));


var chat_num = 0;


io.on('connection', (socket) => {


	socket.on('disconnect', () => {
		console.log('user disconnected' + socket.id);


		if(chat_num != 0){
			chat_num = chat_num - 1;
		}
		console.log("disconnect :"+chat_num);


		db.query('update chat_num set chat_num = ?', [chat_num], function (err, rows, fields) {

			if (err) {
				console.log(err);
			}
			else {
				console.log("disconnect_update :"+chat_num);
				io.to("admin").emit('chat_num_update', chat_num);
				
			}


		});

	});



	/////////////////// 채팅방을 떠날때 //////////////////////

	socket.on('leaveRoom', (to, id) => {
		socket.leave(to, () => {


			chat_num = chat_num - 1;

			console.log("leave :"+chat_num);


			db.query('update chat_num set chat_num = ?', [chat_num], function (err, rows, fields) {

				if (err) {
					console.log(err);
				}
				else {
					io.to(to).emit('leaveRoom', to, id, chat_num);
				}


			});



		});
	});


	/////////////////// 채팅방을 떠날때 //////////////////////



	/////////////////// 채팅방에 입장할때 //////////////////////

	socket.on('joinRoom', (to, id) => {
		socket.join(to, () => {
			
			while (chat_flag) {
				chat_flag = chat(id).flag;
				id = chat(id).id;
			}


			chat_num = chat_num + 1;

			console.log("join :"+chat_num);


			db.query('update chat_num set chat_num = ?', [chat_num], function (err, rows, fields) {

				if (err) {
					console.log(err);
				}
				else {
					io.to(to).emit('joinRoom', to, id, chat_num);
				
				}


			});

		});
	});


	/////////////////// 채팅방에 입장할때 //////////////////////


	////////////////// 주기적 채팅방 인원 업데이트 ///////////////

	socket.on('chat_num_update', (to, chat_num) => {
		

			db.query('select * from chat_num', function (err, rows, fields) {

				if(err){

				}else{

					var chat_num = rows[0].chat_num;
					io.to(to).emit('chat_num_update', chat_num);

				}



			});

	});


	////////////////// 주기적 채팅방 인원 업데이트 ///////////////


	//////////////////// 메세지 입력할때 //////////////////////////

	var chat_flag = false;

	socket.on('chat message', (to, state, id, msg, machine) => {

		var ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;


		var m = moment();
		var msgtime = m.format("YYYY년MM월DD일 HH:mm:ss dddd");






		db.query('insert into chat(msg, state, msgtime, ip, tochat, machine, id) values(?,?,?,?,?,?,?)', [msg, state, msgtime, ip, to, machine, id], function (err, rows, fields) {

			if (err) {
				console.log(err);
				
			}
			else {
				io.to(to).emit('chat message', to, id, msg, msgtime, machine);
			
			}


		});







	});

	//////////////////// 메세지 입력할때 //////////////////////////

});






///////////////////////채팅 통신부분/////////////////////////






app.get('/', function (req, res) {


	var session = req.session;





	db.query('select * from chat', function (err, rows, fields) {

		if (err) {

		}
		else {
			var chat_arr = new Array();

			for (var i = 0; i < rows.length; i++) {

				var chat = new Object();
				chat.msg = rows[i].msg;
				chat.msgtime = rows[i].msgtime;
				chat.tochat = rows[i].tochat;
				chat.ip = rows[i].ip;
				chat.id = rows[i].id;

				chat_arr.push(chat);

			}

			session.chat = chat_arr;

		}


		res.render('portfolio', {

			session: session
		});

	});




});




app.get('/portfolio', function (req, res) {        ////// 포트폴리오 사이트 get 


	res.render('portfolio', {


	});



});


app.post('/portfolio', function (req, res) {        ////// 포트폴리오 사이트 post


	let body = req.body;


	db.query('select * from chat_num', function (err, rows, fields) {

		if(err){

		}else{

			var json = {chat_num : rows[0].chat_num, result : "ok"};
			res.json(json);

		}



	});

	



});







//////////////////// 함수 기능 모음 ////////////////////////



//////////////  chat id 가 겹치는지를 확인 
function chat(id) {


	var arr = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'y', 'z');
	var num_arr = new Array('1', '2', '3', '4', '5', '6', '7', '8', '9', '0');
	var id_temp = "손님";

	for (i = 0; i < 4; i++) {
		var ran = Math.floor(Math.random() * 10);

		id_temp = id_temp + arr[ran];
	}


	for (i = 0; i < 4; i++) {
		var ran = Math.floor(Math.random() * 10);

		id_temp = id_temp + num_arr[ran];
	}

	var id = id_temp



	db.query('select * from chat where id = ?', [id], function (err, rows, fields) {   //////// db 에 저장된 랜덤 id 대조

		if (err) {
			console.log(err);
		}
		else {
			if (rows.length != 0) {

				var value = { id: id, flag: true };
				return value;

			} else {

				var value = { id: id, flag: false };
				return value;

			}

		}


	});



}