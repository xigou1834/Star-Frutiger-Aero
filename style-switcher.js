// 完整的样式切换系统
class StyleSwitcher {
    constructor() {
        this.currentTheme = this.getCurrentTheme();
        this.isLoading = false;
        this.themes = {
            original: {
                name: 'Apple经典风格',
                icon: '🍎',
                nextTheme: 'frutiger',
                nextText: '切换到未来风'
            },
            frutiger: {
                name: 'Frutiger Aero未来风格', 
                icon: '✨',
                nextTheme: 'original',
                nextText: '切换到经典风'
            }
        };
        this.init();
    }

    // 获取当前主题
    getCurrentTheme() {
        return localStorage.getItem('website-style') || 'original';
    }

    // 保存主题选择
    saveTheme(theme) {
        localStorage.setItem('website-style', theme);
    }

    // 初始化
    init() {
        this.createFloatingButton();
        this.createNotificationContainer();
        this.updateButtonState();
        this.bindEvents();
    }

    // 创建浮动切换按钮
    createFloatingButton() {
        // 检查是否已存在
        if (document.getElementById('floating-style-switcher')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'floating-style-switcher';
        container.innerHTML = `
            <button class="floating-switch-btn" id="floating-switch-btn" title="切换网站主题">
                <span class="switch-icon">🎨</span>
                <span class="switch-text">切换风格</span>
                <span class="loading-indicator"></span>
            </button>
        `;
        
        // 添加样式
        this.addFloatingButtonStyles();
        
        document.body.appendChild(container);
        
        // 绑定点击事件
        const button = document.getElementById('floating-switch-btn');
        button.addEventListener('click', () => this.switchTheme());
    }

    // 添加浮动按钮样式
    addFloatingButtonStyles() {
        if (document.getElementById('floating-switcher-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'floating-switcher-styles';
        styles.textContent = `
            #floating-style-switcher {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 1000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            
            .floating-switch-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 15px 25px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 
                    0 8px 25px rgba(102, 126, 234, 0.3),
                    0 4px 15px rgba(118, 75, 162, 0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                position: relative;
                overflow: hidden;
            }
            
            .floating-switch-btn:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 
                    0 12px 35px rgba(102, 126, 234, 0.4),
                    0 6px 20px rgba(118, 75, 162, 0.3);
            }
            
            .floating-switch-btn:active {
                transform: translateY(-1px) scale(1.02);
            }
            
            .floating-switch-btn.loading {
                pointer-events: none;
                opacity: 0.8;
            }
            
            .floating-switch-btn .switch-icon {
                font-size: 18px;
                transition: transform 0.3s ease;
            }
            
            .floating-switch-btn:hover .switch-icon {
                transform: rotate(360deg);
            }
            
            .floating-switch-btn .switch-text {
                font-weight: 600;
                letter-spacing: 0.3px;
            }
            
            .loading-indicator {
                display: none;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .floating-switch-btn.loading .loading-indicator {
                display: block;
            }
            
            .floating-switch-btn.loading .switch-icon {
                display: none;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* 响应式设计 */
            @media (max-width: 768px) {
                #floating-style-switcher {
                    bottom: 20px;
                    right: 20px;
                }
                
                .floating-switch-btn {
                    padding: 12px 20px;
                    font-size: 13px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // 创建通知容器
    createNotificationContainer() {
        if (document.getElementById('theme-notifications')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'theme-notifications';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
            pointer-events: none;
        `;
        
        document.body.appendChild(container);
    }

    // 显示通知
    showNotification(message, type = 'success', duration = 3000) {
        const container = document.getElementById('theme-notifications');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `theme-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        // 添加样式
        notification.style.cssText = `
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 10px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
        `;
        
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const icon = notification.querySelector('.notification-icon');
        icon.style.cssText = `
            font-size: 16px;
            font-weight: bold;
        `;
        
        container.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, duration);
    }

    // 更新按钮状态
    updateButtonState() {
        const button = document.getElementById('floating-switch-btn');
        if (!button) return;
        
        const currentThemeInfo = this.themes[this.currentTheme];
        if (!currentThemeInfo) return;
        
        const iconElement = button.querySelector('.switch-icon');
        const textElement = button.querySelector('.switch-text');
        
        if (iconElement) iconElement.textContent = currentThemeInfo.nextTheme === 'frutiger' ? '✨' : '🍎';
        if (textElement) textElement.textContent = currentThemeInfo.nextText;
        
        button.title = `当前: ${currentThemeInfo.name} - 点击${currentThemeInfo.nextText}`;
    }

    // 绑定事件
    bindEvents() {
        // 监听存储变化
        window.addEventListener('storage', (e) => {
            if (e.key === 'website-style') {
                this.currentTheme = e.newValue || 'original';
                this.updateButtonState();
            }
        });
        
        // 监听主题切换完成事件
        document.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
            this.updateButtonState();
        });
    }

    // 切换主题
    async switchTheme() {
        if (this.isLoading) {
            this.showNotification('正在切换中，请稍候...', 'info', 2000);
            return;
        }

        this.isLoading = true;
        const button = document.getElementById('floating-switch-btn');
        
        try {
            // 显示加载状态
            if (button) button.classList.add('loading');
            
            const currentThemeInfo = this.themes[this.currentTheme];
            const newTheme = currentThemeInfo.nextTheme;
            const newThemeInfo = this.themes[newTheme];
            
            this.showNotification(`正在切换到${newThemeInfo.name}...`, 'info', 2000);
            
            // 使用组件加载器切换主题
            if (window.componentLoader) {
                const success = await window.componentLoader.switchTheme(newTheme);
                
                if (success) {
                    this.currentTheme = newTheme;
                    this.saveTheme(newTheme);
                    this.updateButtonState();
                    
                    // 触发主题切换事件
                    document.dispatchEvent(new CustomEvent('themeChanged', {
                        detail: { theme: newTheme, themeName: newThemeInfo.name }
                    }));
                    
                    this.showNotification(`已切换到${newThemeInfo.name}！`, 'success');
                    
                    // 延迟一点再刷新页面，让用户看到通知
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    throw new Error('主题切换失败');
                }
            } else {
                // 如果组件加载器不可用，直接刷新页面
                this.currentTheme = newTheme;
                this.saveTheme(newTheme);
                location.reload();
            }
            
        } catch (error) {
            console.error('主题切换失败:', error);
            this.showNotification('主题切换失败，请稍后重试', 'error');
        } finally {
            this.isLoading = false;
            if (button) button.classList.remove('loading');
        }
    }

    // 强制切换到指定主题
    async forceSwitchTo(theme) {
        if (!this.themes[theme]) {
            console.error(`未知主题: ${theme}`);
            return false;
        }
        
        if (theme === this.currentTheme) {
            console.log(`已经是${theme}主题`);
            return true;
        }
        
        // 临时修改当前主题，然后调用切换
        const originalTheme = this.currentTheme;
        this.currentTheme = theme === 'original' ? 'frutiger' : 'original';
        
        try {
            await this.switchTheme();
            return true;
        } catch (error) {
            this.currentTheme = originalTheme;
            return false;
        }
    }
}

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保组件加载器已经初始化
    setTimeout(() => {
        if (!window.styleSwitcher) {
            window.styleSwitcher = new StyleSwitcher();
            console.log('样式切换器初始化完成');
        }
    }, 1000);
});

// 全局函数，供footer按钮调用
window.switchStyleFromFooter = function() {
    if (window.styleSwitcher && !window.styleSwitcher.isLoading) {
        window.styleSwitcher.switchTheme();
    } else {
        console.warn('样式切换器未准备就绪');
    }
};

// 导出供其他脚本使用
window.StyleSwitcher = StyleSwitcher;