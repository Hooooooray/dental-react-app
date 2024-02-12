import React from "react";
import {Tabs} from "antd";
import type {TabsProps} from 'antd';
import doctorShift from "./appointTabs/doctorShift";
import shiftSetting from "./appointTabs/shiftSetting";
import AppointmentView from "./appointTabs/AppointmentView";
import AppointmentSearch from "./appointTabs/AppointmentSearch";

const items: TabsProps['items'] = [
    {
        key: '1',
        label: '预约视图',
        children: <AppointmentView />,
    },
    {
        key: '2',
        label: '预约查询',
        children:<AppointmentSearch />,
    },
    {
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
        <Tabs style={{height:'calc(100vh - 48px)'}} type='card' defaultActiveKey="1" items={items} onChange={onChange}/>
    )
}

export default AppointCenter