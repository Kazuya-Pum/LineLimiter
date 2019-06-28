$(function () {

    liff.init(
        data => {
            const accessToken = liff.getAccessToken();

            $.ajax({
                url: '/list',
                type: 'POST',
                headers: {
                    'accessToken': accessToken
                },
                data: {}
            })
                // Ajaxリクエストが成功した時発動
                .done((data) => {
                    $.each(data, function (index, value) {
                        $('#list').append(`<li><a class="uk-link-text" href="/edit?id=${value['id']}">${value['name']}</a></li>`);
                    })
                })
                // Ajaxリクエストが失敗した時発動
                .fail((data) => {
                    console.log(data);
                })
        },
        err => {
            console.log(err);
        })
})
