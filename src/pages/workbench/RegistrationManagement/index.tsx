import React, {useEffect, useState} from "react";
import {
    Alert,
    Avatar,
    Button,
    Collapse,
    CollapseProps,
    DatePicker,
    Drawer, Flex,
    Form,
    Input, List, Modal, Radio,
    Row,
    Select,
    Space,
    Table, Tag
} from "antd";
import {PlusOutlined, UserOutlined} from "@ant-design/icons";
import style from './style.module.scss'
import {onRangeChange, rangePresets} from "../../../components/PublicTimePicker";
import {SearchProps} from "antd/es/input";
import {getPatient, searchPatients} from "../../../api/patient";

const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} = Input;


const RegistrationManagement = () => {
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

    const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
        console.log(info?.source, value)
        const response = await searchPatients(value)
        if (response.status === 200 && response.data.success === true) {
            console.log(response.data.data)
            const patientListData = response.data.data
            setPatientList(patientListData)
        }
    };


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
                        <Search placeholder="input search text" onSearch={onSearch} enterButton/>
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
                                            if (response.status === 200 && response.data.success === true){
                                                console.log(response)
                                                setIsChoosePatientModalOpen(false)
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
                        <Avatar className={style.drawerItemSpace} size={"large"}></Avatar>
                        <Alert className={style.drawerItemSpace} message={'张三'} type="info"/>
                        <Row>
                            <Space size={"large"}>
                                <Form.Item label="病例号" name="id">
                                    <Input disabled={true}></Input>
                                </Form.Item>
                                <Form.Item label="客户号" name="patientId">
                                    <Input disabled={true}></Input>
                                </Form.Item>
                            </Space>
                        </Row>
                        <Row>
                            <Space size={"large"}>
                                <Form.Item className={style.textForm} name="patientType" label="患者类型">
                                    <span></span>
                                </Form.Item>
                                <Form.Item name="visitingType" label="就诊类型">
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
                                <Form.Item className={style.textForm} label={"咨询师"}>
                                    <span></span>
                                </Form.Item>
                                <Form.Item className={style.textForm} label={"上次咨询师"}>
                                    <span></span>
                                </Form.Item>
                                <Form.Item className={style.textForm} label={"接诊医生"}>
                                    <span></span>
                                </Form.Item>
                                <Form.Item className={style.textForm} label={"上次接诊医生"}>
                                    <span></span>
                                </Form.Item>
                            </Space>
                        </Row>

                    </Flex>


                </>
            ),
        },
        {
            key: '2',
            label: '接诊医生',
            children: <p>`
                A dog is a type of domesticated animal.
                Known for its loyalty and faithfulness,
                it can be found as a welcome guest in many households across the world.
                `;</p>,
        },
        {
            key: '3',
            label: '咨询师',
            children: <p>`
                A dog is a type of domesticated animal.
                Known for its loyalty and faithfulness,
                it can be found as a welcome guest in many households across the world.
                `;</p>,
        },
    ];

    const addRegistration = () => {
        setRegistrationOpen(true)
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

    return (
        <>
            <div style={{padding: '16px 16px 0 16px'}}>
                <Space size="large" style={{marginBottom: 16}}>
                    <Button className={style.buttonSpace} icon={<PlusOutlined/>}
                            onClick={addRegistration}>新增挂号</Button>
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
                            <Button type={"primary"}>保存</Button>
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
                <Form>
                    <Collapse className={style.minCollapseWidth} size="small" items={items}
                              defaultActiveKey={['1', '2', '3']} expandIconPosition={"end"}
                              onChange={onChange}/>
                </Form>
            </Drawer>
        </>
    )
}

export default RegistrationManagement