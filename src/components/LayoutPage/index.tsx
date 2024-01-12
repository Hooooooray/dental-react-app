import React, {useEffect, useMemo, useRef, useState} from "react";
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import type {MenuProps, SelectProps, UploadFile, UploadProps} from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
    App,
    Button,
    Cascader,
    Col,
    DatePicker,
    Drawer,
    Form,
    Input,
    Layout,
    Menu,
    Modal,
    Radio,
    Row,
    Select,
    Space,
    Spin,
    Upload
} from 'antd';
// @ts-ignore
import debounce from 'lodash/debounce';
import style from './style.module.scss'
import {verifyUser} from "../../api/user";
import areaData from 'china-area-data/v5/data';
import {addPatient, editPatient, getMaxPatientID, searchPatients} from "../../api/patient";
import {FormOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {formatAreaData} from "./area";
import {RcFile, UploadChangeParam} from "antd/es/upload";
import {logoSrc} from "./logoSrc";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store";
import {closePatientDrawer, openPatientDrawer, renderPatient, setPatientEditClose} from "../../store/actions/actions";
import {addAppointment} from "../../api/appointment";
import {searchEmployees} from "../../api/employee";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const {TextArea} = Input;

const {Header} = Layout;

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 48,
    paddingInline: 0,
    lineHeight: '48px',
    background: `linear-gradient(to right, #9ED2EF, #A1ECC8)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        label,
        key,
        icon,
        children,
        type,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('今日工作', '/index'),
    getItem('工作台', '/workbench'),
    getItem('机构管理', '/groupManage')
]

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({fetchOptions, debounceTimeout = 500, ...props}: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            {...props}
            options={options}
        />
    );
}

// Usage of DebounceSelect
interface ListValue {
    label: string;
    value: string;
}




const LayoutPage = () => {
    const location = useLocation();
    const path = location.pathname.split('/')[1]
    const navigate = useNavigate();
    const {message} = App.useApp();
    const [name, setName] = useState('')
    const itemsUser: MenuItem[] = [
        {
            label: name,
            key: 'SubMenu',
            children: [
                {
                    type: 'group',
                    label: '账户管理',
                    children: [
                        // {
                        //     label: '个人资料',
                        //     key: 'profile',
                        // },
                        {
                            label: '退出登录',
                            key: 'logout',
                        },
                    ],
                },
            ],
        }
    ]

    // 认证用户信息
    useEffect(() => {
        verifyUser().then(res => {
            const user = res.data.data
            setName(user.name)
        }).catch(error => {
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                message.warning('登录信息过期请重新登录')
                navigate('/login')
            }
        })
    }, [])

    const handleMenuClick = (menu: any) => {
        const {key} = menu
        navigate(key)
    }

    // 处理用户点击
    const handleUserClick = (menu: any) => {
        const {key} = menu
        if (key === 'logout') {
            localStorage.removeItem('token')
            localStorage.removeItem('permissions')
            navigate('/login')
            message.success('退出成功，请重新登录')
        }
    }

    /*患者表单模块*/
    // 全局状态，新增患者，编辑患者的表单
    const [patientForm] = Form.useForm();
    const dispatch = useDispatch();
    const patientOpen = useSelector((state: AppState) => state.patientOpen);
    const isPatientEdit = useSelector((state: AppState) => state.isPatientEdit)
    let patinetObj = useSelector((state: AppState) => state.patientObj)

    useEffect(() => {
        if (isPatientEdit) {
            patientForm.setFieldsValue(patinetObj)
        }
    }, [patinetObj])
    const clickAddPatient = () => {
        handleAddonClick()
        dispatch(openPatientDrawer())
        dispatch(setPatientEditClose())
    }
    const onPatientClose = () => {
        patientForm.resetFields();
        dispatch(closePatientDrawer())
    };
    // 患者表单确认成功
    const onPatientFinish = async () => {
        try {
            const data = patientForm.getFieldsValue();
            data.id = Number(data.id)
            if (data.address) {
                const address = data.address
                data.addressProvince = address[0]
                data.addressCity = address[1]
                data.addressDistrict = address[2]
                delete data.address
            }
            if (data.age) {
                data.age = Number(data.age)
            }
            if (data.avatar) {
                // @ts-ignore
                data.avatar = imageUrl.split(',')[1]
            }
            if (isPatientEdit) {
                console.log(data)
                const editPatientResponse = await editPatient(data)
                if (editPatientResponse.status === 200) {
                    message.success('修改患者信息成功')
                    onPatientClose()
                    dispatch(renderPatient())
                }
            } else {
                const addPatientResponse = await addPatient(data)
                if (addPatientResponse.status === 200) {
                    message.success('成功新增患者')
                    onPatientClose()
                    dispatch(renderPatient())
                }
            }

        } catch (error) {
            console.error(error);
            message.error('添加失败')
        }
    };
    // 患者表单确认失败
    const onPatientFinishFailed = (errorInfo: object) => {
        message.warning('请完成必要字段的填写')
        console.log('Failed:', errorInfo);
    };
    // 点击获取患者id
    const handleAddonClick = async () => {
        try {
            const res = await getMaxPatientID()
            if (res.status === 200) {
                const newId = res.data.data.id + 1
                patientForm.setFieldValue('id', newId)
            }
        } catch (error) {
            console.error(error)
        }
    };
    /*患者表单模块*/

    /*新增预约模块*/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientValue, setPatientValue] = useState<ListValue | undefined>();
    const [doctorValue, setDoctorValue] = useState<ListValue | undefined>();
    const [appointmentForm] = Form.useForm()

    const fetchPatientList = async (keyword: string) => {
        console.log(keyword)
        try {
            const response = await searchPatients(keyword)
            if (response.status === 200) {
                const responseData = response.data.data
                console.log(responseData)
                return responseData.map((item: { id: number; name: string }) => {
                    return {
                        label: item.name,
                        value: item.id
                    };
                });
            }
        }catch (error){
            console.log(error)
        }
    }
    const fetchDoctorList = async (keyword: string) => {
        console.log(keyword)
        try {
            const response = await searchEmployees(keyword)
            if (response.status === 200) {
                const responseData = response.data.data
                console.log(responseData)
                return responseData.map((item: { id: number; name: string }) => {
                    return {
                        label: item.name,
                        value: item.id
                    };
                });
            }
        }catch (error){
            console.log(error)
        }
    }

    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

// eslint-disable-next-line arrow-body-style
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // 获取今天日期的 midnight（午夜）
        const today = dayjs().endOf('day');
        // 获取十四天后的日期的 midnight
        const fourteenDaysLater = dayjs().add(14, 'day').startOf('day');

        // 禁用今天之前的日期和十四天后的日期
        return current && (current < today || current >= fourteenDaysLater);
    };

    const disabledDateTime = () => ({
        disabledHours: () => range(0, 8).concat(range(22, 24)),
    });



    const onAppointmentFinish = async () => {
        try {
            const appointmentFormdata = appointmentForm.getFieldsValue();
            const data = {
                appointmentTime: appointmentFormdata.appointmentTime,
                service: appointmentFormdata.service,
                patientId: appointmentFormdata.patient.value,
                employeeId: appointmentFormdata.employee.value
            }
            console.log(data)
            const response = await addAppointment(data)
            if (response.status === 200) {
                message.success('新增预约成功')
                setIsModalOpen(false)
            }
        } catch (error) {
            console.error(error);
            message.error('新增失败')
        }
    }

    const onAppointmentFinishFailed = (errorInfo: object) => {
        message.warning('请完成必要字段的填写')
        console.log('Failed:', errorInfo);
    }
    const clickAddAppointment = () => {
        setIsModalOpen(true);
    }
    const handleCancel = () => {
        setIsModalOpen(false);
        appointmentForm.resetFields()
    };
    /*新增预约模块*/

    /*处理图片上传模块*/
    const options = formatAreaData(areaData['86']); // '86' 是中国的国家代码

    const normFile = (e: { fileList: any; }) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </button>
    );
    /*处理图片上传模块*/


    return (
        <div>
            <Layout>
                <Header style={headerStyle}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img width={104}
                             src={logoSrc}
                             alt=""/>
                        <Menu
                            onClick={handleMenuClick}
                            // theme="dark"
                            mode="horizontal"
                            selectedKeys={[`/${path}`]}
                            items={items}
                            style={{backgroundColor: "#ffffff00"}}
                        />
                    </div>
                    <div>
                        <Button style={{marginLeft: '20px'}} type={"primary"}
                                onClick={clickAddPatient}>新增患者</Button>
                        <Button style={{marginLeft: '20px'}} type={"primary"}
                                onClick={clickAddAppointment}>新增预约</Button>
                    </div>
                    <Menu
                        items={itemsUser}
                        style={{backgroundColor: "#ffffff00"}}
                        mode="horizontal"
                        onClick={handleUserClick}
                    >

                    </Menu>
                </Header>
                <Layout style={{height: 'calc(100vh - 48px)'}}>
                    <Outlet/>
                </Layout>
            </Layout>
            <Modal title="新增预约" open={isModalOpen} onOk={() => {
                appointmentForm.submit()
            }} onCancel={handleCancel}>
                <Form
                    form={appointmentForm}
                    onFinish={onAppointmentFinish}
                    onFinishFailed={onAppointmentFinishFailed}
                >
                    <Form.Item
                        rules={[{required: true}]}
                        label="患者" name="patient">
                        <DebounceSelect
                            showSearch
                            value={patientValue}
                            placeholder="选择患者"
                            fetchOptions={fetchPatientList}
                            onChange={(newValue: any) => {
                                setPatientValue(newValue);
                            }}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                    <Form.Item
                        rules={[{required: true}]}
                        label="医生" name="employee">
                        <DebounceSelect
                            showSearch
                            value={doctorValue}
                            placeholder="选择医生"
                            fetchOptions={fetchDoctorList}
                            onChange={(newValue: any) => {
                                setDoctorValue(newValue);
                            }}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                    <Form.Item
                        rules={[{required: true}]}
                        label="预约项目" name="service">
                        <Select>
                            <Select.Option value="TOOTH_EXTRACTION">拔牙</Select.Option>
                            <Select.Option value="TOOTH_FILLING">补牙</Select.Option>
                            <Select.Option value="TOOTH_IMPLANTATION">种牙</Select.Option>
                            <Select.Option value="TOOTH_INLAY">镶牙</Select.Option>
                            <Select.Option value="ORTHODONTICS">正畸</Select.Option>
                            <Select.Option value="TEETH_CLEANING">洗牙</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        rules={[{required: true}]}
                        label="预约时间" name="appointmentTime">
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={disabledDate}
                            disabledTime={disabledDateTime}
                            showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss'), }}
                            showNow = {false}
                        />

                    </Form.Item>
                </Form>
            </Modal>
            <Drawer size={"large"}
                    title={isPatientEdit ? '修改患者信息' : '新增患者'}
                    placement="right"
                    closable={false}
                    onClose={onPatientClose}
                    open={patientOpen}
                    extra={
                        <Space size={"middle"}>
                            <Button type="primary" onClick={() => {
                                patientForm.submit();
                            }}>
                                确定
                            </Button>
                            <Button onClick={onPatientClose}>取消</Button>
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
                    form={patientForm}
                    name="basic"
                    labelCol={{span: 6}}
                    wrapperCol={{span: 18}}
                    style={{maxWidth: 716}}
                    initialValues={{remember: true}}
                    onFinish={onPatientFinish}
                    onFinishFailed={onPatientFinishFailed}
                    autoComplete="off"
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                rules={[{required: true}]}
                                label="客户号" name="id">
                                <Input disabled={isPatientEdit}
                                       type='number'
                                       addonAfter={<div onClick={handleAddonClick} style={{cursor: 'pointer'}}>
                                           <FormOutlined/>
                                       </div>}/>
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
                                label="患者类型" name="patientType">
                                <Select>
                                    <Select.Option value="TEMPORARY">临时</Select.Option>
                                    <Select.Option value="ORDINARY">普通</Select.Option>
                                    <Select.Option value="DENTAL_IMPLANTATION">牙医种植</Select.Option>
                                    <Select.Option value="DENTAL_ORTHODONTICS">牙医正畸</Select.Option>
                                    <Select.Option value="DENTAL_RESTORATION">牙医修复</Select.Option>
                                    <Select.Option value="DENTAL_CARE">牙医护理</Select.Option>
                                    <Select.Option value="CHILDRENS_TEETH">儿童牙齿</Select.Option>
                                    <Select.Option value="INFORMATION">资讯</Select.Option>
                                    <Select.Option value="TOOTH_EXTRACTION">拔牙</Select.Option>
                                    <Select.Option value="TOOTH_INLAY">镶牙</Select.Option>
                                    <Select.Option value="PERIODONTAL">牙周</Select.Option>
                                    <Select.Option value="ORTHODONTICS">矫正</Select.Option>
                                    <Select.Option value="IMPLANTATION">种植</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                rules={[{required: true}]} label="咨询项目" name="consultationProject">
                                <Select>
                                    <Select.Option value="TOOTH_EXTRACTION">拔牙</Select.Option>
                                    <Select.Option value="TOOTH_FILLING">补牙</Select.Option>
                                    <Select.Option value="TOOTH_IMPLANTATION">种牙</Select.Option>
                                    <Select.Option value="TOOTH_INLAY">镶牙</Select.Option>
                                    <Select.Option value="ORTHODONTICS">正畸</Select.Option>
                                    <Select.Option value="TEETH_CLEANING">洗牙</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item
                                rules={[{required: true}]}
                                label="受理人"
                                name="acceptancePerson">
                                <Input></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="身份证号"
                                name="idCardNo"
                            >
                                <Input></Input>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="性别"
                                name="gender"
                            >
                                <Radio.Group>
                                    <Radio value="MALE">男</Radio>
                                    <Radio value="FEMALE">女</Radio>
                                    <Radio value="UNKNOWN">未知</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="出生日期" name="birthDate">
                                <DatePicker/>
                            </Form.Item>
                        </Col>


                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item style={{marginBottom: 0}} label="联系电话">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Form.Item name="phoneType">
                                        <Select style={{width: '100px'}}>
                                            <Select.Option value="SELF"
                                                           style={{textAlign: "center"}}>本人</Select.Option>
                                            <Select.Option value="FAMILY"
                                                           style={{textAlign: "center"}}>家属</Select.Option>
                                            <Select.Option value="FRIEND"
                                                           style={{textAlign: "center"}}>朋友</Select.Option>
                                            <Select.Option value="OTHER"
                                                           style={{textAlign: "center"}}>其他</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="phone">
                                        <Input/>
                                    </Form.Item>
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{marginBottom: 0}} label="介绍人">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Form.Item name="referrerType">
                                        <Select style={{width: '100px'}}>
                                            <Select.Option value="PATIENT"
                                                           style={{textAlign: "center"}}>患者介绍</Select.Option>
                                            <Select.Option value="EMPLOYEE"
                                                           style={{textAlign: "center"}}>员工介绍</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="refereerName">
                                        <Input/>
                                    </Form.Item>
                                </div>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row>


                        <Col span={12}>
                            {/* 其他内容 */}
                            <Form.Item label="家庭住址" name="address">
                                <Cascader options={options} placeholder="请选择省市区"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="详细地址" name="addressDetail">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="昵称" name="nickname">
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="患者备注" name="patientNotes">
                                <TextArea/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="QQ" name="qq">
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="微信" name="weChat">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="电子邮箱" name="email">
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="年龄" name="age">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="avatar"
                        label="头像上传"
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                    </Form.Item>

                </Form>
            </Drawer>
        </div>
    )
}


export default LayoutPage