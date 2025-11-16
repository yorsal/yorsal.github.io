import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const appRef = useRef(null);

  useEffect(() => {
    // 全局滚动动画设置
    const ctx = gsap.context(() => {
      // 创建背景渐变动画
      const gradient1 = document.querySelector('.gradient-1');
      const gradient2 = document.querySelector('.gradient-2');

      if (gradient1) {
        gsap.to(gradient1, {
          x: '50%',
          y: '-50%',
          scrollTrigger: {
            trigger: appRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });
      }

      if (gradient2) {
        gsap.to(gradient2, {
          x: '-50%',
          y: '50%',
          scrollTrigger: {
            trigger: appRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });
      }
    }, appRef);

    return () => ctx.revert();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div ref={appRef} className="flex flex-col relative overflow-hidden min-h-screen">
          {/* 背景渐变 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-tr from-cyan-300 to-blue-500 rounded-full blur-3xl opacity-30 dark:opacity-20 -z-10 -translate-y-1/2 translate-x-1/4 gradient-1"></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-br from-pink-300 to-purple-500 rounded-full blur-3xl opacity-20 dark:opacity-10 -z-10 -translate-x-1/2 gradient-2"></div>

          <Header />
          <main className="flex flex-col items-center">
            <Hero />
            <Services />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
