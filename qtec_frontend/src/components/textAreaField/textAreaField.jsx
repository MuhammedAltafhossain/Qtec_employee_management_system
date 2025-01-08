import React from 'react';

const TextAreaField = ({ label, span, value, onChange, placeholder, required }) => (
    <div className="form-control mb-1">
        <label className="gap-2">
            <span className='text-black dark:text-white'>{label}</span>
            {span && <span className="label-text text-red-600">{span}</span>}
        </label>


        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="input mt-2 input-bordered bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300"
            required = {required}
        />
    </div>
);

export default TextAreaField;
