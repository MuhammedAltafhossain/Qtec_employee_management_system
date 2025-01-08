import React from 'react';

const InputField = ({
    label,
    span,
    type,
    value,
    onChange,
    placeholder,
    error,
    disabled,
    required = true, 
}) => (
    <div className="form-control mb-1">
        <label className="gap-2">
            <span className='text-black dark:text-white'>{label}</span>
            {span && <span className="label-text text-red-600">{span}</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`h-10 mt-2 input input-bordered bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300 ${error ? 'border-red-500' : ''}`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

export default InputField;
