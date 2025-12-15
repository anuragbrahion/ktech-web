import React from 'react'

const NotFound = ({
  heading = '',
  description = '',
  buttonLabel = '',
  buttonOnClick,
  containerClassName = ''
}) => {
  return (
    <div
      className={`flex items-center justify-center text-[#1D1F2CCC] ${containerClassName}`}
    >
      <div className='flex flex-col items-center justify-center text-center space-y-4 px-4'>
        <div className=''>
          <img
            src='/icons/notFound.png'
            alt='Not Found'
            className='md:w-[200px] md:h-[200px] w-[100px] h-[100px]'
          />
        </div>

        <div className='space-y-4'>
          {heading && (
            <h1 className='lg:text-4xl text-xl font-bold'>{heading}</h1>
          )}

          {description && (
            <p className='text-gray-400 max-w-md'>{description}</p>
          )}
        </div>

        {buttonLabel && (
          <div>
            <button
              className='bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-full transition-colors duration-300'
              onClick={buttonOnClick}
            >
              {buttonLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotFound
