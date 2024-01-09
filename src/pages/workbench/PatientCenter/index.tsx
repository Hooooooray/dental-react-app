import React, {useEffect, useState} from "react";
import {Layout, Flex, Button, Form, Col, Row, Input, Space, Table, Pagination, Popconfirm, App} from 'antd';
import {FormOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {useNavigate} from "react-router-dom";
import {getEmployees} from "../../../api/employee";
import dayjs from "dayjs";
import {deletePatient, getPatient} from "../../../api/patient";
import areaData from 'china-area-data/v5/data';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../store";
import {openDrawer} from "../../../store/actions/actions";

const {Header, Footer, Sider, Content} = Layout;
const PatientCenter = () => {
    const [patientSearch] = Form.useForm()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [patientId, setPatientId] = useState()
    const [name, setName] = useState()
    const [phone, setPhone] = useState()
    const {message} = App.useApp();
    const navigate = useNavigate();

    interface PatientDataType {
        id: number;
        key: React.Key;
    }

    const handleToken = (error: any) => {
        if (error.response.status === 401) {
            message.warning('未登录，请先登录')
            navigate('/login')
        } else if (error.response.status === 403) {
            message.warning('登录已过期，请重新登录')
            navigate('/login')
        }
    }

    const dispatch = useDispatch();
    const patientOpen = useSelector((state: AppState) => state.patientOpen);
    const handleEditPatient = (record: PatientDataType) => {
        dispatch(openDrawer())
    }

    const handleDeletePatient = async (record: PatientDataType) => {
        let id = record.id
        console.log(id)
        try {
            const response = await deletePatient(id)
            if (response.status === 200) {
                const newTotal = total - 1;
                const newTotalPages = Math.ceil(newTotal / pageSize);

                if (page > newTotalPages) {
                    // 如果当前页超过了新的总页数，将页码减一
                    setPage(newTotalPages);
                } else {
                    renderPatientTable()
                }

                message.success('删除成功')
            }
        } catch (error) {
            console.error(error);
            handleToken(error)
            message.error('删除失败')
        }
    }

    const renderPatientTable = () => {
        interface Patient {
            id: number;
            createdAt?: string;
            birthDate?: string;
            addressProvince?: string;
            addressDistrict?: string;
            addressCity?: string
        }

        getPatient(page, pageSize, patientId, name, phone)
            .then(response => {
                if (response.status === 200) {
                    let patients = response.data.data
                    setTotal(response.data.total)
                    console.log(response.data)
                    setPatientData(patients.map((patient: Patient) => {
                        const formattedPatient: any = {
                            ...patient,
                            key: patient.id,
                        };
                        if (patient.createdAt) {
                            formattedPatient.createdAt = dayjs(patient.createdAt).format('YYYY年MM月DD日');
                        }
                        if (patient.birthDate) {
                            formattedPatient.birthDate = dayjs(patient.birthDate).format('YYYY年MM月DD日');
                        }
                        if (patient.addressProvince || patient.addressCity || patient.addressDistrict) {
                            const addressProvinceCode: any = patient.addressProvince
                            const addressCityCode: any = patient.addressCity
                            const addressDistrictCode: any = patient.addressDistrict
                            const addressProvince = areaData['86'][addressProvinceCode]
                            const addressCity = areaData[addressProvinceCode][addressCityCode]
                            const addressDistrict = areaData[addressCityCode][addressDistrictCode]
                            formattedPatient.address = `${addressProvince} ${addressCity} ${addressDistrict}`
                        }
                        return formattedPatient;
                    }))
                }
            })
            .catch(error => {
                handleToken(error)
            })
    }

    useEffect(() => {
        console.log(('effect'))
        renderPatientTable()
    }, [page, pageSize, patientId, name, phone])

    const onPatientSearchFinish = () => {
        const data = patientSearch.getFieldsValue();
        console.log(data)
        const {id, name, phone} = data
        setPatientId(id)
        setName(name)
        setPhone(phone)
    }
    const onPatientSearchFinishFailed = () => {

    }


    const handleChangePage = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }


    const [patientData, setPatientData] = useState<PatientDataType[]>([]);
    const patientColumns: ColumnsType<PatientDataType> = [
        {
            title: '客户号',
            width: 90,
            dataIndex: 'id',
            key: 'id',
            fixed: "left"
        },
        {
            title: '患者',
            width: 90,
            dataIndex: 'name',
            key: 'name',
            fixed: "left"
        },
        {
            title: '患者类型',
            width: 90,
            dataIndex: 'patientType',
            key: 'patientType',
        },
        {
            title: '咨询项目',
            width: 90,
            dataIndex: 'consultationProject',
            key: 'consultationProject',
        },
        {
            title: '受理人',
            width: 90,
            dataIndex: 'acceptancePerson',
            key: 'acceptancePerson',
        },
        {
            title: '身份证号',
            width: 90,
            dataIndex: 'idCardNo',
            key: 'idCardNo',
        },
        {
            title: '性别',
            width: 90,
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '出生日期',
            width: 150,
            dataIndex: 'birthDate',
            key: 'birthDate',
        },
        {
            title: '创建时间',
            width: 150,
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: '联系电话',
            width: 160,
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '介绍人',
            width: 90,
            dataIndex: 'refereerName',
            key: 'refereerName',
        },
        {
            title: '家庭住址',
            width: 220,
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '详细地址',
            width: 90,
            dataIndex: 'addressDetail',
            key: 'addressDetail',
        },
        {
            title: '昵称',
            width: 90,
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '患者备注',
            width: 90,
            dataIndex: 'patientNotes',
            key: 'patientNotes',
        },
        {
            title: 'QQ',
            width: 90,
            dataIndex: 'qq',
            key: 'qq',
        },
        {
            title: '微信',
            width: 90,
            dataIndex: 'weChat',
            key: 'weChat',
        },
        {
            title: '电子邮箱',
            width: 90,
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '年龄',
            width: 90,
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '操作',
            key: 'operation',
            width: 200,
            fixed: 'right',
            render: (record) => (
                <Space>
                    <Button onClick={() => handleEditPatient(record)}>修改患者信息</Button>
                    <Popconfirm
                        title="提示"
                        description="确定要删除此患者信息？"
                        okText="确定"
                        cancelText="取消"
                        placement="topRight"
                        icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                        onConfirm={() => handleDeletePatient(record)}
                    >
                        <Button danger>删除患者</Button>
                    </Popconfirm>
                </Space>
            ),

        },
    ]


    return (
        <>
            <Sider width={174} style={{borderRight: "1px solid #EFEFEF", padding: "10px"}}>
                <Button type={"primary"} style={{width: "100%"}}>患者查询</Button>
            </Sider>
            <Content style={{padding: "10px"}}>
                <Form
                    form={patientSearch}
                    onFinish={onPatientSearchFinish}
                    onFinishFailed={onPatientSearchFinishFailed}
                >
                    <Row>
                        <Space>
                            <Form.Item
                                label="客户号" name="id">
                                <Input style={{width: "50px", textAlign: "center"}}/>
                            </Form.Item>
                            <Form.Item
                                label="姓名" name="name">
                                <Input style={{width: "100px", textAlign: "center"}}/>
                            </Form.Item>
                            <Form.Item label="手机号" name="phone">
                                <Input style={{width: "120px", textAlign: "center"}}/>
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={() => {
                                    patientSearch.submit()
                                }} type={"primary"}>搜索</Button>
                            </Form.Item>
                        </Space>
                    </Row>
                </Form>

                <Table size={"small"}
                       pagination={false}
                       bordered={true}
                       columns={patientColumns}
                       dataSource={patientData}
                       scroll={{x: "max-content", y: '64vh'}}
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

export default PatientCenter