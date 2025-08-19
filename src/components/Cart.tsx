import React from "react";
import { useCart } from "../context/CartContext";
import { TiDelete } from "react-icons/ti";

const Cart: React.FC = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    // Since your CartContext doesn't have clearCart, we'll remove each item individually
    cart.forEach(item => removeFromCart(item.id));
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 flex-1">
          <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
          <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
        </div>
        <div className="p-6 border-t">
          <button className="w-full bg-primaryColor-500 text-white py-2 rounded hover:bg-primaryColor-600">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full mt-5 flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center  flex-col justify-between p-3 border rounded-lg">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TiDelete className="w-5 ml-70 h-5" />
                </button>
                
                 
              <div className="flex items-center space-x-4 flex-1">
                
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/64";
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
                 
               
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                
                <p className="font-semibold w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                
               
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-xl font-bold">${getCartTotal().toFixed(2)}</span>
        </div>
        
        <button className="w-full bg-primaryColor-500 text-white py-3 rounded-lg hover:bg-primaryColor-600 mb-2">
          Checkout
        </button>
        
        <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;