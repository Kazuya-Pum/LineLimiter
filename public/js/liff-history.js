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

                const info = await (await fetch('/history', {
                    method: 'POST',
                    headers: {
                        'accessToken': accessToken,
                    }
                })).json();

                await setItemBtn(info);
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

    async function setItemBtn(info) {
        const listAll = document.getElementById('list-all');
        const list0 = document.getElementById('list-0');
        const list1 = document.getElementById('list-1');
        const list2 = document.getElementById('list-2');
        const list3 = document.getElementById('list-3');

        listAll.textContent = null;
        list0.textContent = null;
        list1.textContent = null;
        list2.textContent = null;
        list3.textContent = null;

        for (let i = 0; i < info.length; i++) {
            const btn = document.createElement('button');
            btn.value = info[i].id;
            btn.classList.add('ll-list-btn');
            btn.type = 'button';

            btn.addEventListener('click', () => { togleInfo(info[i].id); }, false);

            const item = `
                            <img class="ll-list-icon" src="${info[i].image_url || '/images/category.png'}">
                            <div class="ll-list-name">
                                <h4>${info[i].name}</h4>
                                <small>${info[i].place || ""}</small>
                            </div>
                        `;
            btn.insertAdjacentHTML('beforeend', item);
            listAll.appendChild(btn);

            const btn2 = btn.cloneNode(true);
            btn2.addEventListener('click', () => { togleInfo(info[i].id); }, false);

            switch (info[i].category) {
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
    };

    async function togleInfo(id) {
        try {
            infoBord.classList.toggle('ll-open');
            history.pushState(null, null, null);

            if (infoBord.classList.contains('ll-open') && id != (infoBord.dataset.id || 0)) {
                loading(true);

                const itemInfo = await (await fetch('/history/get', {
                    method: 'POST',
                    headers: {
                        'accessToken': liff.getAccessToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                })).json();

                let categoryTxt = '';
                switch (itemInfo.category) {
                    case 0:
                        categoryTxt = '調味料';
                        break;
                    case 1:
                        categoryTxt = '生鮮食品';
                        break;
                    case 2:
                        categoryTxt = '保存食';
                        break;
                    case 3:
                    default:
                        categoryTxt = 'その他';
                        break;
                }

                infoBord.setAttribute('data-id', id);
                document.getElementById('editButton').value = id;
                document.getElementsByName('infoName').forEach((elem) => { elem.textContent = itemInfo.name; });
                document.getElementById('infoPlace').textContent = itemInfo.place || '';
                document.getElementById('infoCategory').textContent = categoryTxt;
                document.getElementById('infoImage').style.backgroundImage = `url(${itemInfo.image_url || '/images/icon.png'})`;
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            loading(false);
        }
    };

    document.getElementById('backButton').addEventListener('click', () => {
        history.back();
    }, false);

    window.addEventListener('popstate', () => {
        if (infoBord.classList.contains('ll-open')) {
            infoBord.classList.remove('ll-open');
        }
        loading(false);
    }, false);

    document.getElementById('delSubmit').addEventListener('click', async () => {
        try {
            loading(true);

            if (!infoBord.dataset.id) {
                throw new Error('illegal id');
            }

            const info = await (await fetch('/history/delete', {
                method: 'POST',
                headers: {
                    'accessToken': liff.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: infoBord.dataset.id })
            })).json();

            document.getElementById('trigger').checked = false;

            await setItemBtn(info);

            history.back();
        } catch (err) {
            console.log(err.message);
        } finally {
            loading(false);
        }
    }, false);

    function loading(enabled) {
        document.getElementById('loader').style.visibility = (enabled) ? "visible" : "hidden";
    }
}, { once: true });
