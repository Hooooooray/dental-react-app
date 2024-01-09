import React from "react";
import style from './style.module.scss'
import {App, Button, Flex, Form, Input, Typography} from "antd";
import {useNavigate} from 'react-router-dom'
import {login, verifyRole} from "../../api/user";
import {useDispatch} from "react-redux";
import {updatePermissions} from "../../store/actions/actions";

const {Title} = Typography;

const LoginPage = () => {
    const [loginForm] = Form.useForm()
    const navigate = useNavigate();
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const onLoginFinish = async () => {
        try {
            const data = loginForm.getFieldsValue()
            const response = await login(data)
            if (response.status === 200){
                const token = response.data.data.token
                localStorage.setItem('token',token)
                const verifyRes = await verifyRole()
                if (verifyRes.status === 200) {
                    const loadPermissions = verifyRes.data.data.permissions
                    const loadPermissionsArray = loadPermissions.length > 1 ? loadPermissions.split(',') : [loadPermissions]
                    if (loadPermissionsArray.length > 0) {
                        dispatch(updatePermissions(loadPermissionsArray.filter((permission: string) => permission !== '')
                            .map((permission: string) => Number(permission))))
                    }
                }
                message.success('登录成功！');
                navigate('/index')
            }
        }catch (error){
            console.log(error)
        }
    };

    const onLoginFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        username?: string;
        password?: string;
    };
    return (
        <Flex className={style.loginPage} vertical={true} justify="center" align='center'>
            <Flex className={style.loginForm} vertical={true} justify="center" align='center'>
                <Form
                    name="basic"
                    form={loginForm}
                    wrapperCol={{span: 24}}
                    style={{width: "300px"}}
                    initialValues={{remember: true}}
                    onFinish={onLoginFinish}
                    onFinishFailed={onLoginFinishFailed}
                    autoComplete="off"
                >
                    <Title level={2}>欢迎回来</Title>
                    <Form.Item<FieldType>
                        // label="用户名"
                        name="username"
                        rules={[{required: true, message: '请输入你的用户名'}]}
                    >
                        <Input placeholder="请输入用户名" size={"large"}/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        // label="密码"
                        name="password"
                        rules={[{required: true, message: '请输入你的密码'}]}
                    >
                        <Input.Password placeholder="请输入密码" size={"large"}/>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{width: "100%"}} type="primary" htmlType="submit" size={"large"}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
        </Flex>
    )
}

export default LoginPage