import React, {TimeRangePickerProps} from "antd";
import dayjs, {type Dayjs} from "dayjs";

export const rangePresets: TimeRangePickerProps['presets'] = [
    // {label: '今天', value: [dayjs().add(0, 'd'), dayjs()]},
    // {label: '近两天', value: [dayjs().add(-1, 'd'), dayjs()]},
    // {label: '近三天', value: [dayjs().add(-2, 'd'), dayjs()]},
    // {label: '近一周', value: [dayjs().add(-7, 'd'), dayjs()]},
    // {label: '近两周', value: [dayjs().add(-14, 'd'), dayjs()]},
    // {label: '近一个月', value: [dayjs().add(-30, 'd'), dayjs()]},
    {label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')]},
    {label: '近两天', value: [dayjs().subtract(1, 'd').startOf('day'), dayjs().endOf('day')]},
    {label: '近三天', value: [dayjs().subtract(2, 'd').startOf('day'), dayjs().endOf('day')]},
    {label: '近一周', value: [dayjs().subtract(6, 'd').startOf('day'), dayjs().endOf('day')]},
    {label: '近两周', value: [dayjs().subtract(13, 'd').startOf('day'), dayjs().endOf('day')]},
    {label: '近一个月', value: [dayjs().subtract(29, 'd').startOf('day'), dayjs().endOf('day')]},
];

export const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
        console.log('Clear');
    }
};