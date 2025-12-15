import React from 'react';
import { formatSalesNumber } from '../../utils/globalFunction';

const TransactionsCard = ({
  heading,
  subheading,
  transactions = [],
  additionalServices = [],
  className = '',
  itemClassName = '',
  iconContainerClassName = '',
  amountClassName = '',
  emptyState,
  onItemClick,
}) => {

const renderHeading = () => {
  if (heading || subheading) {
    return (
      <div className="mb-6">
        {heading && <h2 className="text-lg font-semibold text-gray-800">{heading}</h2>}
        {subheading && <p className="text-sm text-gray-500">{subheading}</p>}
      </div>
    );
  }
  return null;
};
  const renderTransactionItem = (transaction, index) => {
    const handleClick = () => {
      if (onItemClick) {
        onItemClick(transaction, index);
      }
    };

    return (
      <div 
        key={index} 
        className={`flex items-center justify-between p-3 hover:border border-[#DDDDDD] rounded-lg hover:bg-[#FF9F431A]/10 transition-colors ${itemClassName}`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          {transaction.icon && (
            <div className={`p-3 bg-gray-100 rounded-lg flex justify-center items-center ${iconContainerClassName}`}>
              {typeof transaction.icon === 'string' ? (
                <img
                  src={transaction.icon}
                  alt={transaction.type || 'Transaction'}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    e.target.src = ''; // Fallback image
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="">{transaction.icon}</div>
              )}
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-800">{transaction.type}</h3>
            {transaction.description && (
              <p className="text-sm text-gray-500">{transaction.description}</p>
            )}
          </div>
        </div>
        <span className={`font-semibold text-gray-800 ${amountClassName}`}>
          {transaction.currency 
            ? formatSalesNumber(transaction.amount)
            : formatSalesNumber(transaction.amount)}
        </span>
      </div>
    );
  };

  const renderEmptyState = () => {
    if (emptyState) {
      return typeof emptyState === 'function' ? emptyState() : emptyState;
    }
    return (
      <div className="text-center py-6 text-gray-500">
        No transactions available
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 w-full ${className}`}>
      {renderHeading()}

      {/* Main Transactions */}
      <div className="space-y-3.5">
        {transactions && transactions.length > 0 
          ? transactions.map(renderTransactionItem)
          : renderEmptyState()}
      </div>

      {/* Additional Services Heading */}
      {additionalServices.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Services</h3>
          <div className="space-y-3.5">
            {additionalServices.map(renderTransactionItem)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsCard;
