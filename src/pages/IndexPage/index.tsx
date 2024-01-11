import React, {useState} from "react";
import {App, Form, Input, Layout, Menu, MenuProps, Modal} from "antd";
import {addRole} from "../../api/role";
const {Header,Content} = Layout

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 40,
    paddingInline: 0,
    lineHeight: '40px',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom:"solid 1px #E6E6E6"
};

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

const items: MenuItem[] = [
    getItem('今日预约', 'order'),
    getItem('今日就诊', 'SeeADoctor'),
    getItem('今日咨询', 'consult'),
]



const IndexPage = () => {
    const [selectedKey, setSelectedKey] = useState('order')

    const handleMenuClick = (menu: any) => {
        const {key} = menu
        setSelectedKey(key)
    }

    return (
        <>
            <Layout>
                <Header style={headerStyle}>
                    <Menu
                        style={{paddingLeft:"7.5px"}}
                        onClick={handleMenuClick}
                        mode="horizontal"
                        selectedKeys={[`${selectedKey}`]}
                        items={items}
                    />
                </Header>
                <Content>

                </Content>
            </Layout>
        </>
    )
}

export default IndexPage