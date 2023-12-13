import React, {useEffect, useRef} from "react";
import {Outlet, useNavigate} from 'react-router-dom'
import type {MenuProps} from 'antd';
import {Layout, Menu, theme} from 'antd';

const {Header} = Layout;

type MenuItem = Required<MenuProps>['items'][number];
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        label,
        key,
        icon,
        children,
        type,
    } as MenuItem;
}
//
// const items: MenuProps['items'] = ['今日工作', '工作台', '集团管理'].map((key) => ({
//     key,
//     label: `${key}`,
// }));

const items: MenuItem[] = [
    getItem('今日工作','/index'),
    getItem('工作台','/workbench'),
    getItem('集团管理','/groupManage')
]

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 0,
    lineHeight: '64px',
};

const LayoutPage = () => {
    const myRef = useRef(null)

    useEffect(() => {
        console.log(myRef.current)
    })

    const navigate = useNavigate();
    const handleMenuClick = (menu:any)=>{
        const {key} = menu
        navigate(key)
    }

    return (
        <div ref={myRef}>
            <Layout>
                <Header style={headerStyle}>
                    <Menu
                        onClick={handleMenuClick}
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['今日工作']}
                        items={items}
                    />
                </Header>
                    <Outlet/>
            </Layout>

        </div>
    )
}

export default LayoutPage