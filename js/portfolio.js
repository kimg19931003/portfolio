


$(function () {

    $(".chat, .user_form, .user_career, .user_certifi").draggable();


    if (document.body.scrollTop == 0) {


        ////////////////////////// 1번 유저폼 //////////////////////////////

        $(".user_form").css("margin", "100px auto 0px auto").css("opacity", "1");




        setTimeout(function () {
            $(".user_info").css("top", "30px").css("opacity", "1");
        }, 300);

        setTimeout(function () {
            $(".univ_info").css("bottom", "50px").css("opacity", "1");
        }, 600);





        ////////////////////////// 2번 유저폼 //////////////////////////////

        setTimeout(function () {

            $(".user_career").css("margin", "100px auto 100px auto").css("opacity", "1");

        }, 900);



        setTimeout(function () {
            $(".user_career_info").css("top", "0px").css("opacity", "1");
        }, 1200);

        setTimeout(function () {
            $(".user_career_reason").css("top", "3px").css("opacity", "1");
        }, 1500);







        ////////////////////////// 3번 유저폼 //////////////////////////////

         setTimeout(function () {

            $(".user_certifi").css("margin", "100px auto 100px auto").css("opacity", "1");

        }, 1800);



        setTimeout(function () {
            $(".user_certifi_info").css("top", "0px").css("opacity", "1");
        }, 2100);

        setTimeout(function () {
            $(".user_certifi_reason").css("top", "3px").css("opacity", "1");
        }, 2400);

    } else if (document.body.scrollTop > 10) {




    }






    $(window).scroll(function (event) {




    });

});