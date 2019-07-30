'use strict';

(() => {

    //要素の取得
    const elements = document.getElementsByClassName("menu");

    const top = document.getElementById('menuTop');
    const menu = document.getElementById('menu');

    //要素内のクリックされた位置を取得するグローバル（のような）変数
    /*var x;*/
    let y;
    let y1;//移動前のy座標
    let y2;//移動後のy座標
    let dy;//yの変位
    let stage = 0;//0でメニューが下に、1でメニューが上にある状態

    //マウスが要素内で押されたとき、又はタッチされたとき発火
    //for (let i = 0; i < elements.length; i++) {
    //    elements[i].addEventListener("mousedown", mdown, false);
    //    elements[i].addEventListener("touchstart", tdown, false);
    //}

    top.addEventListener("mousedown", mdown, false);
    top.addEventListener("touchstart", tdown, false);

    //マウスが押された際の関数
    function mdown(e) {

        //クラス名に .drag を追加
        menu.classList.add("drag");

        //タッチデイベントとマウスのイベントの差異を吸収
        if (e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        y = event.pageY - menu.offsetTop;
        y1 = event.pageY;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mmove, false);
    }

    //タッチされた際の関数
    function tdown(e) {

        //クラス名に .drag を追加
        menu.classList.add("drag");

        //タッチデイベントとマウスのイベントの差異を吸収
        if (e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        y = event.pageY - menu.offsetTop;
        y1 = menu.offsetTop;

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

        if (drag === undefined) {
            return;
        }

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
        let drag = document.getElementsByClassName("drag")[0];

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

})();

// init
(() => {
    const scrollOff = (e) => {
        e.preventDefault();
    }
    window.addEventListener('touchmove', scrollOff, { passive: false });

    document.getElementById('file_photo').addEventListener('change', (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('preview').style.backgroundImage = `url(${e.target.result})`;
            }
            reader.readAsDataURL(e.target.files[0]);
            document.getElementById('photo-img').style.display = 'none';
        } else {
            document.getElementById('preview').style.backgroundImage = 'none';
            document.getElementById('image_url').value = '';
            document.getElementById('photo-img').style.display = 'block';
        }
    });

    const swiper = new Swiper('.swiper-container', {
        scrollbar: {
            el: '.swiper-scrollbar',
            hide: false
        },
    });

    const navBtns = document.getElementsByClassName('nav-btn');

    const slideTo = (event) => {
        swiper.slideTo(event.currentTarget.dataset.slide);
    };

    for (let i = 0; i < navBtns.length; i++) {
        navBtns[i].setAttribute('data-slide', i);
        navBtns[i].addEventListener('click', slideTo, false);
    }

    const placeTxt = document.getElementById('placeTxt');
    const placeRadios = document.getElementsByName('placeRadio');

    placeTxt.addEventListener('change', (e) => {
        for (let i = 0; i < placeRadios.length; i++) {
            if (e.target.value != placeRadios[i].value) {
                placeRadios[i].checked = false;
            }
        }
    });

    for (let i = 0; i < placeRadios.length; i++) {
        placeRadios[i].addEventListener('click', () => {
            placeTxt.value = placeRadios[i].value;
        });
    }

    const memoList = document.getElementById('memoList');
    const memoAddBtn = document.getElementById('memoAddBtn');

    const updateValue = (value, dummy) => {
        dummy.textContent = value;
    };

    memoAddBtn.addEventListener('click', () => {
        const memoBlock = document.createElement('div');
        memoBlock.classList.add('ll-memo-block');

        const memoDummy = document.createElement('div');
        memoDummy.classList.add('ll-memo-dummy');

        const memoText = document.createElement('input');
        memoText.type = 'text';
        memoText.classList.add('ll-memo-input');
        memoText.name = 'memo[]';

        memoText.addEventListener('keydown', () => {
            updateValue(memoText.value, memoDummy);
        });

        memoBlock.appendChild(memoDummy);
        memoBlock.appendChild(memoText);

        memoList.insertBefore(memoBlock, memoAddBtn);
    });

})();
