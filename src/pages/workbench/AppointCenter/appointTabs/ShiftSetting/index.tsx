import React from "react";
import {Button, Flex, Space, TimePicker} from "antd";
import dayjs from "dayjs";
import style from './style.module.scss'
const format = 'HH:mm';

const ShiftSetting = () => {
    return (
        <>
            <Flex className={style.firstLevel} justify={"center"} align={"center"}>
                <p className={style.openingHours}>营业时间：</p>
                <Space>
                    <TimePicker.RangePicker defaultValue={[dayjs("08:00", format), dayjs("20:00", format)]} format={format}
                                            disabled className={style.customRange}/>
                    <Button type={"primary"}>新增班次</Button>
                </Space>
            </Flex>
        </>
    )
}

export default ShiftSetting