'use strict';

document.addEventListener("DOMContentLoaded", () => {
    liff.init(
        async (data) => {
            try {
                const search = /^\?\w*id=(\d+)/.exec(this.location.search);
                const id = (search) ? search[1] : 0;

                const accessToken = liff.getAccessToken();

                if (!accessToken) {
                    throw new Error("can't get token");
                }

                loading(true);

                const info = await (await fetch('/edit/get', {
                    method: 'POST',
                    headers: {
                        'accessToken': accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: id
                    })
                })).json();

                const notification_day = document.getElementById('notification_day');

                for (let i = 0; i < info.notification_list.length; ++i) {

                    let checked = '';
                    if (id && info.notification.indexOf(info.notification_list[i]) !== -1) {
                        checked = 'checked';
                    }

                    const notifyLabel = `<label><input type="checkbox" value="${info.notification_list[i]}" name="notification[]" ${checked}><span class="button">${info.notification_list[i]}日前</span></label>`;

                    notification_day.insertAdjacentHTML('beforeend', notifyLabel);
                }

                if (id) {
                    document.getElementById('nameTxt').value = info.name;
                    document.getElementById('timer').value = info.limit_day;
                    document.getElementById('placeTxt').value = info.place || '';
                    document.getElementById('preview').style.backgroundImage = `url(${info.image_url || ''})`;
                    document.getElementById('image_url').value = info.image_url || '';
                    document.getElementsByName('category')[(info.category !== null) ? info.category : 3].checked = true;
                    document.getElementById('memoTxt').value = info.memo || '';
                }
            } catch (err) {
                console.log(err.message);
            } finally {
                loading(false);
            }
        },
        err => {
            console.log(err.message);
            loading(false);
        }
    );

    document.getElementById('submitButton').addEventListener('click', async () => {
        try {
            const form = document.getElementById('form');
            if (!form.reportValidity()) {
                return;
            }

            loading(true);

            const accessToken = liff.getAccessToken();
            if (!accessToken) {
                throw new Error("can't get token");
            }

            const param = /^\?\w*id=(\d+)/.exec(location.search);
            const id = (param) ? param[1] : 0;

            const editData = new FormData(form);
            editData.append('id', id);

            const res = await fetch('/edit', {
                method: 'POST',
                headers: {
                    'accessToken': accessToken,
                },
                credentials: 'same-origin',
                body: editData
            });

            if (res.ok) {
                alert('success');
            }
        } catch (err) {
            alert(err);
        } finally {
            loading(false);
        }
    });

    function loading(enabled) {
        document.getElementById('loader').style.visibility = (enabled) ? "visible" : "hidden";
    }
});
