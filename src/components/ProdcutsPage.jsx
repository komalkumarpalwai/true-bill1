import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaSave, FaEdit, FaRupeeSign } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage = () => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('automobileProducts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem('automobileProducts', JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewProduct(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.image) {
      toast.error('Please fill all fields including image');
      return;
    }
    setProducts(prev => [...prev, { id: Date.now().toString(), ...newProduct }]);
    setNewProduct({ name: '', description: '', price: '', image: '' });
    toast.success('Product added successfully');
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.image) {
      toast.error('Please fill all fields including image');
      return;
    }
    setProducts(products.map(p => (p.id === editId ? { ...p, ...newProduct } : p)));
    setIsEditing(false);
    setEditId(null);
    setNewProduct({ name: '', description: '', price: '', image: '' });
    toast.success('Product updated successfully');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 py-10 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header with subtle gradient */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-4 tracking-tight">
            Automobile Products
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {products.length > 0 
              ? `Manage your ${products.length} premium automobile products`
              : 'Add your first premium automobile product'}
          </p>
        </header>

        {/* Form Section with glass morphism effect */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-5xl mx-auto mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={isEditing ? handleUpdate : handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:opacity-90"
            >
              {isEditing ? (
                <>
                  <FaSave /> Update Product
                </>
              ) : (
                <>
                  <FaPlus /> Add Product
                </>
              )}
            </button>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              isEditing ? handleUpdate() : handleAdd();
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {['name', 'description', 'price'].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field === 'price' ? 'number' : 'text'}
                  name={field}
                  id={`input-${field}`}
                  value={newProduct[field]}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="
                    peer
                    w-full
                    border-2 border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-gray-800
                    text-base
                    rounded-lg
                    placeholder-transparent
                    focus:outline-none
                    focus:border-indigo-500
                    focus:ring-1
                    focus:ring-indigo-200
                    transition
                    shadow-sm
                  "
                />
                <label
                  htmlFor={`input-${field}`}
                  className="
                    absolute
                    left-3
                    -top-2.5
                    px-1
                    bg-white
                    text-gray-500
                    text-xs
                    font-medium
                    transition-all
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:top-3
                    peer-placeholder-shown:bg-transparent
                    peer-placeholder-shown:left-4
                    peer-focus:-top-2.5
                    peer-focus:text-gray-600
                    peer-focus:text-xs
                    peer-focus:bg-white
                    peer-focus:px-1
                    peer-focus:left-3
                    select-none
                    pointer-events-none
                  "
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}{field === 'price' ? ' (₹)' : ''}
                </label>
              </div>
            ))}

            <div className="relative">
              <label
                htmlFor="image-upload"
                className={`
                  flex flex-col items-center justify-center
                  cursor-pointer
                  rounded-lg
                  border-2 ${newProduct.image ? 'border-indigo-200' : 'border-dashed border-gray-300'}
                  bg-white
                  h-full
                  p-4
                  text-gray-400
                  hover:border-indigo-400
                  hover:text-indigo-600
                  transition
                  select-none
                  relative
                  overflow-hidden
                  shadow-sm
                  ${newProduct.image ? 'aspect-square' : ''}
                `}
                title="Upload product image"
              >
                {newProduct.image ? (
                  <>
                    <img
                      src={newProduct.image}
                      alt="Product Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-white font-medium">Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Upload Image</span>
                  </>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!newProduct.image}
                />
              </label>
            </div>
          </form>
        </section>

        {/* Products Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Products
            </h2>
            <div className="text-sm text-gray-500">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500 mb-2">No products found</h3>
              <p className="text-gray-400 max-w-md mx-auto">Add your first product using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <article
                  key={product.id}
                  className="
                    bg-white
                    rounded-xl
                    shadow-md
                    border border-gray-100
                    overflow-hidden
                    transform transition-all duration-300
                    hover:shadow-xl
                    hover:-translate-y-1
                    flex flex-col
                    group
                  "
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white font-medium truncate">{product.name}</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3
                      title={product.name}
                      className="text-lg font-semibold text-gray-800 mb-2 truncate"
                    >
                      {product.name}
                    </h3>
                    <p
                      title={product.description}
                      className="text-gray-600 text-sm flex-grow mb-4 line-clamp-3"
                    >
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center text-indigo-600 font-bold">
                        <FaRupeeSign className="mr-1" size={12} />
                        <span>{product.price}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="
                            text-gray-500 hover:text-indigo-600
                            transition
                            p-2 rounded-lg
                            hover:bg-indigo-50
                          "
                          aria-label={`Edit ${product.name}`}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="
                            text-gray-500 hover:text-red-600
                            transition
                            p-2 rounded-lg
                            hover:bg-red-50
                          "
                          aria-label={`Delete ${product.name}`}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <ToastContainer 
        position="top-right" 
        autoClose={2500} 
        theme="colored" 
        toastClassName="rounded-lg shadow-md"
        progressClassName="bg-white/30"
      />
    </main>
  );
};

export default ProductsPage;