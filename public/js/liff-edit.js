document.addEventListener("DOMContentLoaded", () => {
    liff.init(
        async (data) => {
            try {
                const search = /^\?\w*id=(\d+)/.exec(this.location.search);

                if (!search) {
                    id = 0;
                } else {
                    id = search[1];
                }

                const accessToken = liff.getAccessToken();

                if (!accessToken) {
                    throw new Error("can't get token");
                }

                const info = await fetch('/edit/get', {
                    method: 'POST',
                    headers: {
                        'accessToken': accessToken
                    },
                    body: {
                        id: id
                    }
                });



                if (id) {
                    document.getElementById('nameTxt').value = info['name'];
                    document.getElementById('timer').value = info['limit_day'];
                    document.getElementById('placeTxt').value = info['place'];
                    document.getElementById('memoTxt').value = info['memo'];
                    document.getElementById('categoryTxt').value = info['category'];
                }
            } catch (err) {
                console.log(err);
            }
        },
        err => {
            console.log(err);
        }
    );

    document.getElementById('submitButton').addEventListener('click', async () => {
        try {
            const form = document.getElementById('form');
            if (!form.reportValidity()) {
                return;
            }

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
        }
    });
});

//$('#file').change(
//    function () {
//        if (!this.files.length) {
//            return;
//        }

//        var file = $(this).prop('files')[0];
//        var fr = new FileReader();
//        $('.preview').css('background-image', 'none');
//        fr.onload = function () {
//            $('.preview').css('background-image', 'url(' + fr.result + ')');
//        }
//        fr.readAsDataURL(file);
//        $(".preview img").css('opacity', 0);
//    }
//);
