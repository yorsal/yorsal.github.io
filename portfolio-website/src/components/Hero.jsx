import { Download, CheckSquare, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import OptimizedImage from './OptimizedImage';

gsap.registerPlugin(TextPlugin);

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRefs = useRef([]);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    // 重置 refs 数组
    descRefs.current = [];
    
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const fullText = `${t.hero.greeting} ${t.hero.title}.`;
        // 先设置初始状态
        gsap.set(titleRef.current, { 
          opacity: 1,
          text: '',
        });
        
        // 打字机效果
        gsap.to(titleRef.current, {
          text: fullText,
          duration: 1.5,
          ease: 'none',
          onComplete: () => {
            // 打字完成后，确保文本正确显示
            if (titleRef.current) {
              titleRef.current.textContent = fullText;
            }
          },
        });
      }
      
      // 每个段落依次出现
      descRefs.current.forEach((descRef, index) => {
        if (descRef) {
          gsap.from(descRef, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.2 + index * 0.2,
            ease: 'power3.out',
          });
        }
      });
      
      if (buttonsRef.current) {
        gsap.from(buttonsRef.current, {
          opacity: 0,
          y: 30,
          duration: 1,
          delay: 0.8,
          ease: 'power3.out',
        });
      }
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          delay: 0.3,
          ease: 'back.out(1.7)',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [language, t.hero.greeting, t.hero.title]);

  const openTelegram = () => {
    window.open('https://t.me/iamyorsal', '_blank', 'noopener,noreferrer');
  };

  const downloadCV = (lang = 'zh') => {
    // 下载PDF简历
    const link = document.createElement('a');
    if (lang === 'zh') {
      link.href = '/cv-zh.pdf';
      link.download = 'cv-zh.pdf';
    } else {
      link.href = '/cv-en.pdf';
      link.download = 'cv-en.pdf';
    }
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDropdownOpen(false);
  };

  return (
    <section
      ref={heroRef}
      className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center py-20"
      id="hero"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 w-full max-w-6xl pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 text-left">
          <h1
            ref={titleRef}
            className="text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl text-black dark:text-white"
          >
            {/* 文本将通过 GSAP 动画填充 */}
          </h1>
          <div className="max-w-xl flex flex-col gap-4">
            {Array.isArray(t.hero.description) ? (
              t.hero.description.map((paragraph, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) descRefs.current[index] = el;
                  }}
                  className="flex items-start gap-3"
                >
                  <CheckSquare className="w-5 h-5 text-primary dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-base font-normal leading-relaxed sm:text-lg text-gray-700 dark:text-gray-300 flex-1">
                    {paragraph}
                  </p>
                </div>
              ))
            ) : (
              <div
                ref={(el) => {
                  if (el) descRefs.current[0] = el;
                }}
                className="flex items-start gap-3"
              >
                <CheckSquare className="w-5 h-5 text-primary dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-base font-normal leading-relaxed sm:text-lg text-gray-700 dark:text-gray-300 flex-1">
                  {t.hero.description}
                </p>
              </div>
            )}
          </div>
          <div ref={buttonsRef} className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={openTelegram}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-black dark:bg-white text-white dark:text-black text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <span className="truncate">{t.hero.letsTalk}</span>
            </button>
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 text-black dark:text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="truncate">{t.hero.downloadCV}</span>
                <ChevronDown
                  className={`ml-2 w-5 h-5 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => downloadCV('zh')}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>中文版本</span>
                  </button>
                  <button
                    onClick={() => downloadCV('en')}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 border-t border-gray-300 dark:border-gray-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>English Version</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div
            ref={imageRef}
            className="w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden border-8 border-white dark:border-gray-800 shadow-xl"
          >
            <OptimizedImage
              src="/hero-image.webp"
              alt="Yang Le"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

