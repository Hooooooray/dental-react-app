import React from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, } from 'antd';
import type { MenuProps } from 'antd';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('人员管理', '/employeeManage',),
    getItem('权限配置','/permissionConfiguration'),
    getItem('项目管理', '/projectManage',),
];

const GroupManageLayout = () => {
    const location = useLocation();
    const path = location.pathname.split('/')[2] || 'employeeManage'
    const navigate = useNavigate();
    const handleMenuClick = (menu: any) => {
        let { key } = menu
        key = '/groupManage' + key
        navigate(key)
    }
    return (
        <>
            <Sider width={104}>
                <Menu
                    style={{ height: '100%' }}
                    onClick={handleMenuClick}
                    mode="inline"
                    inlineIndent={20}
                    selectedKeys={[`/${path}`]}
                    items={items}
                />
            </Sider>
            <Layout>
                <Outlet />
            </Layout>
        </>


    )
}

export default GroupManageLayout