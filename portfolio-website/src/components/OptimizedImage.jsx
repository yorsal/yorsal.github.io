import { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageLoaded(true);
    };

    img.onerror = () => {
      setImageError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // 生成模糊占位图（使用原图的小版本或创建模糊效果）
  const getPlaceholderSrc = () => {
    if (placeholder) return placeholder;
    // 如果没有提供占位图，使用原图（浏览器会自动处理）
    return src;
  };

  return (
    <div className="relative w-full h-full" style={{ position: 'relative' }}>
      {/* 模糊占位图 - 始终显示在背景，直到图片加载完成 */}
      {!imageError && (
        <img
          ref={placeholderRef}
          src={getPlaceholderSrc()}
          alt=""
          className={`${className} filter blur-md scale-110`}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%',
            opacity: imageLoaded ? 0 : 1,
            transition: 'opacity 0.3s ease-out',
            pointerEvents: 'none',
            zIndex: 1
          }}
          aria-hidden="true"
        />
      )}
      
      {/* 实际图片 */}
      {imageError ? (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center" style={{ position: 'relative', minHeight: '200px' }}>
          <span className="text-gray-400 text-sm">图片加载失败</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ 
            position: 'relative',
            width: '100%',
            height: '100%',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
            zIndex: 2
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;

