import { useState } from "react";
import { X } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import { useIntersectionAppear } from "@/hooks/useIntersectionAppear";

const galleryImages = [
  { src: gallery1, alt: "Wedding bouquet" },
  { src: gallery2, alt: "Wedding rings" },
  { src: gallery3, alt: "Reception table" },
  { src: gallery4, alt: "Wedding cake" },
  { src: gallery1, alt: "Ceremony details" },
  { src: gallery2, alt: "Floral arrangement" },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="gallery" className="section-spacing px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Thư Viện Ảnh
          </h2>
          <p className="text-muted-foreground text-lg">
            Những khoảnh khắc đáng nhớ của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => {
            const ImageCard = () => {
              const { ref, isVisible } = useIntersectionAppear({ threshold: 0.2 });
              
              return (
                <div
                  ref={ref as React.RefObject<HTMLDivElement>}
                  className={`image-wrap relative overflow-hidden rounded-2xl shadow-soft hover:shadow-romantic cursor-pointer group aspect-square transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    willChange: 'opacity, transform'
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ willChange: 'transform' }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Xem chi tiết
                    </p>
                  </div>
                </div>
              );
            };
            
            return <ImageCard key={index} />;
          })}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="image-wrap fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={galleryImages[selectedImage].src}
            alt={galleryImages[selectedImage].alt}
            className="max-w-full max-h-full object-contain rounded-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;
