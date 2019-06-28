$(function () {
    liff.init(
        data => {

            const id = /^\?\w*id=(\d+)/.exec(this.location.search);

            if (!id) {
                return;
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
                    id: id[1]
                }
            })
                // Ajaxリクエストが成功した時発動
                .done((data) => {
                    document.getElementById('name').value = data['name'];
                    document.getElementById('limitDay').value = data['limit_day'];
                    document.getElementById('place').value = data['place'];
                    document.getElementById('memo').value = data['memo'];
                    document.getElementById('category').value = data['category'];
                })
                // Ajaxリクエストが失敗した時発動
                .fail((data) => {
                    console.log(data);
                })
        },
        err => {
            console.log('error', err);
        }
    );
})

document.editForm.add.addEventListener('click', function () {

    if (!document.editForm.reportValidity()) {
        return;
    }

    const accessToken = liff.getAccessToken();

    if (!accessToken) {
        console.error("can't get token");
        return;
    }

    const param = /^\?\w*id=(\d+)/.exec(location.search);

    let id = 0;
    if (param) {
        id = param[1];
    }

    $.ajax({
        url: `/edit`,
        type: 'POST',
        headers: {
            'accessToken': accessToken
        },
        data: {
            id: id,
            name: document.getElementById('name').value,
            limit_day: document.getElementById('limitDay').value,
            place: document.getElementById('place').value,
            memo: document.getElementById('memo').value,
            category: document.getElementById('category').value
        }
    })
        // Ajaxリクエストが成功した時発動
        .done((data) => {
            document.title = "success";
        })
        // Ajaxリクエストが失敗した時発動
        .fail((data) => {
            document.title = "fail";
        })

});