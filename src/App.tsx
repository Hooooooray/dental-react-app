import React from 'react';
import logo from './logo.svg';
import './App.css';
import RouterView from "./router";
import {ConfigProvider} from 'antd'

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#E85870',
                    colorBorderSecondary: '#EFEFEF',
                    paddingLG:10,
                    padding:7.5
                },
                components: {
                    Layout: {
                        bodyBg: '#fff',
                        siderBg: '#fff'
                    },
                    Tabs: {
                        cardBg: "#EFEFEF",
                        cardGutter: 2,
                        horizontalMargin: '2px 0 0 2px'
                    },
                },
            }}
        >
            <RouterView></RouterView>
        </ConfigProvider>

    );
}

export default App;
