import React from 'react';
import './App.css';
import RouterView from "./router";
import {ConfigProvider, App as AntDesignApp} from 'antd'
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

function App() {
    return (
        <ConfigProvider
            locale={locale}
            theme={{
                token: {
                    colorPrimary: '#E85870',
                    colorBorderSecondary: '#EFEFEF',
                    paddingLG:10,
                    padding:7.5,
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
                    Table: {
                        bodySortBg:"#F5F5F5",
                        borderColor:"#ECEEF4"
                    },
                    Modal: {
                    },
                },
            }}
        >
            <AntDesignApp message={{ maxCount: 1 }}>
                <RouterView></RouterView>
            </AntDesignApp>
        </ConfigProvider>

    );
}

export default App;
