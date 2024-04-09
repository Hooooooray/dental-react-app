import React, {useState} from "react";
import DoctorShift from "./shiftTabs/DoctorShift";
import ShiftSetting from "./shiftTabs/ShiftSetting";
import {Tabs} from "antd";

const ShiftManage = ()=>{
    const [activeKey, setActiveKey] = useState('1'); // 用于追踪当前激活的标签页key

    const onChange = (newActiveKey: React.SetStateAction<string>) => {
        setActiveKey(newActiveKey); // 在切换标签页时更新当前激活的标签页key
    };
    const items = [
        {
            key: '1',
            label: '员工排班',
            children: <DoctorShift key={`doctor-shift-${activeKey}`} />,
        },
        {
            key: '2',
            label: '班次设置',
            children: <ShiftSetting key={`shift-setting-${activeKey}`} />,
        },
    ];
    return(
        <>
            <Tabs style={{ height: 'calc(100vh - 48px)' }} type="card" defaultActiveKey="1" onChange={onChange} items={items} activeKey={activeKey} />
        </>
    )
}

export default ShiftManage