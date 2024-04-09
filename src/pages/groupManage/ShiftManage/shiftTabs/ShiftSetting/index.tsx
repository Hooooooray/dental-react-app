import React, {useEffect, useState} from "react";
import {App, Button, Flex, Form, Input, Modal, Popconfirm, Space, Table, TimePicker} from "antd";
import dayjs from "dayjs";
import style from './style.module.scss'
import {ColumnsType} from "antd/es/table";
import {addShift, deleteShift, editShift, getShifts} from "../../../../../api/shift";
import {QuestionCircleOutlined} from "@ant-design/icons";

const format = 'HH:mm';

const ShiftSetting = () => {
    const {message} = App.useApp();
    const [render, setRender] = useState(0)

    interface ShiftDataType {
        id: number;
        key: React.Key;
    }

    const [shiftData, setShiftData] = useState<ShiftDataType[]>()
    const shiftColumns: ColumnsType<ShiftDataType> = [
        {
            title: '班次名称',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            width: 200
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            width: 200
        },
        {
            title: '操作',
            fixed: 'right',
            key: 'operation',
            width: 100,
            render: (record) => (
                <Space>
                    <Button onClick={() => handleEditShift(record)}>修改</Button>
                    <Popconfirm
                        title="提示"
                        description="确定要删除此班次？"
                        okText="确定"
                        cancelText="取消"
                        placement="topRight"
                        icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                        onConfirm={() => handleDeleteShift(record)}
                    >
                        <Button danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        getShifts().then(response => {
            console.log(response);
            if (response.status === 200 && response.data) {
                const shiftData = response.data.data.map((item: { id: number; }) => ({
                    ...item,
                    key: item.id, // 确保每条记录都有唯一的key
                }));
                setShiftData(shiftData);
            }
        })
    }, [render]);

    const handleEditShift = (record: any) => {
        setIsShiftAdd(false)
        setIsAddShiftOpen(true)
        console.log(record)
        shiftForm.setFieldsValue({
            id: record.id,
            name: record.name,
            startTime: dayjs(record.startTime, format), // 确保时间格式与Form的TimePicker组件兼容
            endTime: dayjs(record.endTime, format) // 确保时间格式与Form的TimePicker组件兼容
        });
    }
    const handleDeleteShift = async (record: any) => {
        let id = record.id
        try {
            const response = await deleteShift({id})
            if (response.status === 200) {
                message.success('删除成功')
                setRender(render + 1)
            }
        } catch (error) {
            console.error(error);
            message.error('删除失败')
        }
    }

    const [isAddShiftOpen, setIsAddShiftOpen] = useState(false)
    const [isShiftAdd, setIsShiftAdd] = useState(true)
    const [shiftForm] = Form.useForm()

    const onShiftFinish = async () => {
        const data = shiftForm.getFieldsValue();
        console.log(data)
        const formattedStartTime = data.startTime.format('HH:mm');
        const formattedEndTime = data.endTime.format('HH:mm');
        if (isShiftAdd) {
            const response = await addShift({
                name: data.name,
                startTime: formattedStartTime,
                endTime: formattedEndTime
            })
            if (response.status === 200 && response.data.success === true) {
                console.log(response.data.data)
                message.success('添加成功')
                setIsAddShiftOpen(false)
                setRender(render + 1)
            } else {
                message.error('添加失败')
            }
        } else {
            const response = await editShift({
                id: parseInt(data.id),
                name: data.name,
                startTime: formattedStartTime,
                endTime: formattedEndTime
            })
            if (response.status === 200 && response.data.success === true) {
                console.log(response.data.data)
                message.success('修改成功')
                setIsAddShiftOpen(false)
                setRender(render + 1)
            } else {
                message.error('修改失败')
            }
        }

    }

    const onShiftFinishFailed = (errorInfo: object) => {
        message.warning('请完成必要字段的填写')
        console.log('Failed:', errorInfo);
    }

    const disabledHours = (): number[] => {
        let hours = [];
        for (let i = 0; i < 8; i++) {
            hours.push(i);
        }
        for (let i = 21; i < 24; i++) {
            hours.push(i);
        }
        return hours;
    };

    const disabledMinutes = (selectedHour: number) => {
        if (selectedHour === 20) {
            const minute = []
            for (let i = 1; i <= 59; i++) {
                minute.push(i)
            }
            return minute;
        }
        return [];
    };

    return (
        <>
            <Modal title={isShiftAdd ? '新增班次' : '修改班次'} open={isAddShiftOpen} onCancel={() => {
                setIsAddShiftOpen(false)
                shiftForm.resetFields()
            }} onOk={() => {
                shiftForm.submit()
            }}>
                <Form form={shiftForm} onFinish={onShiftFinish} onFinishFailed={onShiftFinishFailed}>
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item rules={[{required: true}]}
                               label="班次名称" name="name">
                        <Input></Input>
                    </Form.Item>
                    <Form.Item rules={[{required: true}]}
                               label="开始时间" name="startTime">
                        <TimePicker className={style.shiftFormTimePicker}
                                    format={format}
                                    showNow={false}
                                    hideDisabledOptions
                                    needConfirm={false}
                                    disabledTime={() => ({
                                        disabledHours,
                                        disabledMinutes
                                    })}
                        />
                    </Form.Item>
                    <Form.Item rules={[{required: true}]}
                               label="结束时间" name="endTime">
                        <TimePicker className={style.shiftFormTimePicker}
                                    format={format}
                                    showNow={false}
                                    hideDisabledOptions
                                    needConfirm={false}
                                    disabledTime={() => ({
                                        disabledHours,
                                        disabledMinutes
                                    })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Flex className={style.firstLevel} justify={"center"} align={"center"}>
                <p className={style.openingHours}>营业时间：</p>
                <Space>
                    <TimePicker.RangePicker defaultValue={[dayjs("08:00", format), dayjs("20:00", format)]}
                                            format={format}
                                            disabled className={style.customRange}/>
                    <Button type={"primary"} onClick={() => {
                        setIsShiftAdd(true)
                        setIsAddShiftOpen(true)
                    }}>新增班次</Button>
                </Space>
            </Flex>
            <div className={style.TableContainer}>
                <Table columns={shiftColumns} dataSource={shiftData} scroll={{x: "max-content", y: '70vh'}}
                       pagination={false}
                       bordered={true}/>
            </div>
        </>
    )
}

export default ShiftSetting