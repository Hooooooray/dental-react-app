import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Empty, Layout } from "antd";

const { Content } = Layout;

const NotFound = () => {
    const [seconds, setSeconds] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        // 设置定时器
        const timer = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds <= 1) {
                    clearInterval(timer); // 清除定时器
                    navigate('/'); // 重定向到首页
                }
                return prevSeconds - 1;
            });
        }, 1000);

        // 组件卸载时清除定时器
        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <Layout style={{ height: "100vh" }}>
            <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                    <Empty description={`页面未找到或你无权访问此页面`} />
                    <h3 style={{fontWeight:"normal"}}><a style={{fontSize:"30px"}} href="javascript:void(0)">{seconds}</a>秒后返回首页</h3>
                    <a  href="/" style={{textDecoration:"underline",fontSize:"15px"}}>立即回到首页</a>
                </div>
            </Content>
        </Layout>
    );
};

export default NotFound;
