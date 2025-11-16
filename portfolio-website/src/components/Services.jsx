import { Code, Smartphone, Puzzle, Monitor, Coins, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  const services = [
    {
      icon: Code,
      title: t.services.fullstack.title,
      desc: t.services.fullstack.desc,
    },
    {
      icon: Smartphone,
      title: t.services.mobile.title,
      desc: t.services.mobile.desc,
    },
    {
      icon: Puzzle,
      title: t.services.extension.title,
      desc: t.services.extension.desc,
    },
    {
      icon: Monitor,
      title: t.services.desktop.title,
      desc: t.services.desktop.desc,
    },
    {
      icon: Coins,
      title: t.services.blockchain.title,
      desc: t.services.blockchain.desc,
    },
    {
      icon: MessageSquare,
      title: t.services.consulting.title,
      desc: t.services.consulting.desc,
    },
  ];

  useEffect(() => {
    // 确保元素初始可见（防止动画未触发时内容不可见）
    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 1, x: 0 });
    }
    const cards = cardsRef.current ? Array.from(cardsRef.current.children) : [];
    cards.forEach((card) => {
      gsap.set(card, { opacity: 1, scale: 1, rotation: 0, x: 0 });
    });

    const ctx = gsap.context(() => {
      // 标题动画：从左侧滑入
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            duration: 0.8,
            ease: 'power3.out',
          }
        );
      }

      // 卡片动画：缩放+旋转+淡入，交错效果
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            scale: 0.8,
            rotation: -10,
            x: index % 2 === 0 ? -100 : 100,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            x: 0,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            duration: 0.6,
            delay: index * 0.15,
            ease: 'back.out(1.7)',
          }
        );
      });

      // 刷新 ScrollTrigger 以确保正确计算
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [language]);

  return (
    <section
      ref={sectionRef}
      className="py-24 w-full max-w-6xl px-4 sm:px-6 lg:px-8"
      id="services"
    >
      <h2
        ref={titleRef}
        className="text-3xl font-bold leading-tight tracking-[-0.015em] pb-8 text-black dark:text-white"
      >
        {t.services.title}
      </h2>
      <div ref={cardsRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="rounded-xl p-6 flex flex-col items-start gap-4 transition-all duration-300 hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg h-full"
            >
              <Icon className="text-black dark:text-white text-4xl flex-shrink-0" />
              <h3 className="text-xl font-bold text-black dark:text-white leading-tight">{service.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-grow">{service.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Services;

