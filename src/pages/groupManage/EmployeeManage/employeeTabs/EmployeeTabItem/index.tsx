import React, {useEffect, useState} from "react";
import {
    Button,
    Drawer,
    Layout,
    Space,
    Form,
    Input,
    Select,
    DatePicker,
    Row,
    Col,
    Table,
    Popconfirm, Pagination, App, Modal, Flex,
} from "antd";
import {PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import 'dayjs/locale/zh-cn';
import {
    addEmployee,
    deleteEmployee,
    editEmployee,
    getEmployee,
    getEmployees,
    getMaxEmployeeID
} from "../../../../../api/employee";
import type {ColumnsType} from 'antd/es/table';
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {addRole, getRoles} from "../../../../../api/role";
import {editUser, findByEmployee, register} from "../../../../../api/user";


const EmployeeTabItem = () => {
    interface EmployeeDataType {
        key: React.Key;
        id: number;
        name?: string;
        position?: string;
        department?: string;
        dentalDepartment?: string;
        gender?: string;
    }

    const [employeeData, setEmployeeData] = useState<EmployeeDataType[]>([]);
    const employeeColumns: ColumnsType<EmployeeDataType> = [
        {
            title: '员工号',
            width: 90,
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '姓名',
            width: 90,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '岗位',
            width: 90,
            dataIndex: 'position',
            key: 'position',
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
            title: '地址',
            width: 180,
            dataIndex: 'address',
            key: 'address',
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
            render: (record) => (
                <Flex justify="right">
                    <Space>
                        {record.id !== 1 && <Button onClick={() => handleConfigureUser(record)}>账号配置</Button>}
                        <Button onClick={() => handleEditEmployee(record)}>编辑</Button>
                        <Popconfirm
                            title="提示"
                            description="确定要删除此员工信息？"
                            okText="确定"
                            cancelText="取消"
                            placement="topRight"
                            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                            onConfirm={() => handleDeleteEmployee(record)}
                        >
                            <Button danger>删除</Button>
                        </Popconfirm>
                    </Space>
                </Flex>
            ),

        },
    ];
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [employeeOpen, setEmployeeOpen] = useState(false)
    const [isEmployeeEdit, setIsEmployeeEdit] = useState(false)
    const [employeeForm] = Form.useForm();
    const {message} = App.useApp();
    const navigate = useNavigate();
    const handleToken = (error: any) => {
        if (error.response.status === 401) {
            message.warning('未登录，请先登录')
            navigate('/login')
        } else if (error.response.status === 403) {
            message.warning('登录已过期，请重新登录')
            navigate('/login')
        }
    }

    // 渲染列表
    const renderEmployeeTable = () => {
        interface Employee {
            id: number;
            name: string;
            position: string;
            department: string;
            dentalDepartment: string;
            gender: string;
            hireDate?: string;
            birthDate?: string;
        }

        getEmployees(page, pageSize)
            .then(response => {
                if (response.status === 200) {
                    let employees = response.data.data
                    setTotal(response.data.total)
                    setEmployeeData(employees.map((employee: Employee) => {
                        const formattedEmployee = {
                            ...employee,
                            key: employee.id,
                        };
                        if (employee.hireDate) {
                            formattedEmployee.hireDate = dayjs(employee.hireDate).format('YYYY年MM月DD日');
                        }
                        if (employee.birthDate) {
                            formattedEmployee.birthDate = dayjs(employee.birthDate).format('YYYY年MM月DD日');
                        }
                        return formattedEmployee;
                    }))
                }
            })
            .catch(error => {
                handleToken(error)
            })
    }

    useEffect(() => {
        console.log(('effect'))
        renderEmployeeTable()
    }, [page, pageSize])

    //点击新增员工按钮
    const clickAddEmployee = async () => {
        setIsEmployeeEdit(false)
        setEmployeeOpen(true)
        try {
            const response = await getMaxEmployeeID();
            if (response.status === 200) {
                if (response.data.data && response.data.data.id) {
                    const newID = response.data.data.id + 1;
                    employeeForm.setFieldValue('id', newID);
                } else {
                    employeeForm.setFieldValue('id', 1);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };


    // 点击编辑
    const handleEditEmployee = async (record: EmployeeDataType) => {
        setIsEmployeeEdit(true)
        setEmployeeOpen(true)
        let id = record.id
        try {
            const response = await getEmployee(id)
            if (response.status === 200) {
                let oldEmployee = response.data.data
                if (oldEmployee.birthDate) {
                    oldEmployee.birthDate = dayjs(oldEmployee.birthDate)
                }
                if (oldEmployee.hireDate) {
                    oldEmployee.hireDate = dayjs(oldEmployee.hireDate)
                }
                employeeForm.setFieldsValue(oldEmployee)
            }
        } catch (error) {
            console.error(error)
            handleToken(error)
        }
    }

    // 处理删除员工
    const handleDeleteEmployee = async (record: EmployeeDataType) => {
        let id = record.id
        try {
            const response = await deleteEmployee(id)
            if (response.status === 200) {
                const newTotal = total - 1;
                const newTotalPages = Math.ceil(newTotal / pageSize);

                if (page > newTotalPages) {
                    // 如果当前页超过了新的总页数，将页码减一
                    setPage(newTotalPages);
                } else {
                    renderEmployeeTable()
                }

                message.success('删除成功')
            }
        } catch (error) {
            console.error(error);
            handleToken(error)
            message.error('删除失败')
        }
    }


    // 取消
    const onEmployeeClose = () => {
        employeeForm.resetFields();
        setEmployeeOpen(false);
    };
    // const addDepartment = () => {
    //     console.log('click addDepartment')
    // }

    // 表单确认
    const onEmployeeFinish = async () => {
        try {
            const data = employeeForm.getFieldsValue();
            data.id = Number(data.id);
            if (isEmployeeEdit) {
                const editResponse = await editEmployee(data)
                if (editResponse.status === 200) {
                    message.success('编辑成功')
                    renderEmployeeTable();
                    onEmployeeClose();
                } else {
                    message.error('编辑失败')
                }
            } else {
                const addResponse = await addEmployee(data);
                if (addResponse.status === 200) {
                    message.success('添加成功')
                    renderEmployeeTable();
                    onEmployeeClose();
                }
            }
        } catch (error) {
            console.error(error);
            handleToken(error)
            message.error('添加失败')
        }
    };


    // 表单确认失败
    const onEmployeeFinishFailed = (errorInfo: object) => {
        message.warning('请完成必要字段的填写')
        console.log('Failed:', errorInfo);
    };

    const handleChangePage = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }

    const [isAccountOpen, setIsAccountOpen] = useState(false)
    const [isExistAccount, setIsExistAccount] = useState(false)
    const [roleOptions, setRoleOptions] = useState([])
    const [accountForm] = Form.useForm()

    useEffect(() => {
        getRoles(1, 100)
            .then(response => {
                if (response.status === 200) {
                    const roles = response.data.data
                    const roleOptionsArr = roles.map((role: any) => {
                        return {
                            label: role.roleName,
                            value: role.id
                        }
                    })
                    setRoleOptions(roleOptionsArr)
                }
            })
            .catch(error => {
                console.error(error)
            })
    }, [])


    const handleConfigureUser = async (record: EmployeeDataType) => {
        try {
            const employeeId = record.id
            const userResponse = await findByEmployee({employeeId})
            if (userResponse.status === 200) {
                if (userResponse.data.success === true) {
                    message.warning('已存在账户信息，请配置')
                    setIsExistAccount(true)
                    const user = userResponse.data.data
                    accountForm.setFieldsValue(user)

                } else {
                    message.warning('暂未配置用户信息，请配置')
                    setIsExistAccount(false)
                    accountForm.setFieldValue('employeeId',employeeId)
                }
                setIsAccountOpen(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleAccountCancel = () => {
        setIsAccountOpen(false);
        accountForm.resetFields()
    };
    const onAccountFinish = async () => {
        try {
            const data = accountForm.getFieldsValue();
            console.log(data)
            if (isExistAccount) {
                //     编辑
                const response = await editUser(data)
                if (response.status === 200) {
                    message.success('配置成功')
                    setIsAccountOpen(false)
                    accountForm.resetFields()
                }
            } else {
                //     注册
                const response = await register(data)
                if (response.status === 200) {
                    message.success('配置成功')
                    setIsAccountOpen(false)
                    accountForm.resetFields()
                }
            }

        } catch (error) {
            console.error(error);
            message.error('配置失败')
        }
    }

    const onAccountFinishFailed = (errorInfo: object) => {
        message.warning('请完成必要字段的填写')
        console.log('Failed:', errorInfo);
    }


    return (
        <>
            <div style={{padding: '16px 16px 0 16px'}}>
                <Space size="large" style={{marginBottom: 16}}>
                    {/*<Button icon={<PlusOutlined/>} onClick={addDepartment}>新增部门</Button>*/}
                    <Button icon={<PlusOutlined/>} onClick={clickAddEmployee}>新增员工</Button>
                </Space>
                <Modal title="配置账号信息" open={isAccountOpen} onOk={() => {
                    accountForm.submit()
                }} onCancel={handleAccountCancel}>
                    <Form
                        form={accountForm}
                        onFinish={onAccountFinish}
                        onFinishFailed={onAccountFinishFailed}
                    >
                        <Form.Item
                            rules={[{required: true}]}
                            label="账户" name="username">
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            rules={[{required: true}]}
                            label="密码" name="password">
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="昵称" name="name">
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="手机号码" name="phone">
                            <Input type="number"/>
                        </Form.Item>
                        <Form.Item
                            label="用户角色" name="roleId">
                            <Select
                                options={roleOptions}
                            />
                        </Form.Item>
                        <Form.Item
                            style={{display:"none"}}
                            label="userId" name="id">
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            style={{display:"none"}}
                            label="employeeId" name="employeeId">
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Table size={"small"}
                       pagination={false}
                       bordered={true}
                       columns={employeeColumns}
                       dataSource={employeeData}
                       scroll={{x: 'max-content', y: '64vh'}}
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
                <Drawer size={"large"}
                        title={isEmployeeEdit ? '编辑员工信息' : '新增员工'}
                        placement="right"
                        closable={false}
                        onClose={onEmployeeClose}
                        open={employeeOpen}
                        extra={
                            <Space size={"middle"}>
                                <Button type="primary" onClick={() => {
                                    employeeForm.submit();
                                }}>
                                    确定
                                </Button>
                                <Button onClick={onEmployeeClose}>取消</Button>
                            </Space>
                        }>
                    <style>
                        {`.ant-drawer-header {background: linear-gradient(to right, #9ED2EF, #A1ECC8);padding-left:10px !important;padding-right:10px !important`}
                    </style>
                    <Layout style={{
                        backgroundColor: '#DFDFDF',
                        padding: "7.5px 10px",
                        marginBottom: "10px",
                        borderRadius: "5px"
                    }}>个人信息</Layout>
                    <Form
                        form={employeeForm}
                        name="basic"
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
                        style={{maxWidth: 716}}
                        initialValues={{remember: true}}
                        onFinish={onEmployeeFinish}
                        onFinishFailed={onEmployeeFinishFailed}
                        autoComplete="off"
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    rules={[{required: true}]}
                                    label="员工号" name="id">
                                    <Input type='number' disabled={isEmployeeEdit}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    rules={[{required: true}]}
                                    label="姓名" name="name">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    rules={[{required: true}]}
                                    label="岗位" name="position">
                                    <Select>
                                        <Select.Option value="ADMINISTRATOR">管理员</Select.Option>
                                        <Select.Option value="DOCTOR">医生</Select.Option>
                                        <Select.Option value="NURSE">护士</Select.Option>
                                        <Select.Option value="FRONT_DESK">前台</Select.Option>
                                        <Select.Option value="ADMINISTRATIVE">行政</Select.Option>
                                        <Select.Option value="FINANCE">财务</Select.Option>
                                        <Select.Option value="ASSISTANT">助理</Select.Option>
                                        <Select.Option value="COUNSELOR">咨询师</Select.Option>
                                        <Select.Option value="CUSTOMER_SERVICE">客服</Select.Option>
                                        <Select.Option value="PROCUREMENT">采购</Select.Option>
                                        <Select.Option value="WAREHOUSE_KEEPER">库管</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    rules={[{required: true}]}
                                    label="部门" name="department">
                                    <Select>
                                        <Select.Option value="MEDICAL">医疗部</Select.Option>
                                        <Select.Option value="COUNSELING">咨询部</Select.Option>
                                        <Select.Option value="OPERATIONS">经营部</Select.Option>
                                        <Select.Option value="LOGISTICS">后勤部</Select.Option>
                                        <Select.Option value="FINANCE">财务部</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    rules={[{required: true}]}
                                    label="牙医科室" name="dentalDepartment">
                                    <Select>
                                        <Select.Option value="GENERAL_DENTISTRY">综合牙科</Select.Option>
                                        <Select.Option value="DENTAL_IMPLANTATION">牙医种植</Select.Option>
                                        <Select.Option value="DENTAL_ORTHODONTICS">牙医正畸</Select.Option>
                                        <Select.Option value="DENTAL_RESTORATION">牙医修复</Select.Option>
                                        <Select.Option value="DENTAL_CARE">牙医护理</Select.Option>
                                        <Select.Option value="CHILDRENS_TEETH">儿童牙科</Select.Option>
                                        <Select.Option value="PERIODONTAL">牙周科</Select.Option>
                                        <Select.Option value="ORTHODONTICS">矫正科</Select.Option>
                                        <Select.Option value="TOOTH_EXTRACTION">牙齿拔除</Select.Option>
                                        <Select.Option value="TOOTH_INLAY">牙齿镶嵌</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    rules={[{required: true}]}
                                    label="性别" name="gender">
                                    <Select>
                                        <Select.Option value="MALE">男</Select.Option>
                                        <Select.Option value="FEMALE">女</Select.Option>
                                        <Select.Option value="UNKNOWN">未知</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row>
                            <Col span={12}>
                                <Form.Item label="手机号码" name="phone">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="电子邮箱" name="email">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12}>

                                <Form.Item label="职业证书号" name="professionalLicenseNo">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="职称" name="title">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row>
                            <Col span={12}>
                                <Form.Item label="在职状态" name="employmentStatus">
                                    <Select>
                                        <Select.Option value="ACTIVE">在职</Select.Option>
                                        <Select.Option value="ON_LEAVE">休假</Select.Option>
                                        <Select.Option value="RESIGNED">离职</Select.Option>
                                        <Select.Option value="PROBATION">试用期</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="家庭住址" name="address">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12}>
                                <Form.Item label="出生日期" name="birthDate">
                                    <DatePicker/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="入职日期" name="hireDate">
                                    <DatePicker/>
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </Drawer>

            </div>
        </>
    )
}

export default EmployeeTabItem