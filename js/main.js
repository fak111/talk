document.addEventListener('DOMContentLoaded', () => {
    // 主题切换
    const themeSwitch = document.querySelector('.theme-switch');
    const body = document.body;

    themeSwitch.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeSwitch.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 幻灯片导航
    const slides = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.main-nav a');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function updateSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        slides[index].classList.add('active');
        navLinks[index].classList.add('active');
        currentSlide = index;

        // 更新导航按钮状态
        prevBtn.style.display = index === 0 ? 'none' : 'block';
        nextBtn.style.display = index === slides.length - 1 ? 'none' : 'block';
    }

    // 导航链接点击
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            updateSlide(index);
            window.scrollTo(0, 0);
        });
    });

    // 上一页/下一页按钮
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            updateSlide(currentSlide - 1);
            window.scrollTo(0, 0);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            updateSlide(currentSlide + 1);
            window.scrollTo(0, 0);
        }
    });

    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            updateSlide(currentSlide - 1);
            window.scrollTo(0, 0);
        } else if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
            updateSlide(currentSlide + 1);
            window.scrollTo(0, 0);
        }
    });

    // 滚动动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .feature, .timeline-item, .agent-card, .integration-item').forEach(element => {
        observer.observe(element);
    });

    // 初始化
    updateSlide(0);
});
