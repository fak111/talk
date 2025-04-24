document.addEventListener('DOMContentLoaded', () => {
    // 滚动动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // 为所有带有animate-fade-in类的元素添加animate-on-scroll类
    document.querySelectorAll('.animate-fade-in').forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
});
