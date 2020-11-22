  
  
  
  
  $(function(){   
      

      var arr = new Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','w','y','z');
      var num_arr = new Array('1','2','3','4','5','6','7','8','9','0');
      var id_temp = "손님";

      for(i=0; i<4; i++){
        var ran = Math.floor(Math.random()*10);

        id_temp = id_temp + arr[ran];
      }


      for(i=0; i<4; i++){
        var ran = Math.floor(Math.random()*10);

        id_temp = id_temp + num_arr[ran];
      }

      
      const id = id_temp;
      const socket = io();
      const state = "0";
      var chat_num;
      let to = "admin";


      socket.emit('joinRoom', to, id);
      socket.emit('chat_num_update', function(to, chat_num){});
     

      document.querySelector(".chat_space").scrollTop = document.querySelector(".chat_space").scrollHeight;



      /////////////////  메세지 보내기  //////////////////////////////

      $(".send_button").click(function () {
        // 디바이스 종류 설정
        var pcDevice = "win16|win32|win64|mac|macintel";
        var machine;

        // 접속한 디바이스 환경
        if (navigator.platform) {
          if (pcDevice.indexOf(navigator.platform.toLowerCase()) < 0) {
            machine = "mobile";
          } else {
            machine = "pc";
          }
        }

        if ($(".chat_text").val() == "" || $(".chat_text").val().length <= 0) {

        } else {        
          socket.emit('chat message', to, state, id, $('.chat_text').val(), machine);
          $('.chat_text').val('');

        }

        return false;
      });




      $('.chat_text').keydown(function(event){


        if (event.keyCode == 13) {


          // 디바이스 종류 설정
          var pcDevice = "win16|win32|win64|mac|macintel";
          var machine;

          // 접속한 디바이스 환경
          if (navigator.platform) {
            if (pcDevice.indexOf(navigator.platform.toLowerCase()) < 0) {
              machine = "mobile";
            } else {
              machine = "pc";
            }
          }

          if ($(".chat_text").val() == "" || $(".chat_text").val().length <= 0) {

          } else {
            socket.emit('chat message', to, state, id, $('.chat_text').val(), machine);
            $('.chat_text').val('');

          }

          return false;
        }



      });


      /////////////////  메세지 보내기  //////////////////////////////

      socket.on('chat message', function(to, id, msg, msgtime,  machine){

        let date = new Date();

        

        $('.chat_space_ul').append("<li><div class='msg'>"+msg+"</div><div class='nickname'>"+id+"</div><div class='time'>"+msgtime+"</div></li>");
        document.querySelector(".chat_space").scrollTop = document.querySelector(".chat_space").scrollHeight;;
        

      });



     
   
      socket.on('leaveRoom', function(to, id, chat_num){

        this.chat_num = chat_num;

        $(".chat_num").text(this.chat_num);

      });

      socket.on('joinRoom', function(to, id, chat_num){

        this.chat_num = chat_num;

         $(".chat_num").text(this.chat_num);

      });


      


  



     socket.on('chat_num_update', function(chat_num){

      this.chat_num = chat_num;
       $(".chat_num").text(this.chat_num);

     });
      
     

    }); 
    




    function chat_num_ajax(){

     


        /*
        $.ajax({

          type : "post",
          url : "portfolio",
          dataType : "json",
          error : function(res){
            if(res.result = "ok"){
              alert('채팅 통신실패!!');
            }
          },
          success : function(res){
            if(res.result = "ok"){
              $(".chat_num").text(res.chat_num);
              chat_num_ajax();
            }
          }

        });
        */


      



    }