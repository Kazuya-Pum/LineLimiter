document.editForm.add.addEventListener('click', function () {
    liff.init(
        data => {
            document.editForm.userId.setAttribute('value', data.context.userId);
            document.editForm.submit();
        },
        err => {
            console.log('error', err);
        }
    );
});