import { ExternalLink, Github, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../data/translations'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import OptimizedImage from './OptimizedImage'

gsap.registerPlugin(ScrollTrigger)

// Lightbox 组件
const Lightbox = ({ images, currentIndex, isOpen, onClose, title }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex)
  const lightboxRef = useRef(null)

  useEffect(() => {
    setActiveIndex(currentIndex)
  }, [currentIndex])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (lightboxRef.current) {
        gsap.from(lightboxRef.current, {
          opacity: 0,
          duration: 0.3,
        })
      }
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const goToPrevious = () => {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, images.length, onClose])

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index) => {
    setActiveIndex(index)
  }

  if (!isOpen || !images || images.length === 0) return null

  return (
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* 图片容器 */}
      <div
        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex items-center justify-center z-10">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute max-w-full max-h-full transition-opacity duration-500 ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <OptimizedImage
                src={image}
                alt={`${title} - Image ${index + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* 导航按钮 */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-200 z-30"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-200 z-30"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* 指示器 */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    goToSlide(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* 图片计数器 */}
            <div className="absolute top-4 left-4 bg-white/10 text-white text-sm px-3 py-1 rounded z-30">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// 图片轮播组件
const ImageCarousel = ({ images, title, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  const goToPrevious = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index, e) => {
    e.stopPropagation()
    setCurrentIndex(index)
  }

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(currentIndex)
    }
  }

  useEffect(() => {
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        opacity: 1,
        duration: 0.3,
      })
    }
  }, [currentIndex])

  if (!images || images.length === 0) return null

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg group cursor-pointer">
      <div className="relative aspect-video overflow-hidden" onClick={handleImageClick}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <OptimizedImage
              src={image}
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* 导航按钮 */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/50 hover:bg-black/70 dark:hover:bg-white/70 text-white dark:text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/50 hover:bg-black/70 dark:hover:bg-white/70 text-white dark:text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 指示器 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToSlide(index, e)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white dark:bg-white'
                    : 'w-2 bg-white/50 dark:bg-white/50 hover:bg-white/70 dark:hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          {/* 图片计数器 */}
          <div className="absolute top-4 right-4 bg-black/50 dark:bg-white/50 text-white dark:text-black text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}

const Projects = () => {
  const { language } = useLanguage()
  const t = translations[language]
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const projectsRef = useRef(null)
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: '',
  })

  const openLightbox = (images, currentIndex, title) => {
    setLightboxState({
      isOpen: true,
      images,
      currentIndex,
      title,
    })
  }

  const closeLightbox = () => {
    setLightboxState({
      isOpen: false,
      images: [],
      currentIndex: 0,
      title: '',
    })
  }

  const projects = [
    {
      title: t.projects.project1.title,
      desc: t.projects.project1.desc,
      tags: ['Next.js 15', 'React 19', 'TypeScript', 'Solidity', 'Hardhat', 'PostgreSQL', 'Prisma'],
      images: [
        '/showcase/weather-moments-1.webp',
        '/showcase/weather-moments-2.webp',
        '/showcase/weather-moments-3.webp',
      ],
      liveDemo: 'https://weather-moments.eu.cc/',
    },
    {
      title: t.projects.project2.title,
      desc: t.projects.project2.desc,
      tags: ['Vite', 'React', 'TypeScript', 'TailwindCSS', 'Chrome Extension'],
      images: [
        '/showcase/ai-chat-nav-1.webp',
        '/showcase/ai-chat-nav-2.webp',
      ],
      github: 'https://github.com/yorsal/chrome-ai-chat-navigator',
    },
    {
      title: t.projects.project3.title,
      desc: t.projects.project3.desc,
      tags: ['React', 'Micro Frontend', 'Qiankun', 'CI/CD'],
      images: [
        '/showcase/edmodo-1.webp',
        '/showcase/edmodo-2.webp',
      ],
    },
    {
      title: t.projects.project4.title,
      desc: t.projects.project4.desc,
      tags: ['Vue.js', 'H5', 'Hybrid App'],
      images: [
        '/showcase/e-1.webp',
        '/showcase/e-2.webp',
      ],
    },
  ]

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
      })

      gsap.from(projectsRef.current?.children || [], {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [language])

  return (
    <section ref={sectionRef} className="py-24 w-full max-w-6xl px-4 sm:px-6 lg:px-8" id="projects">
      <h2
        ref={titleRef}
        className="text-3xl font-bold leading-tight tracking-[-0.015em] pb-8 text-black dark:text-white"
      >
        {t.projects.title}
      </h2>
      <div ref={projectsRef} className="flex flex-col gap-20">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 gap-8 md:grid-cols-2 items-center ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className={`${index % 2 === 1 ? 'md:order-last' : ''}`}>
              <ImageCarousel
                images={project.images}
                title={project.title}
                onImageClick={(currentIndex) =>
                  openLightbox(project.images, currentIndex, project.title)
                }
              />
            </div>
            <div
              className={`flex flex-col gap-4 items-start ${
                index % 2 === 1 ? 'md:order-first' : ''
              }`}
            >
              <h3 className="text-2xl font-bold text-black dark:text-white">{project.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-bold px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2">
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black dark:text-white hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {language === 'zh' ? '在线演示' : 'Live Demo'}
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black dark:text-white hover:underline flex items-center gap-1"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Lightbox
        images={lightboxState.images}
        currentIndex={lightboxState.currentIndex}
        isOpen={lightboxState.isOpen}
        onClose={closeLightbox}
        title={lightboxState.title}
      />
    </section>
  )
}

export default Projects
