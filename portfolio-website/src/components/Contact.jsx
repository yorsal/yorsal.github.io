import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from(formRef.current, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // EmailJS 配置
      // 需要在 EmailJS (https://www.emailjs.com/) 注册并获取以下信息：
      // 1. 创建 Email Service (Gmail, Outlook 等)
      // 2. 创建 Email Template
      // 3. 获取 Public Key, Service ID 和 Template ID
      
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

      // 发送邮件
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'yorsal@gmail.com',
        },
        publicKey
      );

      setSubmitStatus({
        type: 'success',
        message: language === 'zh' 
          ? '消息发送成功！我会尽快回复您。' 
          : 'Message sent successfully! I will get back to you soon.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Email sending failed:', error);
      setSubmitStatus({
        type: 'error',
        message: language === 'zh'
          ? '发送失败，请稍后重试或直接发送邮件至 yorsal@gmail.com'
          : 'Failed to send. Please try again later or email directly to yorsal@gmail.com',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 text-center w-full max-w-6xl px-4 sm:px-6 lg:px-8"
      id="contact"
    >
      <h2
        ref={titleRef}
        className="text-3xl font-bold leading-tight tracking-[-0.015em] text-black dark:text-white"
      >
        {t.contact.title}
      </h2>
      <p className="mt-4 max-w-xl mx-auto text-gray-700 dark:text-gray-300">
        {t.contact.description}
      </p>
      <div className="mt-8 max-w-xl mx-auto">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-left"
        >
          <div>
            <label className="sr-only" htmlFor="name">
              {t.contact.form.name}
            </label>
            <input
              className="w-full rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white px-4 py-3"
              id="name"
              name="name"
              placeholder={t.contact.form.name}
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="email">
              {t.contact.form.email}
            </label>
            <input
              className="w-full rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white px-4 py-3"
              id="email"
              name="email"
              placeholder={t.contact.form.email}
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="message">
              {t.contact.form.message}
            </label>
            <textarea
              className="w-full rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white px-4 py-3"
              id="message"
              name="message"
              placeholder={t.contact.form.message}
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg ${
                submitStatus.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-black dark:bg-white text-white dark:text-black text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">
              {isSubmitting
                ? language === 'zh'
                  ? '发送中...'
                  : 'Sending...'
                : t.contact.form.send}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;

