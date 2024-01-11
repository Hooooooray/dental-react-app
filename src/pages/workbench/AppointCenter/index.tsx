import React from "react";
import {Tabs} from "antd";
import type {TabsProps} from 'antd';
import appointmentView from "./appointTabs/appointmentView";
import appointmentSearch from "./appointTabs/appointmentSearch";
import doctorShift from "./appointTabs/doctorShift";
import shiftSetting from "./appointTabs/shiftSetting";

const items: TabsProps['items'] = [
    {
        key: '1',
        label: '预约视图',
        children: appointmentView,
    },
    {
        key: '2',
        label: '预约查询',
        children: appointmentSearch,
    },{
        key: '3',
        label: '医生班次',
        children: doctorShift,
    },
    {
        key: '4',
        label: '班次设置',
        children: shiftSetting,
    },
];

const AppointCenter = ()=>{
    const onChange = (key: string) => {
        console.log(key);
    };
    return(
        <Tabs type='card' defaultActiveKey="1" items={items} onChange={onChange}/>
    )
}

export default AppointCenter