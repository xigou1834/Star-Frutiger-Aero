// 完整的组件加载器 - 支持样式切换和所有页面
class ComponentLoader {
    constructor() {
        this.currentTheme = this.getCurrentTheme();
        this.isLoading = false;
        this.components = ['header', 'footer'];
        this.loadingScreen = null;
    }

    // 获取当前主题
    getCurrentTheme() {
        return localStorage.getItem('website-style') || 'original';
    }

    // 显示加载界面
    showLoadingScreen() {
        // 创建加载界面
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'page-loading-overlay';
        this.loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">加载中...</div>
            </div>
        `;
        
        // 添加样式
        this.loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s ease;
        `;
        
        const loadingContent = this.loadingScreen.querySelector('.loading-content');
        loadingContent.style.cssText = `
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;
        
        const spinner = this.loadingScreen.querySelector('.loading-spinner');
        spinner.style.cssText = `
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-top: 3px solid #007aff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        `;
        
        const text = this.loadingScreen.querySelector('.loading-text');
        text.style.cssText = `
            color: #333;
            font-size: 14px;
        `;
        
        // 添加旋转动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(this.loadingScreen);
    }

    // 隐藏加载界面
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
                this.loadingScreen = null;
            }, 300);
        }
    }

    // 加载组件
    async loadComponent(id, baseName) {
        try {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`元素 #${id} 不存在`);
                return;
            }

            // 首先尝试加载主题特定的文件
            let fileName = `${baseName}-${this.currentTheme}.html`;
            let response = await fetch(fileName);
            
            // 如果主题特定文件不存在，尝试加载默认文件
            if (!response.ok) {
                console.warn(`${fileName} 加载失败，尝试加载默认文件`);
                fileName = `${baseName}.html`;
                response = await fetch(fileName);
                
                if (!response.ok) {
                    throw new Error(`${fileName} 也加载失败`);
                }
            }
            
            const html = await response.text();
            element.innerHTML = html;
            
            console.log(`成功加载组件: ${fileName}`);
        } catch (error) {
            console.error(`加载 ${baseName} 组件失败:`, error);
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = `
                    <div style="text-align: center; color: #999; padding: 20px; background: rgba(255,0,0,0.1); border-radius: 8px; margin: 10px;">
                        组件加载失败: ${baseName}
                    </div>
                `;
            }
        }
    }

    // 加载主题样式文件
    async loadThemeStyle() {
        return new Promise((resolve) => {
            // 移除旧的主题样式
            const oldThemeStyle = document.getElementById('theme-style');
            if (oldThemeStyle) {
                oldThemeStyle.remove();
            }

            // 如果是原始主题，加载 style-original.css 或者不加载额外样式
            if (this.currentTheme === 'original') {
                const styleLink = document.createElement('link');
                styleLink.id = 'theme-style';
                styleLink.rel = 'stylesheet';
                styleLink.href = 'style-original.css';
                styleLink.setAttribute('data-theme', 'original');
                
                styleLink.onload = () => {
                    console.log('原始主题样式加载完成');
                    resolve();
                };
                
                styleLink.onerror = () => {
                    console.warn('原始主题样式加载失败，使用默认样式');
                    resolve();
                };
                
                document.head.appendChild(styleLink);
            } else {
                // 加载其他主题样式
                const styleLink = document.createElement('link');
                styleLink.id = 'theme-style';
                styleLink.rel = 'stylesheet';
                styleLink.href = `style-${this.currentTheme}.css`;
                styleLink.setAttribute('data-theme', this.currentTheme);

                styleLink.onload = () => {
                    console.log(`主题样式 ${this.currentTheme} 加载完成`);
                    resolve();
                };

                styleLink.onerror = () => {
                    console.warn(`主题样式 style-${this.currentTheme}.css 加载失败，使用默认样式`);
                    resolve();
                };

                document.head.appendChild(styleLink);
            }
        });
    }

    // 加载主题脚本
    async loadThemeScript() {
        return new Promise((resolve) => {
            // 移除旧的主题脚本
            const oldThemeScript = document.getElementById('theme-script');
            if (oldThemeScript) {
                oldThemeScript.remove();
            }

            // 加载主题脚本
            const script = document.createElement('script');
            script.id = 'theme-script';
            script.src = `script-${this.currentTheme}.js`;
            script.setAttribute('data-theme', this.currentTheme);

            script.onload = () => {
                console.log(`主题脚本 ${this.currentTheme} 加载完成`);
                setTimeout(resolve, 100); // 等待脚本初始化
            };

            script.onerror = () => {
                console.warn(`主题脚本 script-${this.currentTheme}.js 加载失败，尝试加载默认脚本`);
                
                // 尝试加载默认脚本
                const defaultScript = document.createElement('script');
                defaultScript.id = 'theme-script';
                defaultScript.src = 'script.js';
                defaultScript.setAttribute('data-theme', 'default');
                
                defaultScript.onload = () => {
                    console.log('默认脚本加载完成');
                    setTimeout(resolve, 100);
                };
                
                defaultScript.onerror = () => {
                    console.error('默认脚本也加载失败');
                    resolve(); // 继续执行，即使脚本加载失败
                };
                
                document.body.appendChild(defaultScript);
            };

            document.body.appendChild(script);
        });
    }

    // 初始化页面
    async initialize() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            // 显示加载界面
            this.showLoadingScreen();
            
            // 设置页面初始透明度
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';

            // 并行加载所有必需的资源
            await Promise.all([
                this.loadComponent('header', 'header'),
                this.loadComponent('footer', 'footer'),
                this.loadThemeStyle()
            ]);

            // 加载主题脚本
            await this.loadThemeScript();

            // 延迟显示页面，确保所有资源都已加载
            setTimeout(() => {
                this.hideLoadingScreen();
                document.body.style.opacity = '1';
                
                // 初始化样式切换器
                setTimeout(() => {
                    this.initializeStyleSwitcher();
                }, 300);
            }, 500);

        } catch (error) {
            console.error('页面初始化失败:', error);
            // 即使失败也要显示页面
            this.hideLoadingScreen();
            document.body.style.opacity = '1';
        } finally {
            this.isLoading = false;
        }
    }

    // 初始化样式切换器
    initializeStyleSwitcher() {
        // 检查样式切换器脚本是否已加载
        if (typeof StyleSwitcher === 'undefined') {
            console.warn('样式切换器未加载，尝试手动加载');
            
            const script = document.createElement('script');
            script.src = 'style-switcher.js';
            script.onload = () => {
                console.log('样式切换器手动加载完成');
                if (typeof StyleSwitcher !== 'undefined') {
                    window.styleSwitcher = new StyleSwitcher();
                }
            };
            script.onerror = () => {
                console.error('样式切换器加载失败');
            };
            document.body.appendChild(script);
        } else {
            // 如果已经加载，直接初始化
            if (!window.styleSwitcher) {
                window.styleSwitcher = new StyleSwitcher();
            }
        }
    }

    // 重新加载组件（用于主题切换）
    async reloadComponents() {
        this.currentTheme = this.getCurrentTheme();
        
        await Promise.all([
            this.loadComponent('header', 'header'),
            this.loadComponent('footer', 'footer')
        ]);
    }

    // 切换主题
    async switchTheme(newTheme) {
        if (this.isLoading) return false;
        
        this.isLoading = true;
        this.currentTheme = newTheme;
        
        try {
            // 保存主题选择
            localStorage.setItem('website-style', newTheme);
            
            // 重新加载所有资源
            await Promise.all([
                this.reloadComponents(),
                this.loadThemeStyle()
            ]);
            
            await this.loadThemeScript();
            
            return true;
        } catch (error) {
            console.error('主题切换失败:', error);
            return false;
        } finally {
            this.isLoading = false;
        }
    }
}

// 全局实例
window.componentLoader = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader = new ComponentLoader();
    window.componentLoader.initialize();
});

// 页面可见性变化时检查主题一致性
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.componentLoader) {
        const savedTheme = localStorage.getItem('website-style') || 'original';
        if (savedTheme !== window.componentLoader.currentTheme) {
            console.log('检测到主题不一致，重新加载页面');
            location.reload();
        }
    }
});

// 导出供其他脚本使用
window.ComponentLoader = ComponentLoader;