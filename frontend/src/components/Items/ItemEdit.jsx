import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ItemEdit() {
  const { id } = useParams(); 
  console.log('Invoice ID:', id);              // ID of the item to update
  const navigate = useNavigate();          // for navigation after update

  // Form state with nested structure
  const [item, setItem] = useState({
    name: '',
    sku: '',
    unit: '',
    hsnCode: '',
    taxPreference: 'Taxable',
    images: [],           // array of image URLs
    salesInfo: {
      sellingPrice: '',
      account: '',
      description: '',
      intraTaxRate: 'GST18',
      interTaxRate: 'IGST18',
    },
    purchaseInfo: {
      costPrice: '',
      account: '',
      description: '',
      preferredVendor: '',
    },
  });
  // State for new files and their previews
  const [newFiles, setNewFiles] = useState([]);         // File objects
  const [newPreviews, setNewPreviews] = useState([]);   // preview URLs
  const [error, setError] = useState('');               // error message

  // Fetch existing item data on component mount
  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await axios.get(`http://localhost:4000/api/items/${id}`);
        const data = res.data;
        // Populate form state with fetched data
        setItem({
          name: data.name || '',
          sku: data.sku || '',
          unit: data.unit || '',
          hsnCode: data.hsnCode || '',
          taxPreference: data.taxPreference || 'Taxable',
          images: data.images || [],
          salesInfo: {
            sellingPrice: data.salesInfo?.sellingPrice || '',
            account: data.salesInfo?.account || '',
            description: data.salesInfo?.description || '',
            intraTaxRate: data.salesInfo?.intraTaxRate || 'GST18',
            interTaxRate: data.salesInfo?.interTaxRate || 'IGST18',
          },
          purchaseInfo: {
            costPrice: data.purchaseInfo?.costPrice || '',
            account: data.purchaseInfo?.account || '',
            description: data.purchaseInfo?.description || '',
            preferredVendor: data.purchaseInfo?.preferredVendor || '',
          },
        });
        // console.log('Fetched item data:', item);
      } 
      catch (err) {
        // console.error("it is ", {id});
        console.error(err);
        setError('Failed to load item data.');
      }
    }
    fetchItem();
  }, [id]);

  // Unified change handler for input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => {
      // Create a shallow copy of previous state
      const updated = { ...prev };
      if (name.includes('.')) {
        // Handle nested fields like "salesInfo.sellingPrice"
        const [parentKey, childKey] = name.split('.');
        updated[parentKey] = { ...updated[parentKey], [childKey]: value };
      } else {
        // Top-level fields
        updated[name] = value;
      }
      return updated;
    });
  };

  // Handle new image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Create preview URLs for new images
    const previews = files.map(file => URL.createObjectURL(file));
    setNewFiles(files);
    setNewPreviews(previews);
    // We do not revoke URLs here; React will manage them on unmount/cleanup
  };

  // Remove an existing image from the list
  const handleRemoveExisting = (index) => {
    setItem(prev => {
      const updated = { ...prev };
      updated.images = updated.images.filter((_, i) => i !== index);
      return updated;
    });
  };

  // Remove a newly added image preview
  const handleRemoveNew = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let imageUrls = [...item.images]; // start with existing images
      // If there are new files, upload them
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach(file => formData.append('files', file));
        const uploadRes = await axios.post('http://localhost:4000/api/upload-multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        // Assume response contains { imageUrls: [...] }
        imageUrls = imageUrls.concat(uploadRes.data.imageUrls || []);
      }
      // Prepare updated payload
      const updatedData = {
        ...item,
        images: imageUrls,
      };
      // Send PUT request to update item
      await axios.put(`http://localhost:4000/api/items/${id}`, updatedData);
      // Navigate back to items list on success
      navigate('/dashboard/item/list');
    } catch (err) {
      console.error(err);
      setError('Failed to update item.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Item</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name, SKU, Unit */}
        <div>
          <label className="block text-gray-700">Name</label>
          <input 
            type="text"
            name="name" value={item.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">SKU</label>
          <input 
            type="text"
            name="sku" value={item.sku}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div>
          <label className="block text-gray-700">Unit</label>
          <input 
            type="text"
            name="unit" value={item.unit}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div>
          <label className="block text-gray-700">HSN Code</label>
          <input 
            type="text"
            name="hsnCode" value={item.hsnCode}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        {/* Tax Preference */}
        <div>
          <label className="block text-gray-700">Tax Preference</label>
          <select
            name="taxPreference" value={item.taxPreference}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          >
            <option>Taxable</option>
            <option>Non-taxable</option>
          </select>
        </div>

        {/* Images: existing and new previews */}
        <div>
          <label className="block text-gray-700">Images</label>
          <div className="flex flex-wrap gap-4 mb-2">
            {/* Existing images */}
            {item.images.map((url, idx) => (
              <div key={idx} className="relative">
                <img 
                  src={url} 
                  alt={`Item ${idx}`} 
                  className="w-24 h-24 object-cover border rounded"
                  onError={e => e.currentTarget.src = 'https://via.placeholder.com/150'}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >×</button>
              </div>
            ))}
            {/* New image previews */}
            {newPreviews.map((url, idx) => (
              <div key={idx} className="relative">
                <img 
                  src={url} 
                  alt={`New upload ${idx}`} 
                  className="w-24 h-24 object-cover border rounded"
                  onError={e => e.currentTarget.src = 'https://via.placeholder.com/150'}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNew(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >×</button>
              </div>
            ))}
          </div>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded w-full p-2"
          />
        </div>

        {/* Sales Info */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold">Sales Info</h2>
          <div>
            <label className="block text-gray-700">Selling Price</label>
            <input
              type="text"
              name="salesInfo.sellingPrice"
              value={item.salesInfo.sellingPrice}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700">Account</label>
            <input
              type="text"
              name="salesInfo.account"
              value={item.salesInfo.account}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="salesInfo.description"
              value={item.salesInfo.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700">Intra Tax Rate</label>
            <select
              name="salesInfo.intraTaxRate"
              value={item.salesInfo.intraTaxRate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            >
              <option>GST18</option>
              <option>GST12</option>
              <option>GST5</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Inter Tax Rate</label>
            <select
              name="salesInfo.interTaxRate"
              value={item.salesInfo.interTaxRate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            >
              <option>IGST18</option>
              <option>IGST12</option>
              <option>IGST5</option>
            </select>
          </div>
        </div>

        {/* Purchase Info */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold">Purchase Info</h2>
          <div>
            <label className="block text-gray-700">Cost Price</label>
            <input
              type="text"
              name="purchaseInfo.costPrice"
              value={item.purchaseInfo.costPrice}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700">Account</label>
            <input
              type="text"
              name="purchaseInfo.account"
              value={item.purchaseInfo.account}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="purchaseInfo.description"
              value={item.purchaseInfo.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700">Preferred Vendor</label>
            <input
              type="text"
              name="purchaseInfo.preferredVendor"
              value={item.purchaseInfo.preferredVendor}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItemEdit;
