import React, {useEffect, useState} from "react";
import {
    Alert, App,
    Avatar,
    Button,
    Collapse,
    CollapseProps,
    DatePicker,
    Drawer, Dropdown, Flex,
    Form,
    Input, List, Modal, Pagination, Popconfirm, Radio,
    Row,
    Select,
    Space,
    Table, Tag
} from "antd";
import {PlusOutlined, QuestionCircleOutlined, UserOutlined} from "@ant-design/icons";
import style from './style.module.scss'
import {onRangeChange, rangePresets} from "../../../components/PublicTimePicker";
import {SearchProps} from "antd/es/input";
import {getPatient, searchPatients} from "../../../api/patient";
import {addRegistration, editRegistration, getMaxRegistrationID, getRegistrations} from "../../../api/registration";
import type {MenuProps} from 'antd';
import type {ColumnsType} from "antd/es/table";
import {getEmployees} from "../../../api/employee";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} = Input;


const RegistrationManagement = () => {
    const {message} = App.useApp();

    interface RegistrationType {
        avatar: any;
        key: React.Key;
        id: number;
    }

    const [registrationData, setRegistrationData] = useState<RegistrationType[]>([])
    const [registrationTablePage, setRegistrationTablePage] = useState(1)
    const [registrationTablePageSize, setRegistrationTablePageSize] = useState(10)
    const [registrationTableTotal, setRegistrationTableTotal] = useState(0)
    const [registrationConditions] = Form.useForm()
    const [startTime, setStartTime] = useState<any>()
    const [endTime, setEndTime] = useState<any>()
    const [patientQuery, setPatientQuery] = useState()
    const [doctorQuery, setDoctorQuery] = useState()
    const [visitingType, setVisitingType] = useState()
    const [status, setStatus] = useState()

    const renderRegistrationTable = () => {
        interface Registration {
            id: number;
            createdAt?: any
            patient?: any
            employee?: any
        }

        getRegistrations(registrationTablePage, registrationTablePageSize, startTime, endTime, visitingType, status, patientQuery, doctorQuery)
            .then(response => {
                if (response.status === 200) {
                    let registrations = response.data.data
                    console.log(registrations)
                    setRegistrationTableTotal(response.data.total)
                    setRegistrationData(registrations.map((registration: Registration) => {
                        const formattedRegistration = {
                            patientName: undefined,
                            gender: undefined,
                            age: undefined,
                            doctorName: undefined,
                            avatar: undefined,
                            ...registration,
                            key: registration.id,
                        };
                        if (registration.createdAt) {
                            formattedRegistration.createdAt = dayjs(registration.createdAt).format('YYYY年MM月DD日');
                        }
                        if (registration.patient) {
                            formattedRegistration.patientName = registration.patient.name
                            formattedRegistration.gender = registration.patient.gender
                            formattedRegistration.age = registration.patient.age
                            formattedRegistration.id = registration.patient.id
                        }
                        if (registration.employee) {
                            formattedRegistration.doctorName = registration.employee.name
                        }
                        if (registration.patient.avatar) {
                            formattedRegistration.avatar = registration.patient.avatar
                        }
                        return formattedRegistration;
                    }))
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    const statusDropdownItems: MenuProps['items'] = [
        {
            label: '已挂号',
            key: 'REGISTERED',
        },
        {
            label: '已就诊',
            key: 'VISITED',
        },
        {
            label: '已取消',
            key: 'CANCELLED',
        },
    ];

    const visitingTypeDropdownItems: MenuProps['items'] = [
        {
            label: '初诊',
            key: 'FIRST_VISIT',
        },
        {
            label: '复诊',
            key: 'FOLLOW_UP',
        },
        {
            label: '复查',
            key: 'RE_EXAMINATION',
        },
        {
            label: '咨询',
            key: 'CONSULTATION',
        },
    ];
    const registrationColumns: ColumnsType<RegistrationType> = [
        {
            title: '客户号',
            dataIndex: 'patientId',
            key: 'patientId',
            width: 90,
            fixed: 'left'
        },
        {
            title: '患者',
            dataIndex: 'patientName',
            key: 'patientName',
            width: 120,
            fixed: 'left',
            render: (text, record) => (
                <Space>
                    {record.avatar ? <Avatar shape="square" src={`data:image/jpeg;base64,${record.avatar}`}/> :
                        <Avatar shape="square" icon={<UserOutlined/>}/>}
                    {<a onClick={() => {
                    }}>{text}</a>}
                </Space>
            ),
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            width: 100,
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            width: 100,
        },
        {
            title: '挂号状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
        },
        {
            title: '就诊类型',
            dataIndex: 'visitingType',
            key: 'visitingType',
            width: 100,
        },
        {
            title: '接诊医生',
            dataIndex: 'doctorName',
            key: 'doctorName',
            width: 120,
        },
        {
            title: '挂号时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
        },
        {
            title: '患者备注',
            dataIndex: 'notes',
            key: 'notes',
            width: 250,
        },

        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 130,
            render: (record) => {
                const handleStatusMenuClick: MenuProps['onClick'] = async (e) => {
                    console.log(e.key);
                    console.log(record.key);
                    try {
                        const response = await editRegistration({
                            id: record.key,
                            status: e.key
                        })
                        if (response.status === 200 && response.data.success === true) {
                            message.success('修改挂号状态成功')
                            renderRegistrationTable()
                        }
                    } catch (e) {
                        console.log('修改挂号状态失败')
                        console.log(e)
                    }
                };

                const handleVisitingTypeMenuClick: MenuProps['onClick'] = async (e) => {
                    console.log(e.key);
                    console.log(record.key);
                    try {
                        const response = await editRegistration({
                            id: record.key,
                            visitingType: e.key
                        })
                        if (response.status === 200 && response.data.success === true) {
                            message.success('修改就诊类型成功')
                            renderRegistrationTable()
                        }
                    } catch (e) {
                        console.log('修改就诊类型失败')
                        console.log(e)
                    }
                };
                return (
                    <Flex justify="center">
                        <Space>
                            <Dropdown menu={{items: statusDropdownItems, onClick: handleStatusMenuClick}} placement="bottom" arrow>
                                <Button>修改挂号状态</Button>
                            </Dropdown>
                            <Dropdown menu={{items: visitingTypeDropdownItems, onClick: handleVisitingTypeMenuClick}} placement="bottom" arrow>
                                <Button>修改挂号状态</Button>
                            </Dropdown>


                        </Space>
                    </Flex>
                )
            },
        },
    ]
    const handleRegistrationChangePage = (page: number, pageSize: number) => {
        setRegistrationTablePage(page)
        setRegistrationTablePageSize(pageSize)
    }

    const clearRegistrationConditions = () => {
        registrationConditions.resetFields()
        setStartTime(undefined)
        setEndTime(undefined)
        setPatientQuery(undefined)
        setDoctorQuery(undefined)
        setVisitingType(undefined)
        setStatus(undefined)
    }

    const searchRegistration = () => {
        setRegistrationTablePage(1)
        const data = registrationConditions.getFieldsValue()
        if (data.createdAt) {
            setStartTime(data.createdAt[0].toISOString())
            setEndTime(data.createdAt[1].toISOString())
        } else {
            setStartTime(undefined)
            setEndTime(undefined)
        }
        if (data.patientQuery) {
            setPatientQuery(data.patientQuery)
        } else {
            setPatientQuery(undefined)
        }
        if (data.doctorQuery) {
            setDoctorQuery(data.doctorQuery)
        } else {
            setDoctorQuery(undefined)
        }
        if (data.visitingType) {
            setVisitingType(data.visitingType)
        } else {
            setVisitingType(undefined)
        }
        if (data.status) {
            setStatus(data.status)
        } else {
            setStatus(undefined)
        }

    }
    useEffect(() => {
        renderRegistrationTable()
    }, [registrationTablePage, registrationTablePageSize, startTime, endTime, visitingType, status, patientQuery, doctorQuery]);

    // 实时更新挂号modal里的时间
    const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleString())
    useEffect(() => {
        // 每秒更新时间
        const timerId = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);

        // 组件卸载时清除定时器
        return () => clearInterval(timerId);
    }, []);

    const [registrationOpen, setRegistrationOpen] = useState(false)
    const [isRegistrationEdit, setIsRegistrationEdit] = useState(false)
    const [isChoosePatientModalOpen, setIsChoosePatientModalOpen] = useState(false)

    interface Patient {
        avatar: {
            type: string;
            data: number[];
        };
        gender: string | null;
        id: number;
        name: string;
        patientNotes: string | null;
        phone: string | null;
    }

    const [patientList, setPatientList] = useState<Patient[]>([])
    const handleChoosePatientModalCancel = () => {
        setIsChoosePatientModalOpen(false)
    }

    const onPatientSearch: SearchProps['onSearch'] = async (value, _e, info) => {
        console.log(info?.source, value)
        const response = await searchPatients(value)
        if (response.status === 200 && response.data.success === true) {
            console.log(response.data.data)
            const patientListData = response.data.data
            setPatientList(patientListData)
        }
    };

    const [doctorSearchValue, setDoctorSearchValue] = useState<string>('')
    const onDoctorSearch: SearchProps['onSearch'] = async (value, _e, info) => {
        console.log(info?.source, value)
        setDoctorSearchValue(value)
        setDoctorTablePage(1)
    };

    const [patientName, setPatientName] = useState('')
    const [patientAvatar, setPatientAvatar] = useState('')
    const [patientType, setPatientType] = useState('')
    const [patientInfoForm] = Form.useForm()

    interface DoctorType {
        key: React.Key;
        id: number;
        name?: string;
        position?: string;
        department?: string;
        dentalDepartment?: string;
        gender?: string;
    }

    const [doctorData, setDoctorData] = useState<DoctorType[]>([]);
    const [doctorTablePage, setDoctorTablePage] = useState(1)
    const [doctorTablePageSize, setDoctorTablePageSize] = useState(10)
    const [doctorTableTotal, setDoctorTableTotal] = useState(0)

    const handleChooseDoctor = (record: any) => {
        console.log(record)
        const {id, name} = record
        patientInfoForm.setFieldValue('employeeId', id)
        patientInfoForm.setFieldValue('doctor', name)
        message.success('选择成功')
    }
    const handleChangePage = (page: number, pageSize: number) => {
        setDoctorTablePage(page)
        setDoctorTablePageSize(pageSize)
    }
    const renderDoctorTable = () => {
        interface Doctor {
            id: number;
            name: string;
            position?: string;
            department?: string;
            dentalDepartment?: string;
            gender?: string;
        }

        getEmployees(doctorTablePage, doctorTablePageSize, 'DOCTOR', doctorSearchValue)
            .then(response => {
                if (response.status === 200) {
                    let doctors = response.data.data
                    setDoctorTableTotal(response.data.total)
                    setDoctorData(doctors.map((employee: Doctor) => {
                        const formattedEmployee = {
                            ...employee,
                            key: employee.id,
                        };
                        return formattedEmployee;
                    }))
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
    useEffect(() => {
        console.log(('effect'))
        renderDoctorTable()
    }, [doctorTablePage, doctorTablePageSize, doctorSearchValue])
    const clickAddRegistration = () => {
        setRegistrationOpen(true)
        renderDoctorTable()
    }
    const onRegistrationClose = () => {
        setRegistrationOpen(false)
        patientInfoForm.resetFields()
        setPatientName('')
        setPatientAvatar('')
    }
    const onChange = (key: string | string[]) => {
        console.log(key);
    };

    // 点击保存挂号
    const clickSaveRegistration = () => {
        // 触发表单验证
        patientInfoForm.submit()
    }
    // 处理保存挂号
    const saveRegistration = async () => {
        try {
            const data = patientInfoForm.getFieldsValue()
            const saveResponse = await addRegistration({
                id: data.id,
                patientId: data.patientId,
                employeeId: data.employeeId,
                visitingType: data.visitingType
            });
            console.log(saveResponse)
            if (saveResponse.status === 200 && saveResponse.data.success === true) {
                message.success('保存成功')
                setRegistrationOpen(false)
                patientInfoForm.resetFields()
                setPatientName('')
                setPatientAvatar('')
                renderRegistrationTable()
            }
        } catch (e) {
            console.log(e)
            message.error('发生未知错误，请联系管理员')
        }
    }

    // 折叠面板里的医生表格的列
    const doctorColumns: ColumnsType<DoctorType> = [
        {
            title: '员工号',
            dataIndex: 'id',
            key: 'id',
            width: 90,
            fixed: 'left',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 90,
            fixed: 'left',
        },
        {
            title: '岗位',
            dataIndex: 'position',
            key: 'position',
            width: 90,
        },
        {
            title: '部门',
            width: 90,
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: '科室',
            width: 90,
            dataIndex: 'dentalDepartment',
            key: 'dentalDepartment',
        },
        {
            title: '性别',
            width: 90,
            dataIndex: 'gender',
            key: 'gender',
        },

        {
            title: '在职状态',
            width: 80,
            dataIndex: 'employmentStatus',
            key: 'employmentStatus',
        },
        {
            title: '职称',
            width: 80,
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '手机号码',
            width: 160,
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '职业证书号',
            width: 160,
            dataIndex: 'professionalLicenseNo',
            key: 'professionalLicenseNo',
        },
        {
            title: '电子邮件',
            width: 160,
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '出生日期',
            width: 140,
            dataIndex: 'birthDate',
            key: 'birthDate',
        },
        {
            title: '入职日期',
            width: 140,
            dataIndex: 'hireDate',
            key: 'hireDate',
        },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 1,
            render: (record) => (
                <Flex justify="right">
                    <Space>
                        <Button onClick={() => handleChooseDoctor(record)}>选择</Button>
                    </Space>
                </Flex>
            ),
        },
    ];
    //新增挂号里面的折叠面板选项
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: '患者信息',
            extra:
                <Button
                    style={{position: "absolute", right: 35, top: "50%", translate: "0 -50%"}}
                    type={"primary"}
                    onClick={(event) => {
                        event.stopPropagation();
                        setIsChoosePatientModalOpen(true)
                    }}
                >
                    选择患者
                </Button>,
            children: (
                <>
                    <Modal title="选择患者" open={isChoosePatientModalOpen}
                           onCancel={handleChoosePatientModalCancel}
                           footer={null}
                           width={1200}
                    >
                        <Search placeholder="请输入患者" onSearch={onPatientSearch} enterButton/>
                        <List
                            itemLayout="horizontal"
                            dataSource={patientList}
                            style={{height: "500px", overflow: "scroll"}}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={item.avatar ? <Avatar
                                                src={`data:image/jpeg;base64,${item.avatar}`}/> :
                                            <Avatar icon={<UserOutlined/>}/>}
                                        title={<a onClick={async () => {
                                            const response = await getPatient(item.id)
                                            if (response.status === 200 && response.data.success === true) {
                                                console.log(response)
                                                setPatientName(response.data.data.name)
                                                setPatientAvatar(response.data.data.avatar)
                                                setPatientType(response.data.data.patientTypeName)
                                                patientInfoForm.setFieldValue('patientId', response.data.data.id)
                                                patientInfoForm.setFieldValue('lastDoctor', response.data.data.lastDoctor)
                                                setIsChoosePatientModalOpen(false)
                                                message.success('选择成功')
                                            }
                                            const getMaxIdResponse = await getMaxRegistrationID()
                                            if (getMaxIdResponse.status === 200 && getMaxIdResponse.data.success === true) {
                                                if (getMaxIdResponse.data.data !== null) {
                                                    const newId = getMaxIdResponse.data.data.id + 1
                                                    patientInfoForm.setFieldValue('id', newId)
                                                } else {
                                                    patientInfoForm.setFieldValue('id', 1)
                                                }
                                            }

                                        }}>{item.name}</a>}
                                        description={
                                            <>
                                                {item.gender && (
                                                    <Tag color={
                                                        item.gender === "MALE" ? "blue" :
                                                            item.gender === "FEMALE" ? "pink" : "gray"
                                                    }>
                                                        {item.gender === "MALE" ? "性别：男" :
                                                            item.gender === "FEMALE" ? "性别：女" : "性别：未知"}
                                                    </Tag>
                                                )}
                                                {item.phone && <Tag color="green">电话: {item.phone}</Tag>}
                                                {item.patientNotes &&
                                                    <Tag color={"orange"}>备注：{item.patientNotes}</Tag>}
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />

                    </Modal>
                    <Flex vertical={true} justify={"center"} align={"center"}>
                        <Avatar className={style.drawerItemSpace} size={"large"}
                                src={`data:image/jpeg;base64,${patientAvatar}`}></Avatar>
                        <Alert className={style.drawerItemSpace} message={patientName} type="info"/>
                        <Row>
                            <Space size={"large"}>
                                <Form.Item label="病例号" name="id">
                                    <Input disabled={true}></Input>
                                </Form.Item>
                                <Form.Item label="客户号" name="patientId"
                                           rules={[{required: true, message: "请选择患者"}]}>
                                    <Input disabled={true}></Input>
                                </Form.Item>
                            </Space>
                        </Row>
                        <Row>
                            <Space size={"large"}>
                                <Form.Item name="employeeId" hidden>
                                    <Input/>
                                </Form.Item>
                                <Form.Item className={style.textForm} label={"接诊医生"} name="doctor"
                                           rules={[{required: true, message: "请在下方选择接诊医生"}]}>
                                    <Input variant="borderless" className={style.disabledColor} disabled={true}/>
                                </Form.Item>
                                <Form.Item className={style.textForm} label={"上次接诊医生"} name="lastDoctor">
                                    <Input variant="borderless" className={style.disabledColor} disabled={true}/>
                                </Form.Item>
                                <Form.Item className={style.textForm} label="患者类型">
                                    <span>{patientType}</span>
                                </Form.Item>
                                <Form.Item name="visitingType" label="就诊类型"
                                           rules={[{required: true, message: "请选择就诊类型"}]}>
                                    <Radio.Group>
                                        <Radio value="FIRST_VISIT">初诊</Radio>
                                        <Radio value="FOLLOW_UP">复诊</Radio>
                                        <Radio value="RE_EXAMINATION">复查</Radio>
                                        <Radio value="CONSULTATION">咨询</Radio>
                                    </Radio.Group>
                                </Form.Item>

                            </Space>
                        </Row>
                        <Row>
                            <Space size={"large"}>
                                {/*<Form.Item className={style.textForm} label={"咨询师"} name="counselor">*/}
                                {/*    <Input variant="borderless" disabled={true} />*/}
                                {/*</Form.Item>*/}
                                {/*<Form.Item className={style.textForm} label={"上次咨询师"} name="lastCounselor">*/}
                                {/*    <Input variant="borderless" disabled={true} />*/}
                                {/*</Form.Item>*/}

                            </Space>
                        </Row>

                    </Flex>


                </>
            ),
        },
        {
            key: '2',
            label: '接诊医生',
            children: (
                <>
                    <Search placeholder="请输入医生" onSearch={onDoctorSearch} enterButton style={{width: "200px"}}/>
                    <Table
                        style={{marginTop: "10px"}}
                        size={"small"}
                        pagination={false}
                        bordered={true}
                        columns={doctorColumns}
                        dataSource={doctorData}
                        scroll={{x: 'max-content', y: '48vh'}}
                        className={style.centerHead}
                    />
                    <Pagination
                        current={doctorTablePage}
                        pageSize={doctorTablePageSize}
                        total={doctorTableTotal}
                        showQuickJumper
                        showSizeChanger
                        pageSizeOptions={[10, 20, 30, 40, 50, 100]}
                        showTotal={(total) => `共 ${total} 条`}
                        onChange={handleChangePage}
                        style={{marginTop: '10px'}}
                    />
                </>
            ),
        }
    ];

    return (
        <>
            <div style={{padding: '16px 16px 0 16px'}}>
                <Space size="large" style={{marginBottom: 16}}>
                    <Button className={style.buttonSpace} icon={<PlusOutlined/>}
                            onClick={clickAddRegistration}>新增挂号</Button>
                    <Button className={style.buttonSpace} danger={true}
                            onClick={clearRegistrationConditions}>清空条件</Button>
                    <Button className={style.buttonSpace} type={"primary"} onClick={searchRegistration}>搜索</Button>
                </Space>
                <Form
                    form={registrationConditions}
                >
                    <Row className={style.minFormWidth}>
                        <Space size="large">
                            <Form.Item
                                label="挂号时间" name="createdAt"
                            >
                                <RangePicker className={style.customRange} presets={rangePresets}
                                             onChange={onRangeChange}/>
                            </Form.Item>
                            <Form.Item
                                label="患者" name="patientQuery">
                                <Input allowClear></Input>
                            </Form.Item>
                            <Form.Item
                                label="医生" name="doctorQuery">
                                <Input allowClear></Input>
                            </Form.Item>
                            <Form.Item label="就诊类型" name="visitingType">
                                <Select
                                    allowClear
                                    style={{width: "120px"}}
                                >
                                    <Option value="FIRST_VISIT">初诊</Option>
                                    <Option value="FOLLOW_UP">复诊</Option>
                                    <Option value="RE_EXAMINATION">复查</Option>
                                    <Option value="CONSULTATION">咨询</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="挂号状态" name="status">
                                <Select
                                    allowClear
                                    style={{width: "120px"}}
                                >
                                    <Option value="REGISTERED">已挂号</Option>
                                    <Option value="VISITED">已就诊</Option>
                                    <Option value="CANCELLED">已取消</Option>
                                </Select>
                            </Form.Item>
                        </Space>
                    </Row>
                </Form>
                <Table
                    size={"small"}
                    pagination={false}
                    bordered={true}
                    columns={registrationColumns}
                    dataSource={registrationData}
                    scroll={{x: 'max-content', y: '64vh'}}
                    // className={`${style.centerHead} ${style.minFormWidth}`}
                />
                <Pagination
                    current={registrationTablePage}
                    pageSize={registrationTablePageSize}
                    total={registrationTableTotal}
                    showQuickJumper
                    showSizeChanger
                    pageSizeOptions={[10, 20, 30, 40, 50, 100]}
                    showTotal={(total) => `共 ${total} 条`}
                    onChange={handleRegistrationChangePage}
                    style={{marginTop: '10px'}}
                />
            </div>
            <Drawer
                title={isRegistrationEdit ? '编辑挂号' : '新增挂号'}
                placement={"top"}
                open={registrationOpen}
                onClose={onRegistrationClose}
                height={"100%"}
                footer={
                    <div className={style.bottomButton}>
                        <Space size={"large"}>
                            <span>{currentTime}</span>
                            <Button type={"primary"} onClick={clickSaveRegistration}>保存</Button>
                            <Button onClick={onRegistrationClose}>取消</Button>
                        </Space>
                    </div>
                }
            >
                <style>
                    {`.ant-drawer-header {background: linear-gradient(to right, #9ED2EF, #A1ECC8);padding-left:10px !important;padding-right:10px !important`}
                </style>
                <Form form={patientInfoForm} onFinish={saveRegistration} onFinishFailed={() => {
                    message.error('请完成必要的选择')
                }}>
                    <Collapse className={style.minCollapseWidth} size="small" items={items}
                              defaultActiveKey={['1', '2']} expandIconPosition={"end"}
                              onChange={onChange}/>
                </Form>
            </Drawer>
        </>
    )
}

export default RegistrationManagement
