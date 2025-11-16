import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { useState, useEffect } from 'react';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const [isVisible, setIsVisible] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 向下滚动（scrollY 增加）时显示 header
      // 向上滚动（scrollY 减少）时隐藏 header
      if (currentScrollY < lastScrollY) {
        // 向上滚动
        setIsVisible(false);
      } else if (currentScrollY > lastScrollY) {
        // 向下滚动
        setIsVisible(true);
      }
      
      // 在页面顶部时始终显示
      if (currentScrollY < 10) {
        setIsVisible(true);
        setHasShadow(false);
      } else {
        // 滚动超过一定距离时显示阴影
        setHasShadow(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${hasShadow ? 'shadow-sm' : 'shadow-none'}`}
    >
      <nav className="flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 text-black dark:text-white">
          <div className="size-10 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">CV</span>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">it's me</h2>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium leading-normal hover:text-gray-600 dark:hover:text-gray-400 transition-colors text-black dark:text-white"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-sm font-medium leading-normal hover:text-gray-600 dark:hover:text-gray-400 transition-colors text-black dark:text-white"
            >
              {t.nav.services}
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-sm font-medium leading-normal hover:text-gray-600 dark:hover:text-gray-400 transition-colors text-black dark:text-white"
            >
              {t.nav.projects}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-medium leading-normal hover:text-gray-600 dark:hover:text-gray-400 transition-colors text-black dark:text-white"
            >
              {t.nav.contact}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-black dark:text-white" />
              ) : (
                <Moon className="w-5 h-5 text-black dark:text-white" />
              )}
            </button>
            <div className="flex items-center rounded-full bg-gray-200 dark:bg-gray-800 p-0.5 text-sm font-medium">
              <button
                onClick={() => language !== 'en' && toggleLanguage()}
                className={`px-2 py-1 rounded-full transition-colors ${
                  language === 'en'
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-black dark:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => language !== 'zh' && toggleLanguage()}
                className={`px-2 py-1 rounded-full transition-colors ${
                  language === 'zh'
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-black dark:text-white'
                }`}
              >
                中
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

