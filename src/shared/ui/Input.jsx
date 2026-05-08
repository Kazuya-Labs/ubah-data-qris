import React from 'react'
import merge from '../lib/merge';

function Input({className, ...props}) {
  return (
    <input
      className={merge("w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", className)}
      {...props}
    />
  )
}

export default Input