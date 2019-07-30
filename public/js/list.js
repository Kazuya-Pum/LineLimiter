(() => {
    const swiper = new Swiper('.swiper-container', {
        scrollbar: {
            el: '.swiper-scrollbar',
            hide: false
        },
    });

    const slideTo = (event) => {
        swiper.slideTo(event.currentTarget.dataset.slide);
    };

    const navBtns = document.getElementById('navBtns').children;
    for (let i = 0, len = navBtns.length; i < len; i++) {
        navBtns[i].addEventListener('click', slideTo, false);
    }
})();