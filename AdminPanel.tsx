import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminPanel = () => {
  // Basic state
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    tags: [],
    additionalImages: [],
    amazonUrl: ''
  });

  useEffect(() => {
    // Load products (replace with your API call)
    setProducts([
      {
        id: 1,
        title: "Wireless Earbuds",
        price: 49.99,
        image: "/api/placeholder/300/300",
        tags: ["electronics", "audio", "wireless"],
        description: "High-quality wireless earbuds with noise cancellation",
        additionalImages: ["/api/placeholder/300/300", "/api/placeholder/300/300"],
        amazonUrl: "https://amazon.com/example"
      }
    ]);
  }, []);

  const fetchAmazonProductDetails = async (url) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/amazon-product?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch product details');
      }

      const productData = await response.json();
      console.log('Received product data:', productData);

      setFormData(prev => ({
        ...prev,
        title: productData.title,
        price: productData.price,
        description: productData.description,
        image: productData.image,
        additionalImages: productData.additionalImages || [],
        tags: productData.tags
      }));

    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmazonUrlChange = async (e) => {
    const url = e.target.value;
    console.log('URL changed:', url);
    
    setFormData(prev => ({ ...prev, amazonUrl: url }));
    
    if (url.includes('amazon.com') && 
        (url.includes('/dp/') || url.includes('/product/') || url.includes('/gp/product/'))) {
      console.log('Valid Amazon URL detected, fetching details...');
      await fetchAmazonProductDetails(url);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
    
    try {
      if (editingProduct) {
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id ? { ...formData, id: p.id } : p
        );
        setProducts(updatedProducts);
        console.log('Product updated:', updatedProducts);
      } else {
        const newProduct = {
          ...formData,
          id: Date.now(),
        };
        setProducts(prev => {
          const newProducts = [...prev, newProduct];
          console.log('Products after addition:', newProducts);
          return newProducts;
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      image: '',
      tags: [],
      additionalImages: [],
      amazonUrl: ''
    });
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Management</CardTitle>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tags</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3">{product.title}</td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="p-2"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amazon URL</label>
              <div className="flex gap-2">
                <Input
                  name="amazonUrl"
                  value={formData.amazonUrl}
                  onChange={handleAmazonUrlChange}
                  placeholder="Paste Amazon product URL"
                  className="flex-1"
                />
                {isLoading && (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin w-4 h-4" />
                  </div>
                )}
              </div>
              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Main Image URL</label>
              <Input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {formData.image && (
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="mt-2 w-32 h-32 object-cover rounded border"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  disabled={isLoading}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  disabled={isLoading}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Additional Images</label>
              {formData.additionalImages.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const newImages = [...formData.additionalImages];
                      newImages[index] = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        additionalImages: newImages
                      }));
                    }}
                    placeholder="Image URL"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newImages = formData.additionalImages.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        additionalImages: newImages
                      }));
                    }}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    additionalImages: [...prev.additionalImages, '']
                  }));
                }}
                disabled={isLoading}
              >
                Add Image
              </Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseDialog}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {editingProduct ? 'Update' : 'Create'} Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
