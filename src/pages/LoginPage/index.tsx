import React, {useEffect, useState} from "react";
import style from './style.module.scss'
import {App, Button, Flex, Form, Input, Space, Tabs, TabsProps, Typography} from "antd";
import {useNavigate} from 'react-router-dom'
import {getSms, login, smsLogin, verifyRole} from "../../api/user";
import {useDispatch} from "react-redux";
import {updatePermissions} from "../../store/actions/actions";

const {Title} = Typography;


const onChange = (key: string) => {
    console.log(key);
};

const LoginPage = () => {
    const [loginForm] = Form.useForm()
    const [smsLoginForm] = Form.useForm()
    const navigate = useNavigate();
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [getSmsText, setGetSmsText] = useState('获取验证码')
    let interval: NodeJS.Timer | null = null
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    useEffect(() => {
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);
    const onLoginFinish = async () => {
        try {
            const data = loginForm.getFieldsValue()
            const response = await login(data)
            if (response.status === 200) {
                const token = response.data.data.token
                localStorage.setItem('token', token)
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
        } catch (error) {
            console.log(error)
        }
    };
    const onLoginFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const clickGetSms = async ()=>{
        try {
            const phoneNumber = smsLoginForm.getFieldValue('phoneNumber')
            const phoneRegex = /^[1-9]\d{10}$/;
            if (!phoneRegex.test(phoneNumber)){
                return message.error('请输入正确的手机号码')
            }
            const response = await getSms({phoneNumber})
            if (response.status === 200){
                let count = 60
                setIsButtonDisabled(true);
                message.success('验证码发送成功')
                interval = setInterval(()=>{
                    if (count>=0){
                        setGetSmsText(`${count}秒后重发`)
                        count--
                    }else {
                        setGetSmsText('重新获取验证码')
                        setIsButtonDisabled(false);
                        clearInterval(interval as NodeJS.Timeout);
                    }
                },1000)

            }
        }catch (error:any){
            console.log(error)
            if(error.response.status === 429){
                message.warning('发送验证码太频繁请稍后再尝试')
            }
        }
    }

    const onSmsLoginFinish = async () => {
        try {
            const data = smsLoginForm.getFieldsValue()
            const response = await smsLogin(data)
            if (response.status === 200) {
                const token = response.data.data.token
                localStorage.setItem('token', token)
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
        } catch (error) {
            console.log(error)
        }
    };
    const onSmsLoginFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '密码登录',
            children: <>
                <Form
                    name="basic"
                    style={{width: "360px", marginTop: "20px"}}
                    form={loginForm}
                    wrapperCol={{span: 24}}
                    initialValues={{remember: true}}
                    onFinish={onLoginFinish}
                    onFinishFailed={onLoginFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item<FieldType>
                        // label="用户名"
                        name="username"
                        rules={[{required: true, message: '请输入用户名'}]}
                    >
                        <Input placeholder="请输入用户名" size={"large"}/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        // label="密码"
                        name="password"
                        rules={[{required: true, message: '请输入密码'}]}
                    >
                        <Input.Password placeholder="请输入密码" size={"large"}/>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{width: "100%"}} type="primary" htmlType="submit" size={"large"}>
                            登录
                        </Button>
                    </Form.Item>
                </Form></>
        },
        {
            key: '2',
            label: '短信登录',
            children: <>
                <Form
                    name="basic"
                    style={{width: "360px", marginTop: "20px"}}
                    form={smsLoginForm}
                    wrapperCol={{span: 24}}
                    initialValues={{remember: true}}
                    onFinish={onSmsLoginFinish}
                    onFinishFailed={onSmsLoginFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item<FieldType>
                        // label="用户名"
                        name="phoneNumber"
                        rules={[{required: true, message: '请输入手机号'},]}
                    >
                        <Input placeholder="请输入手机号" size={"large"}/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        // label="密码"
                        name="code"
                        rules={[{required: true, message: '请输入验证码'}]}
                    >
                        <Flex>
                            <Input style={{borderBottomRightRadius:"0",borderTopRightRadius:"0"}} placeholder="请输入验证码" size={"large"}/>
                            <Button disabled={isButtonDisabled} type={"primary"} style={{borderTopLeftRadius:"0",borderBottomLeftRadius:"0",marginLeft:"-1px",fontSize:"15px"}} size={"large"} onClick={clickGetSms}>{getSmsText}</Button>
                        </Flex>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{width: "100%"}} type="primary" htmlType="submit" size={"large"}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </>
        }
    ];


    type FieldType = {
        username?: string;
        password?: string;
        phoneNumber?:string;
        code?:string;
    };
    return (
        <>
            <Flex className={style.loginPage} vertical={true} justify="center" align='center'>
                <Flex className={style.loginForm} vertical={true} justify="center" align='center'>
                    <Title level={2}>欢迎回来</Title>
                    <Tabs size={"large"}
                          centered={true}
                          items={items}
                          onChange={onChange}/>
                </Flex>
            </Flex>
        </>
    )
}

export default LoginPage