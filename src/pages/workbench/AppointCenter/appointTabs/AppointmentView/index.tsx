import React, {useEffect, useState} from "react";
import {Alert, Button, Col, DatePicker, DatePickerProps, Flex, Layout, Row, Space, Table, Tag} from "antd";
import timeItem from "./viewComponent/timeItem";
import clock from "../clock.png"
import "../TableComponent.scss"
import dayjs from "dayjs";
import {getAppointments} from "../../../../../api/appointment";
import style from './style.module.scss'

const {Content} = Layout
const {Sider, Header} = Layout

const AppointmentView = () => {

    const columns = [
        {
            dataIndex: 'col1',
            key: 'col1',
            width: 175
        },
        {
            dataIndex: 'col2',
            key: 'col2',
            width: 175
        },
        {
            dataIndex: 'col3',
            key: 'col3',
            width: 175,

        },
        {
            dataIndex: 'col4',
            key: 'col4',
            width: 175
        },
        {
            dataIndex: 'col5',
            key: 'col5',
            width: 175
        },
        {
            dataIndex: 'col6',
            key: 'col6',
            width: 175
        },
        {
            dataIndex: 'col7',
            key: 'col7',
            width: 175
        }
    ];


    // 创建包含144个元素的数据数组
    const defaultData = Array.from({length: 144}, (_, index) => ({
        key: index,
    }));

    const [data, setData] = useState()
    useEffect(() => {
        // console.log(defaultData)
        // @ts-ignore
        return setData(defaultData);
    }, [])

    const [dates, setDates] = useState([]);
    const onChange: DatePickerProps['onChange'] = (date) => {
        // console.log(date);
        if (date) {
            setCurrentWeek(dayjs(date).startOf('week'));
        }
    };

    const fetchAppointments = async (startTime: any, endTime: any) => {
        const thisData = [...defaultData];
        const response = await getAppointments(startTime, endTime)
        // console.log(response)
        if (response.status === 200 && response.data.data) {
            const appointmentData = response.data.data
            for (let appointment of appointmentData) {
                console.log(appointment)
                const appointmentDate = new Date(appointment.appointmentTime);
                const startOfDay = new Date(appointmentDate);
                startOfDay.setHours(8, 0, 0, 0); // 设置为当天早上 8 点
                const appointmentMinutes = (appointmentDate.getTime() - startOfDay.getTime()) / (1000 * 60); // 计算预约时间距离早上 8 点经过的分钟数
                const segmentNumber = Math.floor(appointmentMinutes / 5);
                const week = startOfDay.getDay()
                // console.log(segmentNumber, week)

                let columnKey = '';
                switch (week) {
                    case 1:
                        columnKey = 'col1';
                        break;
                    case 2:
                        columnKey = 'col2';
                        break;
                    case 3:
                        columnKey = 'col3';
                        break;
                    case 4:
                        columnKey = 'col4';
                        break;
                    case 5:
                        columnKey = 'col5';
                        break;
                    case 6:
                        columnKey = 'col6';
                        break;
                    case 0:
                        columnKey = 'col7';
                        break;
                    default:
                        break;
                }

                // 更新 thisData 数组中对应索引位置的对象数据
                // @ts-ignore
                thisData[segmentNumber] = {
                    ...thisData[segmentNumber],
                    [columnKey]: `${appointment.employee.name}-${appointment.patient.name}-${appointment.status}`
                };


            }
        }
        // @ts-ignore
        setData(thisData)
        // console.log(thisData)
    }

    // 设置初始日期为当前周的开始（星期一）
    const [currentWeek, setCurrentWeek] = useState(dayjs().startOf('week'));

    // 当组件加载时，更新日期数组
    useEffect(() => {
        const datesArray = [];
        for (let i = 1; i <= 7; i++) {
            const day = currentWeek.add(i, 'day');
            datesArray.push(day.format('YYYY-MM-DD'));
        }
        // @ts-ignore
        setDates(datesArray);
        const startTime = currentWeek.add(1, "day").toISOString()
        const endTime = currentWeek.add(8, "day").toISOString()
        fetchAppointments(startTime, endTime)
    }, [currentWeek]);

    return (
        <div style={{minWidth: "1280px"}}>
            <Flex style={{height: "52px", padding: "10px 5px"}}>
                <Space>
                    <DatePicker onChange={onChange} picker="week"/>
                    <Button>本周</Button>
                </Space>
            </Flex>
            <Header style={{height: "32px", background: "#F5F5F5", padding: 0}}>
                <Flex align={"center"} style={{height: "32px"}}>
                    <Flex justify={"center"} align={"center"} style={{width: "54px", height: "32px"}}>
                        <img width={22} height={22} src={clock} alt=""/>
                    </Flex>
                    <Flex>
                        {dates.map((dateString, index) => (
                            <div key={index} style={{width: "175px", textAlign: "center"}}>{dateString}</div>
                        ))}
                    </Flex>
                </Flex>
            </Header>
            <Layout style={{overflow: "auto", height: 'calc(100vh - 225px)'}}>
                <Layout>
                    <Sider width={54} style={{height: "100vh"}}>
                        {timeItem}
                    </Sider>
                    <Table
                        className={style.centerHead}
                        style={{width: "1225px"}}
                        columns={columns}
                        bordered={true}
                        dataSource={data}
                        pagination={false}
                        showHeader={false}
                        rowClassName={() => 'custom-row-style'}
                    />
                </Layout>
            </Layout>
            <Layout style={{
                height: 'calc(100vh - 715px)',
                display: "flex",
                flexDirection:"row",
                padding:"5px"
            }}>
                <div>
                    <Alert message="视图格式：员工-患者-预约状态" type="success"/>
                </div>
            </Layout>
        </div>
    )
}

export default AppointmentView
