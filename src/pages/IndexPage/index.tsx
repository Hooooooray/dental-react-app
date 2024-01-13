import React, {useState} from "react";
import {Layout, Menu, Tabs, TabsProps} from "antd";
import todayAppointment from "./indexTabs/todayAppointment";
import todaySeeADoctor from "./indexTabs/todaySeeADoctor";
import dailyNews from "./indexTabs/dailyNews";
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

const items: TabsProps['items'] = [
    {
        key: '1',
        label: '今日预约',
        children:todayAppointment
    },
    {
        key: '2',
        label: '今日就诊',
        children: todaySeeADoctor
    },
    {
        key: '3',
        label: '今日资讯',
        children: dailyNews
    },
];


const IndexPage = () => {
    const onChange = (key: string) => {
        console.log(key);
    };

    return (
        <>
            <Layout>
                <Content>
                    <Tabs type='card' defaultActiveKey="1" items={items} onChange={onChange}/>
                </Content>
            </Layout>
        </>
    )
}

export default IndexPage