import React, {useEffect, useState} from "react";
import {
    Alert, App,
    Avatar,
    Button,
    Collapse,
    CollapseProps,
    DatePicker,
    Drawer, Flex,
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
import {addRegistration, getMaxRegistrationID} from "../../../api/registration";
import type {ColumnsType} from "antd/es/table";
import {getEmployees} from "../../../api/employee";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} = Input;


const RegistrationManagement = () => {
    const {message} = App.useApp();
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
        setPage(1)
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
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const handleChooseDoctor = (record: any) => {
        console.log(record)
        const {id, name} = record
        patientInfoForm.setFieldValue('employeeId', id)
        patientInfoForm.setFieldValue('doctor', name)
    }
    const handleChangePage = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
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

        getEmployees(page, pageSize, 'DOCTOR', doctorSearchValue)
            .then(response => {
                if (response.status === 200) {
                    let doctors = response.data.data
                    setTotal(response.data.total)
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
    }, [page, pageSize, doctorSearchValue])
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
                </>
            ),
        }
    ];

    const clickAddRegistration = () => {
        setRegistrationOpen(true)
        renderDoctorTable()
    }
    const onRegistrationClose = () => {
        setRegistrationOpen(false)
    }
    const onChange = (key: string | string[]) => {
        console.log(key);
    };

    const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleString())
    useEffect(() => {
        // 每秒更新时间
        const timerId = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);

        // 组件卸载时清除定时器
        return () => clearInterval(timerId);
    }, []);

    const clickSaveRegistration = () => {
        patientInfoForm.submit()
    }

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
        } catch (e) {
            console.log(e)
            message.error('发生未知错误，请联系管理员')
        }
    }

    return (
        <>
            <div style={{padding: '16px 16px 0 16px'}}>
                <Space size="large" style={{marginBottom: 16}}>
                    <Button className={style.buttonSpace} icon={<PlusOutlined/>}
                            onClick={clickAddRegistration}>新增挂号</Button>
                    <Button className={style.buttonSpace} danger={true}>清空条件</Button>
                    <Button className={style.buttonSpace} type={"primary"}>搜索</Button>
                </Space>
                <Form>
                    <Row className={style.minFormWidth}>
                        <Space size="large">
                            <Form.Item
                                label="预约时间" name="appointmentTime"
                            >
                                <RangePicker className={style.customRange} presets={rangePresets}
                                             onChange={onRangeChange}/>
                            </Form.Item>
                            <Form.Item
                                label="患者" name="patientName">
                                <Input allowClear></Input>
                            </Form.Item>
                            <Form.Item
                                label="医生" name="DoctorName">
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
                    <Row>
                        <Space>

                        </Space>
                    </Row>

                </Form>
                <Table></Table>
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
                            <Button onClick={() => {
                                setRegistrationOpen(false)
                            }}>取消</Button>
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