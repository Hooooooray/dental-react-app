import React, {useState} from "react";
import {Button, Drawer, Layout, Space, Checkbox, Form, Input, Select, DatePicker, Row, Col, message,} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {addEmployee} from "../../../../api/employee";


const EmployeeTabItem = () => {
    const [employeeOpen, setEmployeeOpen] = useState(false)
    const [employeeForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onEmployeeClose = () => {
        setEmployeeOpen(false);
    };
    const addDepartment = () => {
        console.log('click addDepartment')
    }
    const onEmployeeFinish = (values: object) => {
        console.log('Success:', values);
        const data = employeeForm.getFieldsValue()
        data.employeeID = Number(data.employeeID)
        addEmployee(data)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
    };

    const onEmployeeFinishFailed = (errorInfo: object) => {
        messageApi.open({
            type: 'warning',
            content: '请完成必要字段的填写',
        });
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {contextHolder}
            <div style={{padding: '16px 0 0 16px'}}>
                <Space size="large">
                    <Button icon={<PlusOutlined/>} onClick={addDepartment}>新增部门</Button>
                    <Button icon={<PlusOutlined/>} onClick={() => setEmployeeOpen(true)}>新增员工</Button>
                </Space>
                <Drawer size={"large"}
                        title="新增员工"
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
                                    label="员工号" name="employeeID">
                                    <Input/>
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
                                <Form.Item label="入职日期" name="hireDate">
                                    <DatePicker/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="出生日期" name="birthDate">
                                    <DatePicker/>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/*<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>*/}

                    </Form>
                </Drawer>

            </div>
        </>
    )
}

export default EmployeeTabItem