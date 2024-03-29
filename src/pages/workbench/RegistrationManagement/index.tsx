import React, {useState} from "react";
import {Button, Drawer, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const RegistrationManagement = () => {
    const [registrationOpen, setRegistrationOpen] = useState(false)
    const [isRegistrationEdit, setIsRegistrationEdit] = useState(false)
    const addRegistration = () => {
        setRegistrationOpen(true)
    }
    const onRegistrationClose = () => {
        setRegistrationOpen(false)
    }
    return (
        <>
            <div style={{padding: '16px 16px 0 16px'}}>
                <Space size="large" style={{marginBottom: 16}}>
                    <Button icon={<PlusOutlined/>} onClick={addRegistration}>新增挂号</Button>
                </Space>
            </div>
            <Drawer
                title={isRegistrationEdit ? '编辑挂号' : '新增挂号'}
                placement={"top"}
                open={registrationOpen}
                onClose={onRegistrationClose}
            >
                <style>
                    {`.ant-drawer-header {background: linear-gradient(to right, #9ED2EF, #A1ECC8);padding-left:10px !important;padding-right:10px !important`}
                </style>

            </Drawer>
        </>
    )
}

export default RegistrationManagement