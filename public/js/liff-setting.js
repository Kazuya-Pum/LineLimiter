'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const notification = document.getElementById('notification');
    const notificationDay = document.getElementById('notificationDay');
    const viewMode = document.getElementsByName('viewMode');
    let notificationList = [];

    const removeNotifyBtn = (event) => {
        event.currentTarget.parentNode.removeChild(event.currentTarget);

        notificationList = [];
        document.getElementsByName('notifycationDay[]').forEach((elem) => { notificationList.push(Number(elem.value)); });

        console.log(notificationList);
    };

    const decideNotifyBtn = (event) => {
        if (event.currentTarget.parentNode == null) {
            return;
        }
        const notifyBtn = event.currentTarget.parentNode.parentNode;

        if (event.type === 'blur') {
            if (!Number(event.currentTarget.value.trim())) {
                notificationDay.removeChild(notifyBtn);
            }

            return;
        }

        if (event.type === 'change' && notificationList.some((value) => { return (value === Number(event.currentTarget.value)) })) {
            notificationDay.removeChild(notifyBtn);
            return;
        }

        notifyBtn.value = event.currentTarget.value;
        notifyBtn.addEventListener('click', removeNotifyBtn, { once: true });

        notificationList.push(Number(event.currentTarget.value));

        if (notificationList.length % 2 == 0) {
            notifyBtn.classList.add('ll-btn-odd');
        }

        const notifyText = document.createElement('span');
        notifyText.textContent = `X ${event.currentTarget.value}`;

        event.currentTarget.parentNode.insertBefore(notifyText, event.currentTarget.parentNode.firstChild);
        event.currentTarget.parentNode.removeChild(event.currentTarget);
    }

    const addNotifyBtn = () => {
        const notifyBtn = document.createElement('button');
        notifyBtn.type = 'button';
        notifyBtn.name = 'notifycationDay[]';

        const notifyInput = document.createElement('input');
        notifyInput.type = "number";
        notifyInput.classList.add('ll-notify-input');

        notifyInput.addEventListener('change', decideNotifyBtn, false);
        notifyInput.addEventListener('blur', decideNotifyBtn, false);

        const notifyText = document.createElement('span');
        notifyText.textContent = "日前";

        notifyText.insertBefore(notifyInput, notifyText.firstChild);
        notifyBtn.appendChild(notifyText);

        notificationDay.insertBefore(notifyBtn, notificationDay.lastElementChild);

        notifyInput.focus();
    }

    document.getElementById('notifyAddBtn').addEventListener('click', addNotifyBtn, false);

    liff.init(
        async (data) => {
            try {
                const accessToken = liff.getAccessToken();

                if (!accessToken) {
                    throw new Error("can't get token");
                }

                loading(true);

                const info = await (await fetch('/setting/get', {
                    method: 'POST',
                    headers: {
                        'accessToken': accessToken
                    }
                })).json();

                notification.value = info.notification || 12;
                viewMode[Number(info.view_mode || 0)].checked = true;

                for (let i = 0; i < info.notification_day.length; i++) {
                    const notifyBtn = document.createElement('button');
                    notifyBtn.type = 'button';
                    notifyBtn.name = 'notifycationDay[]';
                    notifyBtn.value = info.notification_day[i];

                    notificationList.push(Number(info.notification_day[i]));

                    if (notificationList.length % 2 == 0) {
                        notifyBtn.classList.add('ll-btn-odd');
                    }

                    notifyBtn.insertAdjacentHTML('beforeend', `<span>X ${info.notification_day[i]}日前</span>`);
                    notifyBtn.addEventListener('click', removeNotifyBtn, { once: true });

                    notificationDay.insertBefore(notifyBtn, notificationDay.lastElementChild);
                }

            } catch (err) {
                console.error(err.message);
            } finally {
                loading(false);
            }
        },
        err => {
            console.log(err.message);
            loading(false);
        }
    );

    document.getElementById('saveBtn').addEventListener('click', async () => {
        try {
            const settingForm = document.getElementById('settingForm');
            if (!settingForm.reportValidity()) {
                return;
            }

            loading(true);

            const accessToken = liff.getAccessToken();
            if (!accessToken) {
                throw new Error("can't get token");
            }

            const res = await fetch('/setting', {
                method: 'POST',
                headers: {
                    'accessToken': accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    notification: notification.value,
                    notificationDay: notificationList,
                    viewMode: settingForm.viewMode.value
                })
            });

            if (res.ok) {
                alert('success');
            }
        } catch (err) {
            console.error(err);
        } finally {
            loading(false);
        }
    });

    function loading(enabled) {
        document.getElementById('loader').style.visibility = (enabled) ? "visible" : "hidden";
    }
});