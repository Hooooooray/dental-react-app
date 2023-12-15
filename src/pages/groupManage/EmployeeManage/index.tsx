import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Tabs, Button, Space, Drawer } from 'antd';
import type { TabsProps } from 'antd';

const onChange = (key: string) => {
    console.log(key);
};

const addDepartment = () => {
    console.log('click addDepartment')
}
const addEmployee = () => {
    console.log('click addEmployee')
}

const items: TabsProps['items'] = [
    {
        key: '1',
        label: '人员管理',
        children: <div style={{ padding: '16px 0 0 16px' }}>
            <Space size="large">
                <Button icon={<PlusOutlined />} onClick={addDepartment}>新增部门</Button>
                <Button icon={<PlusOutlined />} onClick={addEmployee}>新增员工</Button>
            </Space>
        </div>,
    },
    {
        key: '2',
        label: '角色管理',
        children: 'Content of Tab Pane 2',
    },
];

const EmployeeManage = () => {
    const [open, setOpen] = useState(false);

    return (
        <Tabs type='card' defaultActiveKey="1" items={items} onChange={onChange} />

    )
}

export default EmployeeManage