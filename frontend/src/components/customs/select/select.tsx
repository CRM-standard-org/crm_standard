import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export interface OptionType {
    value: string;
    label: string;
}

interface MasterSelectComponentProps {
    onChange: (selectedOption: OptionType | null) => void;
    valueKey: string;
    labelKey: string;
    placeholder?: string;
    className?: string;
    value?: OptionType | null;
    fetchDataFromGetAPI: () => Promise<{ responseObject: any[] }>;
    showOptionsList?: boolean;
}

const MasterSelectComponent: React.FC<MasterSelectComponentProps> = ({
    onChange,
    valueKey,
    labelKey,
    placeholder = 'กรุณาเลือก...', 
    className = ' mb-3 w-full', 
    value,
    fetchDataFromGetAPI,
}) => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchDataFromGetAPI();
                const options = response.responseObject?.map((item: any) => ({
                    value: item[valueKey],
                    label: item[labelKey],
                }));
                setOptions(options);
            } catch (error) {
                setError((error as Error)?.message || 'An error occurred while fetching options.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [valueKey, labelKey, fetchDataFromGetAPI]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="master-select-container">
            <Select
                className={`basic-single text-left ${className}`}
                classNamePrefix="select"
                isClearable
                isLoading={isLoading}
                options={options}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                filterOption={(option, inputValue) =>
                    option?.label?.toLowerCase().includes(inputValue.toLowerCase())
                }
            />
        </div>
    );
};

export default MasterSelectComponent;