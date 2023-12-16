import React from 'react';

import {Tabs} from 'antd';
import type {TabsProps} from 'antd';
import EmployeeTabItem from "./EmployeeTabItem";
import RoleTabItem from "./RoleTabItem";

const onChange = (key: string) => {
    console.log(key);
};

const items: TabsProps['items'] = [
    {
        key: '1',
        label: '人员管理',
        children: <EmployeeTabItem></EmployeeTabItem>,
    },
    {
        key: '2',
        label: '角色管理',
        children: <RoleTabItem></RoleTabItem>,
    },
];

const EmployeeManage = () => {
    return (
        <Tabs type='card' defaultActiveKey="1" items={items} onChange={onChange}/>
    )
}

export default EmployeeManage