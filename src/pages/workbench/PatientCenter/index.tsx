import React, {useEffect, useState} from "react";
import {Layout, Button, Form, Row, Input, Space, Table, Pagination, Popconfirm, App, Flex, Avatar} from 'antd';
import {QuestionCircleOutlined, UserOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {deletePatient, getPatient, getPatients} from "../../../api/patient";
import areaData from 'china-area-data/v5/data';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../store";
import {openPatientDrawer, setPatientEditOn, setPatientObj} from "../../../store/actions/actions";
import {exportToExcel} from "./toExcel";

const {Header, Footer, Sider, Content} = Layout;
const PatientCenter = () => {
    const [patientSearch] = Form.useForm()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [patientId, setPatientId] = useState()
    const [name, setName] = useState()
    const [phone, setPhone] = useState()
    const [idCardNo, setIdCardNo] = useState()
    const [isTodayOnly, setIsTodayOnly] = useState(false)
    const [sortOrder, setSortOrder] = useState()
    const [sortColumn, setSortColumn] = useState()
    const {message} = App.useApp();
    const navigate = useNavigate();

    interface PatientDataType {
        id: number;
        avatar: any;
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
    const renderPatient = useSelector((state: AppState) => state.renderPatient)
    const handleEditPatient = async (record: PatientDataType) => {
        dispatch(openPatientDrawer())
        dispatch(setPatientEditOn())
        const id = record.id
        try {
            const response = await getPatient(id)
            if (response.status === 200) {
                let patient = response.data.data
                if (patient.birthDate) {
                    patient.birthDate = dayjs(patient.birthDate)
                }
                if (patient.createdAt) {
                    patient.createdAt = dayjs(patient.createdAt)
                }
                if (patient.addressProvince) {
                    patient.address = []
                    patient.address.push(patient.addressProvince)
                    delete patient.addressProvince
                    if (patient.addressCity) {
                        patient.address.push(patient.addressCity)
                        delete patient.addressCity
                        if (patient.addressDistrict) {
                            patient.address.push(patient.addressDistrict)
                            delete patient.addressDistrict
                        }
                    }
                    console.log(patient.address)
                }
                if (patient.avatar) {
                    delete patient.avatar
                }
                console.log(patient)
                dispatch(setPatientObj(patient))
            }
        } catch (error) {
            console.error(error)
            handleToken(error)
        }
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

        getPatients(page, pageSize, patientId, name, phone, idCardNo, isTodayOnly, sortColumn, sortOrder)
            .then(response => {
                if (response.status === 200) {
                    let patients = response.data.data
                    setTotal(response.data.total)
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
                        // console.log('getPatients avatar',formattedPatient.avatar)
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
    }, [page, pageSize, patientId, name, phone, idCardNo, renderPatient, isTodayOnly, sortOrder, sortColumn])

    const onPatientSearchFinish = () => {
        const data = patientSearch.getFieldsValue();
        console.log(data)
        const {id, name, phone, idCardNo} = data
        setPatientId(id)
        setName(name)
        setPhone(phone)
        setIdCardNo(idCardNo)
    }

    const onTodayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPage(1)
        setIsTodayOnly(e.target.checked)
    }
    const onPatientSearchFinishFailed = (errorInfo: object) => {
        console.log('Failed:', errorInfo);
    }

    const handleChangePage = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }

    const clickName = (record: any) => {
        const id = record.id
    }


    const [patientData, setPatientData] = useState<PatientDataType[]>([]);
    const patientColumns: ColumnsType<PatientDataType> = [
        {
            title: '客户号',
            width: 90,
            dataIndex: 'id',
            key: 'id',
            fixed: "left",
            sorter: true,
        },
        {
            title: '患者',
            width: 120,
            dataIndex: 'name',
            key: 'name',
            fixed: "left",
            sorter: true,
            render: (text, record) => (
                <Space>
                    {record.avatar ? <Avatar shape="square" src={`data:image/jpeg;base64,${record.avatar}`}/> :
                        <Avatar shape="square" icon={<UserOutlined/>}/>}
                    {<a onClick={() => clickName(record)}>{text}</a>}
                </Space>
            ),
        },
        {
            title: '患者类型',
            width: 90,
            dataIndex: 'patientType',
            key: 'patientType',
            sorter: true,
        },
        {
            title: '咨询项目',
            width: 90,
            dataIndex: 'consultationProject',
            key: 'consultationProject',
            sorter: true,
        },
        {
            title: '受理人',
            width: 90,
            dataIndex: 'acceptancePerson',
            key: 'acceptancePerson',
            sorter: true,
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
            sorter: true,
        },
        {
            title: '出生日期',
            width: 150,
            dataIndex: 'birthDate',
            key: 'birthDate',
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
            width: 250,
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
            sorter: true,
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


    const handleTableChange = (sorter: any) => {
        const {columnKey, order} = sorter;
        setSortOrder(order)
        setSortColumn(columnKey)
    };


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
                    <Row style={{minWidth: "800px"}}>
                        <Form.Item label="仅显示今日新增患者" name="onlyTody">
                            <Input style={{width: "15px", height: "15px"}} checked={isTodayOnly} type="checkbox"
                                   onChange={onTodayChange}/>
                        </Form.Item>
                        <Button style={{marginLeft: "10px"}} type={"primary"}
                                onClick={() => exportToExcel(patientData, 'patients')}>
                            导出为 Excel
                        </Button>
                    </Row>
                    <Row style={{minWidth: "785px"}}>
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
                            <Form.Item label="身份证号" name="idCardNo">
                                <Input style={{width: "180px", textAlign: "center"}}/>
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={() => {
                                    patientSearch.submit()
                                }} type={"primary"}>搜索</Button>
                            </Form.Item>
                        </Space>
                    </Row>

                </Form>

                <Table
                    style={{minWidth: "440px"}}
                    size={"small"}
                    pagination={false}
                    bordered={true}
                    columns={patientColumns}
                    dataSource={patientData}
                    scroll={{x: "max-content", y: '64vh'}}
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

export default PatientCenter