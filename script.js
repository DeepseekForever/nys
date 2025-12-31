/**
 * Цифровой подарок от DolboDF
 * С реальными медиа-файлами из папки assets/
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация аудио
    initAudio();
    
    // Инициализация интерактивных элементов
    initInteractiveElements();
    
    // Инициализация анимаций
    initAnimations();
});

function initAudio() {
    const audio = document.getElementById('background-audio');
    const playBtn = document.getElementById('play-pause');
    const volumeSlider = document.getElementById('volume');
    
    if (audio && playBtn) {
        // Автовоспроизведение с задержкой
        setTimeout(() => {
            audio.play().catch(e => {
                console.log('Автовоспроизведение заблокировано. Пользователь должен начать воспроизведение вручную.');
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.title = 'Воспроизвести';
            });
        }, 1000);
        
        playBtn.addEventListener('click', function() {
            if (audio.paused) {
                audio.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.title = 'Пауза';
            } else {
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.title = 'Воспроизвести';
            }
        });
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                audio.volume = this.value / 100;
            });
            audio.volume = volumeSlider.value / 100;
        }
        
        // Обновление иконки при окончании трека
        audio.addEventListener('ended', function() {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.title = 'Воспроизвести';
        });
        
        // Обновление иконки при ошибке загрузки
        audio.addEventListener('error', function() {
            console.error('Ошибка загрузки аудиофайла');
            playBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            playBtn.title = 'Ошибка загрузки аудио';
        });
    }
}

function initInteractiveElements() {
    // Попапы
    document.querySelectorAll('[data-popup]').forEach(btn => {
        btn.addEventListener('click', function() {
            const popupId = this.dataset.popup;
            const popup = document.getElementById(popupId);
            if (popup) {
                popup.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие попапов
    document.querySelectorAll('.popup-close, .popup-overlay').forEach(el => {
        el.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('popup-close')) {
                const popup = this.closest('.popup-overlay');
                if (popup) {
                    popup.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#!')) return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Эффекты при наведении
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Обработка ошибок загрузки изображений
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.error(`Ошибка загрузки изображения: ${this.src}`);
            this.style.display = 'none';
            
            // Создаем заглушку
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 14px;
            `;
            placeholder.innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-image" style="font-size: 32px; margin-bottom: 10px; display: block;"></i>
                    <div>${this.alt || 'Изображение'}</div>
                </div>
            `;
            
            this.parentNode.replaceChild(placeholder, this);
        });
    });
}

function initAnimations() {
    // Анимация появления элементов при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section, .glass-card').forEach(el => {
        observer.observe(el);
    });
    
    // Добавляем случайные задержки для анимаций
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.05}s`;
    });
}

// Глобальные функции
function openVideoPopup(videoUrl) {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay active';
    popup.innerHTML = `
        <div class="popup-content">
            <button class="popup-close">&times;</button>
            <video controls autoplay style="width: 100%; max-width: 800px; border-radius: 10px;">
                <source src="${videoUrl}" type="video/mp4">
                Ваш браузер не поддерживает видео.
            </video>
        </div>
    `;
    
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
    
    popup.querySelector('.popup-close').addEventListener('click', function() {
        popup.remove();
        document.body.style.overflow = '';
    });
    
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.remove();
            document.body.style.overflow = '';
        }
    });
    
    // Обработка ошибок видео
    const video = popup.querySelector('video');
    video.addEventListener('error', function() {
        console.error(`Ошибка загрузки видео: ${videoUrl}`);
        this.parentNode.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #666; margin-bottom: 20px;"></i>
                <h3 style="color: var(--color-white); margin-bottom: 10px;">Ошибка загрузки видео</h3>
                <p style="color: var(--color-lighter-gray);">Не удалось загрузить видеофайл: ${videoUrl}</p>
                <button class="glass-btn" onclick="this.closest('.popup-overlay').remove(); document.body.style.overflow=''" style="margin-top: 20px;">
                    Закрыть
                </button>
            </div>
        `;
    });
}

// Делаем функции глобальными
window.openVideoPopup = openVideoPopup;
window.toggleAudio = function() {
    const audio = document.getElementById('background-audio');
    const btn = document.getElementById('play-pause');
    
    if (!audio || !btn) return;
    
    if (audio.paused) {
        audio.play();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        btn.innerHTML = '<i class="fas fa-play"></i>';
    }
};

// Функция проверки существования файлов (для отладки)
async function checkFileExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.warn(`Файл не найден: ${url}`);
        return false;
    }
}

// Проверяем основные медиа-файлы при загрузке
window.addEventListener('load', function() {
    const filesToCheck = [
        'assets/audio/mko.mp3',
        'assets/audio/nanedelkydovtorogofonk.mp3',
        'assets/audio/preddfng.mp3',
        'assets/audio/csly.mp3',
        'assets/images/main-bg.png',
        'assets/images/hub.png'
    ];
    
    filesToCheck.forEach(file => {
        checkFileExists(file);
    });
});