import React, {useState} from 'react';

import {Tabs} from 'antd';
import type {TabsProps} from 'antd';
import EmployeeTabItem from "./employeeTabs/EmployeeTabItem";
import RoleTabItem from "./employeeTabs/RoleTabItem";




const EmployeeManage = () => {
    const [activeKey, setActiveKey] = useState('1'); // 用于追踪当前激活的标签页key
    const onChange = (newActiveKey: React.SetStateAction<string>) => {
        setActiveKey(newActiveKey); // 在切换标签页时更新当前激活的标签页key
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '员工管理',
            children: <EmployeeTabItem key={`employeeTab-view-${activeKey}`} />,
        },
        {
            key: '2',
            label: '角色管理',
            children: <RoleTabItem key={`employeeTab-view-${activeKey}`} />,
        },
    ];


    return (
        <Tabs type='card' defaultActiveKey="1" items={items} onChange={onChange}/>
    )
}

export default EmployeeManage