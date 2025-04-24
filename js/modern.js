document.addEventListener('DOMContentLoaded', () => {
    // 主题切换功能
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme === 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(!isDark);
    });
    
    function updateThemeIcon(isDark) {
        themeToggle.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }
    
    // 页面滚动动画
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // 初始检查
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 考虑导航栏高度
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 导航栏滚动效果
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 滚动方向检测
        if (window.scrollY > lastScrollY) {
            header.classList.add('nav-hidden');
        } else {
            header.classList.remove('nav-hidden');
        }
        
        lastScrollY = window.scrollY;
    });
    
    // 页面加载动画
    const pageTransition = document.querySelector('.page-transition');
    if (pageTransition) {
        pageTransition.classList.add('active');
        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 500);
    }
    
    // 移动端菜单
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.main-nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // 关闭点击外部区域的移动菜单
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
});
