import areaData from "china-area-data/v5/data";

interface AreaOption {
    value: string;
    label: string;
    children?: AreaOption[];
}
export const formatAreaData = (data: { [key: string]: string }): AreaOption[] => {
    if (!data) {
        // 如果 data 为 null 或 undefined，返回一个空数组
        return [];
    }

    return Object.keys(data).map(key => ({
        value: key,
        label: data[key],
        // 这里也增加了对 areaData[key] 的检查
        children: areaData[key] ? formatAreaData(areaData[key]) : undefined,
    }));
};