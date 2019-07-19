document.addEventListener("DOMContentLoaded", () => {

    const infoBord = document.getElementById('info-tab');

    liff.init(
        async (data) => {
            try {
                const accessToken = liff.getAccessToken();

                if (!accessToken) {
                    throw new Error("can't get token");
                }

                loading(true);

                const info = await (await fetch('/list', {
                    method: 'POST',
                    headers: {
                        'accessToken': accessToken,
                    }
                })).json();

                const listAll = document.getElementById('list-all');
                const list0 = document.getElementById('list-0');
                const list1 = document.getElementById('list-1');
                const list2 = document.getElementById('list-2');
                const list3 = document.getElementById('list-3');

                const today = new Date();

                for (let i = 0; i < info.length; i++) {

                    const limit = new Date(info[i].limit_day);

                    const diff = Math.floor((limit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                    const btn = document.createElement('button');
                    btn.value = info[i].id;
                    btn.classList.add('ll-list-btn');
                    btn.type = 'button';

                    btn.addEventListener('click', () => { togleInfo(info[i].id); });

                    const item = `<img class="ll-list-icon" src="${info[i].image_url || '/images/category.png'}">
                                    <div class="ll-list-name">
                                        <h4>${info[i].name}</h4>
                                        <small>${info[i].place || ""}</small>
                                    </div>
                                    <div>
                                        <small>あと</small>
                                        <strong>${diff}</strong>
                                        <small>日</small>
                                    </div>
                                `
                        ;
                    btn.insertAdjacentHTML('beforeend', item);
                    listAll.appendChild(btn);

                    const btn2 = btn.cloneNode(true);
                    btn2.addEventListener('click', () => { togleInfo(info[i].id); });

                    switch (info[i].category || 3) {
                        case 0:
                            list0.appendChild(btn2);
                            break;
                        case 1:
                            list1.appendChild(btn2);
                            break;
                        case 2:
                            list2.appendChild(btn2);
                            break;
                        case 3:
                        default:
                            list3.appendChild(btn2);
                            break;
                    }
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

    async function togleInfo(id) {
        infoBord.classList.toggle('ll-open');
        history.pushState(null, null, null);

        if (infoBord.classList.contains('ll-open')) {

            loading(true);

            const itemInfo = await (await fetch('/list/get', {
                method: 'POST',
                headers: {
                    'accessToken': liff.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })).json();

            const infoLimit = new Date(itemInfo.limit_day);

            document.getElementById('editButton').value = id;
            document.getElementById('infoName').textContent = itemInfo.name;
            document.getElementById('infoLimit').textContent = `${infoLimit.getFullYear()}/${infoLimit.getMonth()}/${infoLimit.getDate()}`;
            document.getElementById('infoPlace').textContent = itemInfo.place || '';
            document.getElementById('infoCategory').textContent = itemInfo.category || '';
            document.getElementById('infoImage').style.backgroundImage = `url(${itemInfo.image_url || '/images/icon.png'})`;
            switchUseBtn(itemInfo.enabled);

            loading(false);
        }
    };

    document.getElementById('backButton').addEventListener('click', () => {
        history.back();
    });

    window.addEventListener('popstate', () => {
        if (infoBord.classList.contains('ll-open')) {
            infoBord.classList.remove('ll-open');
        }
    }, false);

    const useButton = document.getElementById('useButton');
    useButton.addEventListener('click', async () => {
        try {

            loading(true);

            const result = await (await fetch('/list/use', {
                method: 'POST',
                headers: {
                    'accessToken': liff.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: document.getElementById('editButton').value })
            })).json();

            switchUseBtn(result.enabled);
        } catch (err) {
            console.error(err.message);
        } finally {
            loading(false);
        }
    });

    function switchUseBtn(enabled) {
        if (enabled) {
            useButton.classList.remove('ll-info-used');
        } else {
            useButton.classList.add('ll-info-used');
        }
    }

    function loading(enabled) {
        document.getElementById('loader').style.visibility = (enabled) ? "visible" : "hidden";
    }
});
