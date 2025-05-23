import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaSave } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage = () => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('automobileProducts');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse from localStorage:', error);
      return [];
    }
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('automobileProducts', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      toast.error('Please fill all fields');
      return;
    }

    const product = {
      id: Date.now().toString(),
      ...newProduct
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', description: '', price: '' });
    toast.success('Product added');
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price
    });
  };

  const handleUpdate = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      toast.error('Please fill all fields');
      return;
    }

    const updated = products.map((product) =>
      product.id === editId ? { ...product, ...newProduct } : product
    );

    setProducts(updated);
    setIsEditing(false);
    setEditId(null);
    setNewProduct({ name: '', description: '', price: '' });
    toast.success('Product updated');
  };

  const handleDelete = (id) => {
    const updated = products.filter((product) => product.id !== id);
    setProducts(updated);
    toast.success('Product deleted');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Automobile Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={isEditing ? handleUpdate : handleAdd}
        className={`flex items-center gap-2 px-4 py-2 rounded text-white ${isEditing ? 'bg-green-600' : 'bg-blue-600'} hover:opacity-90`}
      >
        {isEditing ? <FaSave /> : <FaPlus />}
        {isEditing ? 'Update Product' : 'Add Product'}
      </button>

      <ul className="mt-6 divide-y">
        {products.length === 0 && <p className="text-gray-500">No products found.</p>}
        {products.map((product) => (
          <li key={product.id} className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm font-medium text-blue-600">₹{product.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="text-green-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 hover:underline"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ProductsPage;
