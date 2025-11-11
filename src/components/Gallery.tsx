import {useState, useRef, useMemo, useEffect} from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useIntersectionAppear } from "@/hooks/useIntersectionAppear";
import { allImages } from "@/config/weddingConfig";
// ✅ Số ảnh hiển thị ban đầu
const INITIAL_VISIBLE = 14;

const Gallery = () => {
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [albumOpen, setAlbumOpen] = useState(false);

    const visibleImages = useMemo(() => allImages.slice(0, 14), [visibleCount]);

    const handleShowMore = () => {
        setAlbumOpen(true);
    };

    return (
        <section id="gallery" className="section-spacing px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                    style={{
                        fontFamily: '"Playfair Display", serif'
                    }}>
                        Thư Viện Ảnh
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Những khoảnh khắc đáng nhớ của chúng tôi
                    </p>
                </div>

                {/* Grid hiển thị ảnh */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {visibleImages.map((image, index) => (
                        <FadeInImageCard
                            key={index}
                            image={image}
                            index={index}
                            onClick={() => setSelectedImage(index)}
                        />
                    ))}
                </div>

                {/* Nút xem thêm */}
                {/*{allImages.length > visibleCount && (*/}
                {/*    <div className="text-center mt-10">*/}
                {/*        <button*/}
                {/*            onClick={handleShowMore}*/}
                {/*            className="px-6 py-3 rounded-full text-white bg-primary hover:bg-primary/90 shadow-romantic transition-all duration-300"*/}
                {/*            style={{*/}
                {/*                fontFamily: '"Playfair Display", serif'*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <ImageIcon className="inline w-5 h-5 mr-2" />*/}
                {/*            Xem Toàn Bộ Album*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>

            {/* Lightbox ảnh đơn */}
            {selectedImage !== null && (
                <Lightbox
                    image={allImages[selectedImage]}
                    onClose={() => setSelectedImage(null)}
                />
            )}

            {/* Album view toàn bộ */}
            {albumOpen && (
                <AlbumModal
                    images={allImages}
                    onClose={() => setAlbumOpen(false)}
                    onSelect={setSelectedImage}
                />
            )}
        </section>
    );
};

/* ----------------------------------------------
   🖼️ FadeInImageCard — lazy + blur-up + animate
---------------------------------------------- */
const FadeInImageCard = ({
                             image,
                             index,
                             onClick,
                         }: {
    image: { src: string; alt: string };
    index: number;
    onClick: () => void;
}) => {
    const { ref, isVisible } = useIntersectionAppear({ threshold: 0.2 });
    const [loaded, setLoaded] = useState(false);
    const everVisibleRef = useRef(false);

    // chỉ đánh dấu đã thấy trong effect để không đổi trong render
    useEffect(() => {
        if (isVisible) {
            everVisibleRef.current = true;
        }
    }, [isVisible]);

    const shown = everVisibleRef.current || isVisible;

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            onClick={onClick}
            className={`
        relative overflow-hidden rounded-2xl shadow-soft group cursor-pointer aspect-square
        transition-opacity duration-500 ease-out
        ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
        >
            {/* skeleton đơn giản, không animate-spin để đỡ giật */}
            {!loaded && (
                <div className="absolute inset-0 bg-muted/40 flex items-center justify-center z-10">
                    <Loader2 className="w-5 h-5 text-muted-foreground" />
                </div>
            )}

            <img
                src={image.src}
                alt={image.alt}
                loading={index < 3 ? "eager" : "lazy"}
                decoding={index < 3 ? "sync" : "async"}
                width={600}
                height={600}
                onLoad={() => setLoaded(true)}
                className={`
          w-full h-full object-cover transition-transform duration-700 group-hover:scale-110
        `}
                style={{
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                }}
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Xem chi tiết
                </p>
            </div>
        </div>
    );
};


/* ----------------------------------------------
   🔍 Lightbox (1 ảnh)
---------------------------------------------- */
const Lightbox = ({
                      image,
                      onClose,
                  }: {
    image: { src: string; alt: string };
    onClose: () => void;
}) => (
    <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
    >
        <button
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
            onClick={onClose}
        >
            <X className="w-8 h-8" />
        </button>
        <img
            src={image.src}
            alt={image.alt}
            className="max-w-full max-h-full object-contain rounded-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                willChange: "opacity, transform",
            }}
        />
    </div>
);

/* ----------------------------------------------
   🧩 AlbumModal — hiển thị toàn bộ ảnh (scrollable)
---------------------------------------------- */
const AlbumModal = ({
                        images,
                        onClose,
                        onSelect,
                    }: {
    images: { src: string; alt: string }[];
    onClose: () => void;
    onSelect: (index: number) => void;
}) => (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 text-white">
            <h3 className="text-2xl font-semibold">Album Ảnh</h3>
            <button onClick={onClose}>
                <X className="w-8 h-8 hover:text-primary transition-colors" />
            </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
                <div
                    key={i}
                    onClick={() => {
                        onSelect(i);
                        onClose();
                    }}
                    className="overflow-hidden rounded-lg cursor-pointer group"
                >
                    <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        style={{
                            transform: "translateZ(0)",
                            backfaceVisibility: "hidden",
                        }}
                    />
                </div>
            ))}
        </div>
    </div>
);

export default Gallery;
