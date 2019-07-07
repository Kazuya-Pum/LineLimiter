$(function () {
    liff.init(
        data => {
            const search = /^\?\w*id=(\d+)/.exec(this.location.search);

            if (!search) {
                id = 0;
            } else {
                id = search[1];
            }

            const accessToken = liff.getAccessToken();

            if (!accessToken) {
                console.error("can't get token");
                return;
            }

            $.ajax({
                url: `/edit/get`,
                type: 'POST',
                headers: {
                    'accessToken': accessToken
                },
                data: {
                    id: id
                }
            })
                .done((data) => {
                    if (id) {
                        document.getElementById('nameTxt').value = data['name'];
                        document.getElementById('timer').value = data['limit_day'];
                        document.getElementById('placeTxt').value = data['place'];
                        document.getElementById('memoTxt').value = data['memo'];
                        document.getElementById('categoryTxt').value = data['category'];
                    }

                    //for (let i = 0; i < data['notification_list'].length; ++i) {

                    //    const elem = $(`<label><input class="uk-checkbox" type="checkbox" name="notification" value="${data['notification_list'][i]}">${data['notification_list'][i]}日前</label>`);

                    //    if (id && data['notification'].indexOf(data['notification_list'][i]) !== -1) {
                    //        elem.children('input').prop('checked', true);
                    //    }

                    //    $('#notification_day').append(elem);
                    //}
                })
                .fail((data) => {
                    console.log(data);
                })
        },
        err => {
            console.log('error', err);
        }
    );

    document.getElementById('submitButton').addEventListener('click', function () {
        const form = document.getElementById('form');
        if (!form.reportValidity()) {
            return;
        }

        const accessToken = liff.getAccessToken();
        if (!accessToken) {
            console.error("can't get token");
            return;
        }

        const param = /^\?\w*id=(\d+)/.exec(location.search);
        const id = (param) ? param[1] : 0;

        const data = new FormData(form);
        data.append('id', id);

        $.ajax({
            url: `/edit`,
            type: 'POST',
            headers: {
                'accessToken': accessToken
            },
            dataType: 'json',
            data: data,
            processData: false,
            contentType: false
        })
            .done((data) => {
                alert('success');
                return;
            })
            .fail((data) => {
                alert('fail');
            })
    });
})

//$('#file').change(
//    function () {
//        if (!this.files.length) {
//            return;
//        }

//        var file = $(this).prop('files')[0];
//        var fr = new FileReader();
//        $('.preview').css('background-image', 'none');
//        fr.onload = function () {
//            $('.preview').css('background-image', 'url(' + fr.result + ')');
//        }
//        fr.readAsDataURL(file);
//        $(".preview img").css('opacity', 0);
//    }
//);
