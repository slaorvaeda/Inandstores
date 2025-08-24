import React from 'react';
import { MdClose, MdBusiness, MdPhone, MdEmail, MdLocationOn, MdPerson } from 'react-icons/md';

const DetailsPanel = ({ 
  isOpen, 
  onClose, 
  data, 
  type = 'vendor', // 'vendor' or 'client'
  title = 'Details'
}) => {
  if (!isOpen || !data) return null;

  const isVendor = type === 'vendor';
  const isClient = type === 'client';

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className={`bg-gradient-to-r px-6 py-4 ${
        isVendor ? 'from-blue-600 to-blue-700' : 'from-green-600 to-green-700'
      }`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            {isVendor ? 'Vendor Details' : 'Client Details'}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Name and Company */}
        <div className="flex items-center space-x-3">
          <MdBusiness className={`w-5 h-5 ${isVendor ? 'text-blue-600' : 'text-green-600'}`} />
          <div>
            <h4 className="font-semibold text-gray-900">{data.name}</h4>
            {data.company && (
              <p className="text-sm text-gray-600">{data.company}</p>
            )}
          </div>
        </div>
        
        {/* Contact Person */}
        {data.contactPerson && (
          <div className="flex items-center space-x-3">
            <MdPerson className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Contact Person</p>
              <p className="text-sm text-gray-600">{data.contactPerson}</p>
            </div>
          </div>
        )}
        
        {/* Email */}
        {(data.email || (data.contact && data.contact.email)) && (
          <div className="flex items-center space-x-3">
            <MdEmail className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">{data.email || data.contact?.email}</p>
            </div>
          </div>
        )}
        
        {/* Phone */}
        {(data.phone || (data.contact && data.contact.phone)) && (
          <div className="flex items-center space-x-3">
            <MdPhone className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Phone</p>
              <p className="text-sm text-gray-600">{data.phone || data.contact?.phone}</p>
            </div>
          </div>
        )}
        
        {/* Mobile */}
        {(data.mobile || (data.contact && data.contact.mobile)) && (
          <div className="flex items-center space-x-3">
            <MdPhone className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Mobile</p>
              <p className="text-sm text-gray-600">{data.mobile || data.contact?.mobile}</p>
            </div>
          </div>
        )}
        
        {/* Address */}
        {(data.address || data.billingAddress) && (
          <div className="flex items-start space-x-3">
            <MdLocationOn className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">Address</p>
              <p className="text-sm text-gray-600">
                {(() => {
                  const addr = data.address || data.billingAddress;
                  if (addr) {
                    const parts = [
                      addr.street,
                      addr.city,
                      addr.state,
                      addr.pincode
                    ].filter(Boolean);
                    return parts.length > 0 ? parts.join(', ') : 'No address available';
                  }
                  return 'No address available';
                })()}
              </p>
            </div>
          </div>
        )}
        
        {/* GST Number */}
        {data.gstNumber && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900">GST Number</p>
            <p className="text-sm text-gray-600">{data.gstNumber}</p>
          </div>
        )}
        
        {/* PAN Number */}
        {data.panNumber && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900">PAN Number</p>
            <p className="text-sm text-gray-600">{data.panNumber}</p>
          </div>
        )}
        
        {/* Additional fields for clients */}
        {isClient && (data.website || (data.contact && data.contact.website)) && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Website</p>
            <p className="text-sm text-gray-600">{data.website || data.contact?.website}</p>
          </div>
        )}
        
        {/* Additional fields for vendors */}
        {isVendor && data.designation && (
          <div className="flex items-center space-x-3">
            <MdPerson className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Designation</p>
              <p className="text-sm text-gray-600">{data.designation}</p>
            </div>
          </div>
        )}
        
        {/* Status */}
        {data.status && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Status</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              data.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;
