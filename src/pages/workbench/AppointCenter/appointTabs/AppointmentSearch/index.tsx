import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button,
    DatePicker,
    Form,
    Layout,
    Pagination, Popconfirm,
    Row,
    Select,
    Space,
    Table,
    TimeRangePickerProps
} from "antd";
import {DebounceSelect, fetchDoctorList, fetchPatientList} from "../../../../../components/DebounceSelect";
import dayjs from "dayjs";
import type {Dayjs} from 'dayjs';
import {ColumnsType} from "antd/es/table";
import {QuestionCircleOutlined, UserOutlined} from "@ant-design/icons";
import {getAppointments} from "../../../../../api/appointment";
import areaData from "china-area-data/v5/data";
import style from './style.module.scss'
import {onRangeChange, rangePresets} from "../../../../../components/PublicTimePicker";
import {useSelector} from "react-redux";
import {AppState} from "../../../../../store";

const {Option} = Select;
const {Content} = Layout;
const {RangePicker} = DatePicker;

interface ListValue {
    label: string;
    value: string;
}

const AppointmentSearch = () => {
    const [appointmentSearch] = Form.useForm()
    const [patientValue, setPatientValue] = useState<ListValue | undefined>();
    const [doctorValue, setDoctorValue] = useState<ListValue | undefined>();
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [startTime, setStartTime] = useState<any>()
    const [endTime, setEndTime] = useState<any>()
    const [service, setService] = useState()
    const [status, setStatus] = useState()
    const [patientId, setPatientId] = useState()
    const [employeeId, setEmployeeId] = useState()
    const onAppointmentSearchFinish = () => {
        const data = appointmentSearch.getFieldsValue();
        console.log(data)
        setService(data.service)
        setStatus(data.status)
        if (data.patient) {
            setPatientId(data.patient.value)
        }
        if (data.employee) {
            setEmployeeId(data.employee.value)
        }
        if (data.appointmentTime) {
            setStartTime(data.appointmentTime[0].toISOString())
            setEndTime(data.appointmentTime[1].toISOString())
        } else {
            setStartTime(null)
            setEndTime(null)
        }


    }
    const onAppointmentSearchFinishFailed = (errorInfo: object) => {
        console.log('Failed:', errorInfo);
    }
    const handleChangePage = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }


    const [sortOrder, setSortOrder] = useState()
    const [sortColumn, setSortColumn] = useState()
    const handleEditAppointment = (record: any) => {
        console.log(record)
    }
    const handleTableChange = (sorter: any) => {
        const {columnKey, order} = sorter;
        setSortOrder(order)
        setSortColumn(columnKey)
    };

    const renderAppointmentTable = () => {
        getAppointments(startTime, endTime, service, status, patientId, employeeId, page, pageSize).then(response => {
            if (response.status === 200) {
                let appointments = response.data.data
                console.log(appointments)
                setTotal(response.data.total)
                setSearchData(appointments.map((appointment: any) => {
                    const formattedAppointment: any = {
                        ...appointment,
                        key: appointment.id,
                    };
                    if (appointment.createdAt) {
                        formattedAppointment.createdAt = dayjs(appointment.createdAt).format('YYYY年MM月DD日');
                    }
                    if (appointment.appointmentTime) {
                        formattedAppointment.appointmentTime = dayjs(appointment.appointmentTime).format('YYYY年MM月DD日');
                    }
                    if (appointment.employee) {
                        formattedAppointment.employeeName = appointment.employee.name
                    }
                    if (appointment.patient) {
                        formattedAppointment.patientName = appointment.patient.name
                        formattedAppointment.patientGender = appointment.patient.gender
                        formattedAppointment.patientAge = appointment.patient.age
                    }
                    return formattedAppointment;
                }))
            }
        })
    }
    const renderAppointment = useSelector((state: AppState) => state.renderAppointment)
    useEffect(() => {
        console.log(('effect'))
        renderAppointmentTable()
    }, [page, pageSize, startTime, endTime, service, status, patientId, employeeId, sortOrder, sortColumn, renderAppointment])

    interface SearchDataType {
        id: number;
        key: React.Key;
    }

    const [searchData, setSearchData] = useState<SearchDataType[]>([]);
    const searchColumns: ColumnsType<SearchDataType> = [
        {
            title: '患者',
            width: 90,
            dataIndex: 'patientName',
            key: 'patientName',
            sorter: true,
        },
        {
            title: '性别',
            width: 90,
            dataIndex: 'patientGender',
            key: 'patientGender',
            sorter: true,
        },
        {
            title: '年龄',
            width: 90,
            dataIndex: 'patientAge',
            key: 'patientAge',
            sorter: true,
        },
        {
            title: '客户号',
            width: 90,
            dataIndex: 'patientId',
            key: 'patientId',
            sorter: true,
        },
        {
            title: '预约号',
            width: 90,
            dataIndex: 'id',
            key: 'id',
            sorter: true,
        },
        {
            title: '预约医生',
            width: 90,
            dataIndex: 'employeeName',
            key: 'employeeName',
            sorter: true,
        },
        {
            title: '预约时间',
            width: 150,
            dataIndex: 'appointmentTime',
            key: 'appointmentTime',
        },
        {
            title: '预约项目',
            width: 90,
            dataIndex: 'service',
            key: 'service',
            sorter: true,
        },
        {
            title: '预约状态',
            width: 90,
            dataIndex: 'status',
            key: 'status',
            sorter: true,
        },
        {
            title: '创建时间',
            width: 150,
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
        },
        {
            title: '操作',
            key: 'operation',
            width: 200,
            fixed: 'right',
            render: (record) => (
                <Space>
                    <Button onClick={() => handleEditAppointment(record)}>修改预约</Button>
                </Space>
            ),
        },
    ]


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
                            <RangePicker className={style.customRange} presets={rangePresets} onChange={onRangeChange}/>
                        </Form.Item>
                        <Button onClick={() => {
                            appointmentSearch.submit()
                        }} style={{marginLeft: "10px"}} type={"primary"}>搜索</Button>
                    </Row>
                </Form>

                <Table
                    style={{minWidth: "440px"}}
                    size={"small"}
                    pagination={false}
                    bordered={true}
                    columns={searchColumns}
                    dataSource={searchData}
                    scroll={{x: "max-content", y: '60vh'}}
                    onChange={(pagination, filters, sorter) => handleTableChange(sorter)}
                />
                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    showQuickJumper
                    showSizeChanger
                    pageSizeOptions={[10, 20, 30, 40, 50, 100]}
                    showTotal={(total) => `共 ${total} 条`}
                    onChange={handleChangePage}
                    style={{marginTop: '10px'}}
                />
            </Content>
        </>
    )
}

export default AppointmentSearch