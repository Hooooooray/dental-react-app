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
    getItem('预约中心', '/appointCenter',),
    getItem('患者中心', '/patientCenter',),
    getItem('患者管理', '/patientManage',),
    getItem('挂号管理','/registrationManagement')
];

const WorkbenchLayout = () => {
    const location = useLocation();
    const path = location.pathname.split('/')[2] || 'employeeManage'
    const navigate = useNavigate();
    const handleMenuClick = (menu: any) => {
        let { key } = menu
        key = '/workbench' + key
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

export default WorkbenchLayout