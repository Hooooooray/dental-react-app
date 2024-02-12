import {Select, SelectProps, Spin} from "antd";
import React, {useMemo, useRef, useState} from "react";
// @ts-ignore
import debounce from 'lodash/debounce';
import {searchPatients} from "../../api/patient";
import {searchEmployees} from "../../api/employee";

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

export function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({fetchOptions, debounceTimeout = 500, ...props}: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            {...props}
            options={options}
        />
    );
}

export const fetchPatientList = async (keyword: string) => {
    console.log(keyword)
    try {
        const response = await searchPatients(keyword)
        if (response.status === 200) {
            const responseData = response.data.data
            console.log(responseData)
            return responseData.map((item: { id: number; name: string }) => {
                return {
                    label: item.name,
                    value: item.id
                };
            });
        }
    } catch (error) {
        console.log(error)
    }
}
export const fetchDoctorList = async (keyword: string) => {
    console.log(keyword)
    try {
        const response = await searchEmployees(keyword)
        if (response.status === 200) {
            const responseData = response.data.data
            console.log(responseData)
            return responseData.map((item: { id: number; name: string }) => {
                return {
                    label: item.name,
                    value: item.id
                };
            });
        }
    } catch (error) {
        console.log(error)
    }
}