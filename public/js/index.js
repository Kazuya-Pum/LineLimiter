(function () {

    //要素の取得
    var elements = document.getElementsByClassName("menu");

    //要素内のクリックされた位置を取得するグローバル（のような）変数
    /*var x;*/
    var y;
    var y1;//移動前のy座標
    var y2;//移動後のy座標
    var dy;//yの変位
    var stage = 0;//0でメニューが下に、1でメニューが上にある状態



    //マウスが要素内で押されたとき、又はタッチされたとき発火
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("mousedown", mdown, false);
        elements[i].addEventListener("touchstart", tdown, false);
    }

    //マウスが押された際の関数
    function mdown(e) {

        //クラス名に .drag を追加
        this.classList.add("drag");

        //タッチデイベントとマウスのイベントの差異を吸収
        if (e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        y = event.pageY - this.offsetTop;
        y1 = event.pageY;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mmove, false);
    }



    //タッチされた際の関数
    function tdown(e) {

        //クラス名に .drag を追加
        this.classList.add("drag");

        //タッチデイベントとマウスのイベントの差異を吸収
        if (e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        y = event.pageY - this.offsetTop;
        y1 = this.offsetTop;

        if (stage == 0) {
            //ムーブイベントにコールバック
            document.body.addEventListener("touchmove", mmove, false);
        } else if (stage == 1 && event.pageY < 300) {
            document.body.addEventListener("touchmove", mmove, false);
        }
    }



    //マウスカーソルが動いたときに発火
    function mmove(e) {

        //ドラッグしている要素を取得
        var drag = document.getElementsByClassName("drag")[0];

        //同様にマウスとタッチの差異を吸収
        if (e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        drag.style.top = event.pageY - y + "px";




        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        drag.addEventListener("mouseup", mouse_up, false);
        document.body.addEventListener("mouseleave", mouse_up, false);
        drag.addEventListener("touchend", touch_up, false);
        document.body.addEventListener("touchleave", touch_up, false);
    }



    //マウス操作終了時
    function mouse_up(e) {
        var drag = document.getElementsByClassName("drag")[0];

        y2 = event.pageY;
        dy = y2 - y1;//yの変異

        //ムーブベントハンドラの消去
        document.body.removeEventListener("mousemove", mmove, false);
        drag.removeEventListener("mouseup", mouse_up, false);

        //クラス名 .drag も消す
        drag.classList.remove("drag");
    }



    //タッチ操作終了時
    function touch_up(e) {
        var drag = document.getElementsByClassName("drag")[0];

        y2 = this.offsetTop;
        dy = y2 - y1;//yの変異



        if (dy < -40) {//上にスワイプ
            $('.menu').animate({
                'top': '25vh'
            }, 500, 'swing');
            stage = 1;
        } else if (dy > 40) {//下にスワイプ
            $('.menu').animate({
                'top': '45vh'
            }, 500, 'swing');
            stage = 0;
        } else if (y2 < 200) {
            $('.menu').animate({
                'top': '25vh'
            }, 500, 'swing');
            stage = 1;
        } else {
            $('.menu').animate({
                'top': '45vh'
            }, 500, 'swing');
            stage = 0;
        }

        if (stage == 0) {//上にスワイプ
            $('.swiper-container').animate({
                'opacity': '0',
                'z-index': '-1'
            }, 400, 'swing');
        } else if (stage == 1) {//下にスワイプ
            $('.swiper-container').animate({
                'opacity': '1',
                'z-index': '11'
            }, 400, 'swing');
        }


        //ムーブベントハンドラの消去
        document.body.removeEventListener("touchmove", mmove, false);
        drag.removeEventListener("touchend", touch_up, false);

        //クラス名 .drag も消す
        drag.classList.remove("drag");
    }

})()
