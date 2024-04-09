import React, { useState } from 'react';
import { Tabs } from 'antd';
import AppointmentView from './appointTabs/AppointmentView';
import AppointmentSearch from './appointTabs/AppointmentSearch';

const AppointCenter = () => {
    const [activeKey, setActiveKey] = useState('1'); // 用于追踪当前激活的标签页key

    const onChange = (newActiveKey: React.SetStateAction<string>) => {
        setActiveKey(newActiveKey); // 在切换标签页时更新当前激活的标签页key
    };

    // 使用当前激活的标签页key构造每个标签内容的key属性
    const items = [
        {
            key: '1',
            label: '预约视图',
            children: <AppointmentView key={`appointment-view-${activeKey}`} />,
        },
        {
            key: '2',
            label: '预约查询',
            children: <AppointmentSearch key={`appointment-search-${activeKey}`} />,
        },
    ];

    return (
        <Tabs style={{ height: 'calc(100vh - 48px)' }} type="card" defaultActiveKey="1" onChange={onChange} items={items} activeKey={activeKey} />
    );
};

export default AppointCenter;
