$(function () {

    liff.init(
        data => {
            const accessToken = liff.getAccessToken();

            $.ajax({
                url: '/setting/get',
                type: 'POST',
                headers: {
                    'accessToken': accessToken
                },
                data: {}
            })
                // Ajax���N�G�X�g����������������
                .done((data) => {
                    document.getElementById('notification').value = data['notification'];
                })
                // Ajax���N�G�X�g�����s����������
                .fail((data) => {
                    console.log(data);
                })
        },
        err => {
            console.log(err);
        })

    document.getElementById('submit').addEventListener('click', function () {

        if (!document.getElementById('form').reportValidity()) {
            return;
        }

        const accessToken = liff.getAccessToken();

        if (!accessToken) {
            console.error("can't get token");
            return;
        }

        $.ajax({
            url: `/setting`,
            type: 'POST',
            headers: {
                'accessToken': accessToken
            },
            data: {
                notification: document.getElementById('notification').value
            }
        })
            // Ajax���N�G�X�g����������������
            .done((data) => {
                UIkit.modal.alert(data)
                    .then(function () {
                        console.log('Alert closed.')
                    });
            })
            // Ajax���N�G�X�g�����s����������
            .fail((data) => {
                UIkit.modal.alert(data)
                    .then(function () {
                        console.log('Alert closed.')
                    });
            })

    });
})