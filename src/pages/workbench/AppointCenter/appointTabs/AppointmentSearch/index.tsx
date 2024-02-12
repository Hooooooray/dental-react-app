import React, {useState} from "react";
import {Button, DatePicker, Form, Layout, Row, Select, Space, TimeRangePickerProps} from "antd";
import {DebounceSelect, fetchDoctorList, fetchPatientList} from "../../../../../components/DebounceSelect";
import dayjs from "dayjs";
import type {Dayjs} from 'dayjs';

const {Option} = Select;
const {Content} = Layout;
const {RangePicker} = DatePicker;

interface ListValue {
    label: string;
    value: string;
}

const rangePresets: TimeRangePickerProps['presets'] = [
    {label: '今天', value: [dayjs().add(0, 'd'), dayjs()]},
    {label: '近两天', value: [dayjs().add(-1, 'd'), dayjs()]},
    {label: '近三天', value: [dayjs().add(-2, 'd'), dayjs()]},
    {label: '近一周', value: [dayjs().add(-7, 'd'), dayjs()]},
    {label: '近两周', value: [dayjs().add(-14, 'd'), dayjs()]},
    {label: '近一个月', value: [dayjs().add(-30, 'd'), dayjs()]},
];

const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
        console.log('Clear');
    }
};


const AppointmentSearch = () => {
    const [appointmentSearch] = Form.useForm()
    const [patientValue, setPatientValue] = useState<ListValue | undefined>();
    const [doctorValue, setDoctorValue] = useState<ListValue | undefined>();
    const onAppointmentSearchFinish = () => {
        const data = appointmentSearch.getFieldsValue();
        console.log(data)
    }
    const onAppointmentSearchFinishFailed = (errorInfo: object) => {
        console.log('Failed:', errorInfo);
    }


    return (
        <>
            <Content style={{padding: "10px", minWidth: "890px"}}>
                <Form
                    form={appointmentSearch}
                    onFinish={onAppointmentSearchFinish}
                    onFinishFailed={onAppointmentSearchFinishFailed}
                >
                    <Row>
                        <Space>
                            <Form.Item name="service" label="预约项目">
                                <Select
                                    allowClear
                                    style={{width: "120px"}}
                                >
                                    <Option value="TOOTH_EXTRACTION">拔牙</Option>
                                    <Option value="TOOTH_FILLING">补牙</Option>
                                    <Option value="TOOTH_IMPLANTATION">种牙</Option>
                                    <Option value="TOOTH_INLAY">镶牙</Option>
                                    <Option value="ORTHODONTICS">正畸</Option>
                                    <Option value="TEETH_CLEANING">洗牙</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="status" label="预约状态">
                                <Select
                                    allowClear
                                    style={{width: "120px"}}
                                >
                                    <Option value="PENDING">待处理</Option>
                                    <Option value="CONFIRMED">已确认</Option>
                                    <Option value="CANCELLED">已取消</Option>
                                    <Option value="COMPLETED">已完成</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="患者" name="patient">
                                <DebounceSelect
                                    showSearch
                                    value={patientValue}
                                    placeholder="选择患者"
                                    fetchOptions={fetchPatientList}
                                    onChange={(newValue: any) => {
                                        setPatientValue(newValue);
                                    }}
                                    style={{width: "120px"}}
                                />
                            </Form.Item>
                            <Form.Item
                                label="医生" name="employee">
                                <DebounceSelect
                                    showSearch
                                    value={doctorValue}
                                    placeholder="选择医生"
                                    fetchOptions={fetchDoctorList}
                                    onChange={(newValue: any) => {
                                        setDoctorValue(newValue);
                                    }}
                                    style={{width: "120px"}}
                                />
                            </Form.Item>
                        </Space>
                    </Row>
                    <Row>
                            <Form.Item
                                label="预约时间" name="appointmentTime"
                            >
                                <RangePicker presets={rangePresets} onChange={onRangeChange}/>
                            </Form.Item>
                            <Button onClick={()=>{
                                appointmentSearch.submit()
                            }} style={{marginLeft:"10px"}} type={"primary"}>搜索</Button>
                    </Row>
                </Form>
            </Content>
        </>
    )
}

export default AppointmentSearch