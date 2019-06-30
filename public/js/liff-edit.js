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
                        document.getElementById('name').value = data['name'];
                        document.getElementById('limitDay').value = data['limit_day'];
                        document.getElementById('place').value = data['place'];
                        document.getElementById('memo').value = data['memo'];
                        document.getElementById('category').value = data['category'];
                    }

                    for (let i = 0; i < data['notification_list'].length; ++i) {

                        const elem = $(`<label><input class="uk-checkbox" type="checkbox" name="notification" value="${data['notification_list'][i]}">${data['notification_list'][i]}日前</label>`);

                        if (id && data['notification'].indexOf(data['notification_list'][i]) !== -1) {
                            elem.children('input').prop('checked', true);
                        }

                        $('#notification_day').append(elem);
                    }
                })
                .fail((data) => {
                    console.log(data);
                })
        },
        err => {
            console.log('error', err);
        }
    );

    document.getElementById('submit').addEventListener('click', function () {

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

        let id = 0;
        if (param) {
            id = param[1];
        }

        let notification = '';
        for (let i = 0; i < form.notification.length; ++i) {
            if (form.notification[i].checked) {

                if (notification !== '') {
                    notification += ',';
                }
                notification += form.notification[i].value;
            }
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
                category: document.getElementById('category').value,
                notification: notification
            }
        })
            .done((data) => {
                UIkit.modal.alert(data)
                    .then(function () {
                        console.log('Alert closed.')
                    });
            })
            .fail((data) => {
                UIkit.modal.alert(data)
                    .then(function () {
                        console.log('Alert closed.')
                    });
            })
    });
})
