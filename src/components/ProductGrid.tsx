import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Star, StarHalf } from 'lucide-react';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [page, setPage] = useState(1);

  const loadMoreProducts = () => {
    setLoading(true);
    // Replace with your API call
    setTimeout(() => {
      const newProducts = [
        {
          id: Math.random(),
          title: "Wireless Noise-Cancelling Headphones",
          price: 299.99,
          image: "/api/placeholder/300/300",
          tags: ["electronics", "audio", "premium"],
          description: "High-end wireless headphones with active noise cancellation and 30-hour battery life",
          additionalImages: ["/api/placeholder/300/300", "/api/placeholder/300/300"],
          rating: 4.8,
          reviewCount: 3250,
          amazonUrl: "https://amazon.com/example"
        },
        {
          id: Math.random(),
          title: "Smart Fitness Watch",
          price: 199.99,
          image: "/api/placeholder/300/300",
          tags: ["electronics", "fitness", "wearable"],
          description: "Advanced fitness tracker with heart rate monitoring and GPS",
          additionalImages: ["/api/placeholder/300/300", "/api/placeholder/300/300"],
          rating: 4.6,
          reviewCount: 2840,
          amazonUrl: "https://amazon.com/example"
        },
        {
          id: Math.random(),
          title: "Mechanical Gaming Keyboard",
          price: 129.99,
          image: "/api/placeholder/300/300",
          tags: ["electronics", "gaming", "accessories"],
          description: "RGB mechanical keyboard with custom switches for gaming",
          additionalImages: ["/api/placeholder/300/300"],
          rating: 4.7,
          reviewCount: 1890,
          amazonUrl: "https://amazon.com/example"
        },
        {
          id: Math.random(),
          title: "4K Webcam",
          price: 149.99,
          image: "/api/placeholder/300/300",
          tags: ["electronics", "streaming", "work"],
          description: "Ultra HD webcam perfect for streaming and video conferences",
          additionalImages: ["/api/placeholder/300/300"],
          rating: 4.5,
          reviewCount: 1250,
          amazonUrl: "https://amazon.com/example"
        },
        {
          id: Math.random(),
          title: "Portable Power Bank",
          price: 49.99,
          image: "/api/placeholder/300/300",
          tags: ["electronics", "accessories", "travel"],
          description: "20000mAh power bank with fast charging support",
          additionalImages: ["/api/placeholder/300/300"],
          rating: 4.4,
          reviewCount: 3120,
          amazonUrl: "https://amazon.com/example"
        },
        {
          id: Math.random(),
          title: "Smart Home Security Camera",
          price: 79.99,
          image: "/api/placeholder/300/300",
          tags: ["electronics", "security", "smart-home"],
          description: "1080p wireless security camera with night vision and two-way audio",
          additionalImages: ["/api/placeholder/300/300"],
          rating: 4.3,
          reviewCount: 2150,
          amazonUrl: "https://amazon.com/example"
        },
        {
          id: Math.random(),
          title: "Wireless Gaming Mouse",
          price: 89.99,
          image: "/api/placeholder/300/300",
          tags: ["electronics", "gaming", "accessories"],
          description: "High-precision wireless gaming mouse with programmable buttons",
          additionalImages: ["/api/placeholder/300/300"],
          rating: 4.6,
          reviewCount: 1780,
          amazonUrl: "https://amazon.com/example"
        },
        {
          id: Math.random(),
          title: "Bluetooth Speaker",
          price: 159.99,
          image: "/api/placeholder/300/300",
          tags: ["electronics", "audio", "portable"],
          description: "Waterproof bluetooth speaker with 360-degree sound",
          additionalImages: ["/api/placeholder/300/300"],
          rating: 4.7,
          reviewCount: 2950,
          amazonUrl: "https://amazon.com/example"
        }
      ];
      
      if (page > 3) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        if (hasMore && !loading) {
          loadMoreProducts();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    loadMoreProducts();
  }, []);

  const toggleTag = (tag) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const filteredProducts = products.filter(product => 
    selectedTags.size === 0 || 
    [...selectedTags].every(tag => product.tags.includes(tag))
  );

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from(new Set(products.flatMap(p => p.tags))).map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedTags.has(tag)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map(product => (
          <Card 
            key={product.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedProduct(product)}
          >
            <CardContent className="p-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-blue-600 font-bold mb-2">${product.price}</p>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={product.rating} />
                <span className="text-sm text-gray-600">
                  ({product.reviewCount})
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      )}

      {!hasMore && !loading && (
        <p className="text-center text-gray-500 my-8">
          No more products to load
        </p>
      )}

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.title}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-full rounded-lg"
                  />
                  <div className="flex gap-2">
                    {selectedProduct.additionalImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${selectedProduct.title} view ${i + 2}`}
                        className="w-24 h-24 object-cover rounded cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ${selectedProduct.price}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <StarRating rating={selectedProduct.rating} />
                    <span className="text-sm text-gray-600">
                      ({selectedProduct.reviewCount} reviews)
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {selectedProduct.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <a 
                    href={selectedProduct.amazonUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View on Amazon
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGrid;
