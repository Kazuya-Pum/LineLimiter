document.addEventListener("DOMContentLoaded", () => {

    (async () => {
        try {
            loading(true);

            const info = await (await fetch('/preset', {
                method: 'POST',
            })).json();

            await setItemBtn(info);
        } catch (err) {
            console.log(err.message);
        } finally {
            loading(false);
        }
    })();

    async function setItemBtn(info) {
        const listAll = document.getElementById('list-all');
        const list0 = document.getElementById('list-0');
        const list1 = document.getElementById('list-1');
        const list2 = document.getElementById('list-2');
        const list3 = document.getElementById('list-3');

        const icons = ['seasonerIcon', 'freshIcon', 'preservedIcon', 'otherIcon'];

        for (let i = 0; i < info.length; i++) {
            const btn = document.createElement('button');
            btn.value = info[i].id;
            btn.classList.add('ll-list-btn');
            btn.type = 'submit';
            btn.name = 'preset';
            btn.value = info[i].id;

            const item = `
                            <svg class="ll-list-icon"><use href="/images/ll-icons.svg#${icons[info[i].category]}"></use></svg>
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

    function loading(enabled) {
        document.getElementById('loader').style.visibility = (enabled) ? "visible" : "hidden";
    }
}, { once: true });
