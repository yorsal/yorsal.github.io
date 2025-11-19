import { Mail, Linkedin, Facebook, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="w-full bg-black dark:bg-gray-900 py-8 flex justify-center mt-20">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <a
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            href="https://www.linkedin.com/in/le-yang-67a954279"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
            <span className="hidden sm:inline">LINKEDIN</span>
          </a>
          <a
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            href="https://www.facebook.com/yorsal"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
            <span className="hidden sm:inline">FACEBOOK</span>
          </a>
          <a
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            href="https://x.com/yorsal"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
            <span className="hidden sm:inline">TWITTER</span>
          </a>
        </div>
        <div className="text-gray-400 text-sm flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{t.footer.email}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

