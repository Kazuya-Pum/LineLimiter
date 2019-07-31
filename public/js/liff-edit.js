'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const getId = /^\?\w*id=(\d+)/.exec(this.location.search);
    const id = (getId) ? getId[1] : 0;

    const getPreset = /^\?\w*preset=(\d+)/.exec(this.location.search);
    const preset = (getPreset) ? getPreset[1] : 0;

    loading(id || preset);

    liff.init(
        async (data) => {
            try {
                const accessToken = liff.getAccessToken();

                if (!accessToken) {
                    throw new Error("can't get token");
                }

                const info = await (await fetch('/edit/get', {
                    method: 'POST',
                    headers: {
                        'accessToken': accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: id,
                        preset: preset
                    })
                })).json();

                const notification_day = document.getElementById('notification_day');

                for (let i = 0; i < info.notification_list.length; ++i) {

                    let checked = '';
                    if ((id || preset) && info.notification.indexOf(info.notification_list[i]) !== -1) {
                        checked = 'checked';
                    }

                    const notifyLabel = `<label><input type="checkbox" value="${info.notification_list[i]}" name="notification[]" ${checked}><span class="button">${info.notification_list[i]}日前</span></label>`;

                    notification_day.insertAdjacentHTML('beforeend', notifyLabel);
                }

                const memoList = document.getElementById('memoList');

                const updateValue = (value, dummy) => {
                    dummy.textContent = value;
                };

                if ('memo' in info) {
                    for (let i = 0; i < info.memo.length; ++i) {
                        const memoBlock = document.createElement('div');
                        memoBlock.classList.add('ll-memo-block');

                        const memoDummy = document.createElement('div');
                        memoDummy.classList.add('ll-memo-dummy');
                        memoDummy.textContent = info.memo[i];

                        const memoText = document.createElement('input');
                        memoText.type = 'text';
                        memoText.classList.add('ll-memo-input');
                        memoText.name = 'memo[]';
                        memoText.value = info.memo[i];

                        memoText.addEventListener('keydown', () => {
                            updateValue(memoText.value, memoDummy);
                        });

                        const memoDelBtn = document.createElement('button');
                        memoDelBtn.type = 'button';
                        memoDelBtn.textContent = '✖';

                        memoDelBtn.addEventListener('click', () => {
                            memoList.removeChild(memoBlock);
                        })

                        memoBlock.appendChild(memoDelBtn);
                        const memoTextBlock = document.createElement('label');

                        memoTextBlock.appendChild(memoDummy);
                        memoTextBlock.appendChild(memoText);

                        memoBlock.appendChild(memoTextBlock);

                        memoList.insertBefore(memoBlock, memoList.lastElementChild);
                    }
                }

                if (id || preset) {
                    document.getElementById('nameTxt').value = info.name || '';
                    document.getElementById('timer').value = info.limit_day || '';
                    document.getElementById('placeTxt').value = info.place || '';
                    document.getElementById('preview').style.backgroundImage = `url(${info.image_url || ''})`;
                    document.getElementById('image_url').value = info.image_url || '';
                    document.getElementsByName('category')[(info.category !== null) ? info.category : 3].checked = true;
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
            console.error(err.message);
        } finally {
            loading(false);
        }
    });

    function loading(enabled = true) {
        document.getElementById('loader').style.visibility = (enabled) ? "visible" : "hidden";
    }
});
