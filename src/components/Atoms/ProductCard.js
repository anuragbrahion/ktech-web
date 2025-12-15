import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiMinus } from 'react-icons/fi'


const ProductCard = ({ product, handleAddOrder }) => {
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const calculateTotal = () => {
    if (product.priceOverride) return product.priceOverride
    if (product.pricingStrategy === 'individual') {
      return product.product_ids.reduce(
        (total, item) => total + item.id.price * item.quantity,
        0
      )
    }
    return product.price
  }

  const handleAddToOrder = () => {
    const orderItem = {
      ...product,
      quantity: quantity,
      amount: calculateTotal() * quantity
    }
    
    handleAddOrder(orderItem)
    setIsAdded(true)
  }
  
  const handleIncrementQuantity = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    
    // Update the order with new quantity
    const orderItem = {
      ...product,
      quantity: newQuantity,
      amount: calculateTotal() * newQuantity
    }
    handleAddOrder(orderItem)
  }

  const handleDecrementQuantity = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (quantity <= 1) {
      setIsAdded(false)
      setQuantity(1)
      // Remove from order or set quantity to 0
      const orderItem = {
        ...product,
        quantity: 0,
        amount: 0
      }
      handleAddOrder(orderItem)
      return
    }

    const newQuantity = quantity - 1
    setQuantity(newQuantity)
    
    // Update the order with new quantity
    const orderItem = {
      ...product,
      quantity: newQuantity,
      amount: calculateTotal() * newQuantity
    }
    handleAddOrder(orderItem)
  }

  return (
    <div className='border rounded-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden relative'>
      <div className='relative h-48 bg-gray-100 flex items-center justify-center'>
        <img
          src={product.image || '/no-pictures.png'}
          alt={product.displayName}
          className='w-full h-full object-cover'
          onError={e => {
            e.target.onerror = null
            e.target.src = '/no-pictures.png'
          }}
        />
        {product.isCombo && (
          <span className='absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded'>
            COMBO
          </span>
        )}
      </div>

      <div className='p-4 pb-12'>
        <h3 className='text-lg font-semibold text-gray-800 capitalize mb-1'>
          {product.displayName}
        </h3>

        {product.product_ids?.length > 0 && (
          <div className='mb-3'>
            <h4 className='text-sm font-medium text-gray-700 mb-1'>
              Includes:
            </h4>
            <ul className='space-y-1'>
              {product.product_ids.map(item => (
                <li key={item._id} className='flex justify-between text-sm'>
                  <span className='text-gray-600'>
                    {item.id.name} × {item.quantity}
                    {item.id.pricingDetails?.unitBased?.unitName && (
                      <span className='text-xs text-gray-400 ml-1'>
                        ({item.id.pricingDetails.unitBased.unitName})
                      </span>
                    )}
                  </span>
                  <span className='font-medium'>
                    ₹{item.id.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className='flex justify-between items-center border-t pt-3'>
          <span className='font-medium text-gray-700'>Total:</span>
          <span className='text-lg font-bold text-orange-600'>
            ₹{calculateTotal()}
          </span>
        </div>

        {!isAdded ? (
          <button
            onClick={handleAddToOrder}
            className='w-full absolute bottom-0 left-0 bg-[#FF9F43] hover:bg-orange-500 text-white py-2 font-medium transition-colors duration-300 flex items-center justify-center'
          >
            Add to Order
          </button>
        ) : (
          <div className='w-full absolute bottom-0 left-0 bg-[#FF9F43] text-white py-2 px-4 flex items-center justify-between'>
            <button
              onClick={handleDecrementQuantity}
              className='text-white hover:text-gray-200 transition-colors p-1'
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className='font-medium text-lg'>{quantity}</span>
            <button
              onClick={handleIncrementQuantity}
              className='text-white hover:text-gray-200 transition-colors p-1'
            >
              <FaPlus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
