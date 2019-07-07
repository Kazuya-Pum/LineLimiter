(function () {

    //�v�f�̎擾
    var elements = document.getElementsByClassName("menu");

    //�v�f���̃N���b�N���ꂽ�ʒu���擾����O���[�o���i�̂悤�ȁj�ϐ�
    /*var x;*/
    var y;
    var y1;//�ړ��O��y���W
    var y2;//�ړ����y���W
    var dy;//y�̕ψ�
    var stage = 0;//0�Ń��j���[�����ɁA1�Ń��j���[����ɂ�����



    //�}�E�X���v�f���ŉ����ꂽ�Ƃ��A���̓^�b�`���ꂽ�Ƃ�����
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("mousedown", mdown, false);
        elements[i].addEventListener("touchstart", tdown, false);
    }

    //�}�E�X�������ꂽ�ۂ̊֐�
    function mdown(e) {

        //�N���X���� .drag ��ǉ�
        this.classList.add("drag");

        //�^�b�`�f�C�x���g�ƃ}�E�X�̃C�x���g�̍��ق��z��
        if (e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //�v�f���̑��΍��W���擾
        y = event.pageY - this.offsetTop;
        y1 = event.pageY;

        //���[�u�C�x���g�ɃR�[���o�b�N
        document.body.addEventListener("mousemove", mmove, false);
    }



    //�^�b�`���ꂽ�ۂ̊֐�
    function tdown(e) {

        //�N���X���� .drag ��ǉ�
        this.classList.add("drag");

        //�^�b�`�f�C�x���g�ƃ}�E�X�̃C�x���g�̍��ق��z��
        if (e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //�v�f���̑��΍��W���擾
        y = event.pageY - this.offsetTop;
        y1 = this.offsetTop;

        if (stage == 0) {
            //���[�u�C�x���g�ɃR�[���o�b�N
            document.body.addEventListener("touchmove", mmove, false);
        } else if (stage == 1 && event.pageY < 300) {
            document.body.addEventListener("touchmove", mmove, false);
        }
    }



    //�}�E�X�J�[�\�����������Ƃ��ɔ���
    function mmove(e) {

        //�h���b�O���Ă���v�f���擾
        var drag = document.getElementsByClassName("drag")[0];

        //���l�Ƀ}�E�X�ƃ^�b�`�̍��ق��z��
        if (e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        drag.style.top = event.pageY - y + "px";




        //�}�E�X�{�^���������ꂽ�Ƃ��A�܂��̓J�[�\�����O�ꂽ�Ƃ�����
        drag.addEventListener("mouseup", mouse_up, false);
        document.body.addEventListener("mouseleave", mouse_up, false);
        drag.addEventListener("touchend", touch_up, false);
        document.body.addEventListener("touchleave", touch_up, false);
    }



    //�}�E�X����I����
    function mouse_up(e) {
        var drag = document.getElementsByClassName("drag")[0];

        y2 = event.pageY;
        dy = y2 - y1;//y�̕ψ�

        //���[�u�x���g�n���h���̏���
        document.body.removeEventListener("mousemove", mmove, false);
        drag.removeEventListener("mouseup", mouse_up, false);

        //�N���X�� .drag ������
        drag.classList.remove("drag");
    }



    //�^�b�`����I����
    function touch_up(e) {
        var drag = document.getElementsByClassName("drag")[0];

        y2 = this.offsetTop;
        dy = y2 - y1;//y�̕ψ�



        if (dy < -40) {//��ɃX���C�v
            $('.menu').animate({
                'top': '25vh'
            }, 500, 'swing');
            stage = 1;
        } else if (dy > 40) {//���ɃX���C�v
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

        if (stage == 0) {//��ɃX���C�v
            $('.swiper-container').animate({
                'opacity': '0',
                'z-index': '-1'
            }, 400, 'swing');
        } else if (stage == 1) {//���ɃX���C�v
            $('.swiper-container').animate({
                'opacity': '1',
                'z-index': '11'
            }, 400, 'swing');
        }


        //���[�u�x���g�n���h���̏���
        document.body.removeEventListener("touchmove", mmove, false);
        drag.removeEventListener("touchend", touch_up, false);

        //�N���X�� .drag ������
        drag.classList.remove("drag");
    }

})()
