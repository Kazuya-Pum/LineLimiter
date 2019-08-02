document.addEventListener("DOMContentLoaded", () => {

    const infoBord = document.getElementById('info-tab');

    const calendar = document.getElementById('calendar');
    const weeks = ['日', '月', '火', '水', '木', '金', '土'];
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let infoByDay = {};
    liff.init(
        async (data) => {
            try {
                const accessToken = liff.getAccessToken();

                if (!accessToken) {
                    throw new Error("can't get token");
                }

                loading(true);

                const result = await (await fetch('/list', {
                    method: 'POST',
                    headers: {
                        'accessToken': accessToken,
                    }
                })).json();

                if (result.viewMode) {
                    switchViewMode();
                }

                document.getElementById('listView').classList.remove('ll-hide');

                const info = result.food;


                await setItemBtn(info);

                const now = createCalendar(year, month);
                calendar.appendChild(now);
                calendar.scrollTop = '10vh';
            } catch (err) {
                console.log(err.stack);
            } finally {
                loading(false);
            }
        },
        err => {
            console.log(err.message);
            loading(false);
        }
    );

    document.getElementById('search').addEventListener('change', async (event) => {
        try {
            const accessToken = liff.getAccessToken();

            if (!accessToken) {
                throw new Error("can't get token");
            }

            loading(true);

            const result = await (await fetch('/list/search', {
                method: 'POST',
                headers: {
                    'accessToken': accessToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prefix: event.currentTarget.value
                })
            })).json();

            setItemBtn(result);

        } catch (err) {
            console.error(err.message);
        } finally {
            loading(false);
        }

    })

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

        const today = new Date();

        for (let i = 0; i < info.length; i++) {
            const limit = new Date(info[i].limit_day);

            const infoYear = limit.getFullYear();
            const infoMonth = limit.getMonth() + 1;
            const infoDate = limit.getDate();
            if (infoYear in infoByDay) {
                if (infoMonth in infoByDay[infoYear]) {
                    if (infoDate in infoByDay[infoYear][infoMonth]) {
                        infoByDay[infoYear][infoMonth][infoDate].push(info[i]);
                    } else {
                        infoByDay[infoYear][infoMonth][infoDate] = [];
                        infoByDay[infoYear][infoMonth][infoDate].push(info[i]);
                    }
                } else {
                    infoByDay[infoYear][infoMonth] = {};
                    infoByDay[infoYear][infoMonth][infoDate] = [];
                    infoByDay[infoYear][infoMonth][infoDate].push(info[i]);
                }
            } else {
                infoByDay[infoYear] = {};
                infoByDay[infoYear][infoMonth] = {};
                infoByDay[infoYear][infoMonth][infoDate] = [];
                infoByDay[infoYear][infoMonth][infoDate].push(info[i]);
            }

            const diff = Math.floor((limit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            const btn = document.createElement('button');
            btn.value = info[i].id;
            btn.classList.add('ll-list-btn');
            btn.type = 'button';

            if (diff < 1) {
                btn.classList.add('ll-limited');
            }

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
        infoBord.classList.toggle('ll-open');
        history.pushState(null, null, null);

        if (infoBord.classList.contains('ll-open') && id != (infoBord.dataset.id || 0)) {

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
            document.getElementById('infoName').textContent = itemInfo.name;
            document.getElementById('infoLimit').textContent = `${infoLimit.getFullYear()}/${infoLimit.getMonth() + 1}/${infoLimit.getDate()}`;
            document.getElementById('infoPlace').textContent = itemInfo.place || '';
            document.getElementById('infoCategory').textContent = categoryTxt;
            document.getElementById('infoImage').style.backgroundImage = `url(${itemInfo.image_url || '/images/icon.png'})`;

            const memoList = document.getElementById('infoMemo');
            for (let i = 0; i < itemInfo.memo.length; i++) {
                const memo = document.createElement('div');
                memo.textContent = itemInfo.memo[i];

                memoList.appendChild(memo);
            }

            switchUseBtn(itemInfo.enabled);

            loading(false);
        }
    };

    document.getElementById('toggleView').addEventListener('click', switchViewMode, false);

    document.getElementById('backButton').addEventListener('click', () => {
        history.back();
    });

    window.addEventListener('popstate', () => {
        if (infoBord.classList.contains('ll-open')) {
            infoBord.classList.remove('ll-open');
            loading(false);
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

    function switchViewMode() {
        const contents = document.getElementsByClassName('ll-contents');
        for (let i = 0; i < contents.length; i++) {
            contents[i].classList.toggle('ll-contents-active');
        }

        const viewBtnIcon = document.getElementById('viewBtnIcon');

        if (viewBtnIcon.getAttribute('href') === '/images/ll-icons.svg#calendarViewIcon') {
            viewBtnIcon.setAttribute('href', '/images/ll-icons.svg#listViewIcon');
            document.getElementById('search').classList.add('ll-hide');
        } else {
            viewBtnIcon.setAttribute('href', '/images/ll-icons.svg#calendarViewIcon');
            document.getElementById('search').classList.remove('ll-hide');
        }
    }

    function switchUseBtn(enabled = true) {
        if (enabled) {
            useButton.classList.remove('ll-info-used');
        } else {
            useButton.classList.add('ll-info-used');
        }
    }

    function clickCalandarBtn(event) {
        if (event.target.type = 'button') {
            togleInfo(event.target.value);
        }
    }

    function createCalendar(year = 2019, month = 1) {
        let data = {};
        if (year in infoByDay && month in infoByDay[year]) {
            data = infoByDay[year][month];
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const endDayCount = endDate.getDate();
        const startDay = startDate.getDay();
        let dayCount = 1;

        let calendarHtml = '';
        calendarHtml += `<h3 class="ll-calendar-head">${month}月</h3>`;
        calendarHtml += '<div><table><thead><tr>';
        for (let i = 0; i < weeks.length; i++) {
            calendarHtml += `<td>${weeks[i]}</td>`;
        }
        calendarHtml += '</tr></thead><tbody>';
        for (let w = 0; w < 6; w++) {
            calendarHtml += '<tr>'

            for (let d = 0; d < 7; d++) {
                if (w == 0 && d < startDay) {
                    // 1行目で1日の曜日の前
                    calendarHtml += '<td></td>'
                } else if (dayCount > endDayCount) {
                    // 末尾の日数を超えた
                    calendarHtml += '<td></td>'
                } else {
                    if (dayCount in data) {
                        calendarHtml += `<td><button type="button" value="${data[dayCount][0].id}" class="ll-calendar-btn" style="background-image : url(${data[dayCount][0].image_url});">${dayCount}</button></td>`
                    } else {
                        calendarHtml += '<td>' + dayCount + '</td>'
                    }
                    dayCount++
                }
            }
            calendarHtml += '</tr>'
        }
        calendarHtml += '</tbody></table></div>'

        const calendarBlock = document.createElement('div');
        calendarBlock.innerHTML = calendarHtml;
        calendarBlock.classList.add('ll-calendar');
        calendarBlock.setAttribute('data-month', month);
        calendarBlock.setAttribute('data-year', year);

        calendarBlock.addEventListener('click', clickCalandarBtn, false);

        return calendarBlock;
    }

    function prevCalendar() {
        let prevMonth = (('dataset' in calendar.firstChild && 'month' in calendar.firstChild.dataset) ? calendar.firstChild.dataset.month : month) - 1;
        let prevYear = ('dataset' in calendar.firstChild && 'year' in calendar.firstChild.dataset) ? calendar.firstChild.dataset.year : year;
        if (prevMonth == 0) {
            prevYear--;
            prevMonth = 12;
        }

        const prev = createCalendar(prevYear, prevMonth);
        calendar.insertBefore(prev, calendar.firstChild);
    }

    function nextcalendar() {
        let nextMonth = Number(('dataset' in calendar.lastChild && 'month' in calendar.lastChild.dataset) ? calendar.lastChild.dataset.month : month) + 1;
        let nextYear = ('dataset' in calendar.lastChild && 'year' in calendar.lastChild.dataset) ? calendar.lastChild.dataset.year : year;
        if (nextMonth == 13) {
            nextYear++;
            nextMonth = 1;
        }

        const next = createCalendar(nextYear, nextMonth);
        calendar.appendChild(next);
    }

    calendar.addEventListener('scroll', () => {
        if (calendar.scrollTop == 0) {
            prevCalendar();
        } else if (calendar.lastChild.getBoundingClientRect().top < 70) {
            nextcalendar();
        }
    });

    function loading(enabled) {
        document.getElementById('loader').style.visibility = (enabled) ? "visible" : "hidden";
    }
});
