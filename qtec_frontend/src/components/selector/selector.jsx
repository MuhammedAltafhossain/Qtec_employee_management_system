import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

const SelectContext = createContext({
    isOpen: false,
    onSelect: () => { },
    onToggle: () => { },
});

const useSelect = (options, value, onChange) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedOption = options.find((option) => option.value === selectedValue);

    const handleSelect = (value) => {
        setSelectedValue(value);
        if (onChange) onChange(value);
        setIsOpen(false);
        setSearchQuery(''); // Clear search when an option is selected
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchQuery(''); // Clear search when dropdown is closed
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return {
        isOpen,
        selectedValue,
        selectedOption,
        containerRef,
        handleSelect,
        toggleDropdown,
        searchQuery,
        setSearchQuery,
        filteredOptions,
    };
};

export const Select = ({
    className,
    label,
    error,
    options,
    value,
    onChange,
    size = 'md',
    ...props
}) => {
    const {
        isOpen,
        selectedValue,
        selectedOption,
        containerRef,
        handleSelect,
        toggleDropdown,
        searchQuery,
        setSearchQuery,
        filteredOptions,
    } = useSelect(options, value, onChange);

    const sizes = {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
    };

    return (
        <SelectContext.Provider
            value={{
                isOpen,
                selectedValue,
                onSelect: handleSelect,
                onToggle: toggleDropdown,
            }}
        >
            <div className='w-full' ref={containerRef} {...props}>
                {label && (
                    <label className='mb-2 block text-sm font-medium text-foreground text-white'>
                        {label}
                    </label>
                )}
                <div className='relative'>
                    <button
                        type='button'
                        onClick={toggleDropdown}
                        className={clsx(
                            'flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-foreground hover:bg-muted/50 focus:border-primary focus:ring-primary',
                            sizes[size],
                            className
                        )}
                    >
                        <span>{selectedOption?.text || 'Select an option'}</span>
                        <svg
                            className={clsx('h-4 w-4 transition-transform', {
                                'rotate-180': isOpen,
                            })}
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 9l-7 7-7-7'
                            />
                        </svg>
                    </button>
                    {isOpen && (
                        <div className='absolute z-10 mt-1 w-full rounded-lg border border-input bg-white p-1 shadow-lg text-black'>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full px-3 py-2 text-sm border rounded-lg mb-2 bg-slate-200"
                            />
                            <div
                                className="max-h-48 overflow-y-auto"
                                style={{
                                    scrollbarWidth: 'thin', // For modern browsers
                                    scrollbarColor: 'gray lightgray',
                                }}
                            >
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option) => (
                                        <SelectOption
                                            key={option.value}
                                            text={option.text}
                                            value={option.value}
                                        />
                                    ))
                                ) : (
                                    <div className='px-4 py-2 text-sm text-muted-foreground'>
                                        No options found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {error && <p className='mt-2 text-sm text-destructive text-red-500'>{error}</p>}
            </div>
        </SelectContext.Provider>
    );
};


const SelectOption = ({ text, value }) => {
    const { selectedValue, onSelect } = useContext(SelectContext);
    const isSelected = selectedValue === value;

    return (
        <div
            className={clsx(
                'cursor-pointer px-3 py-2 text-sm transition-colors rounded-lg hover:bg-black/5',
                {
                    'text-primary font-medium': isSelected,
                }
            )}
            onClick={() => onSelect(value)}
        >
            {text}
        </div>
    );
};

Select.displayName = 'Select';
