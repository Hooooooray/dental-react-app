import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Pagination, Popconfirm, Space, Table} from "antd";
import {PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {addRole, deleteRole, getRoles} from "../../../../api/roles";
import {deleteEmployee} from "../../../../api/employee";

const RoleTabItem = () => {
    const [messageApi, contextHolder] = message.useMessage();

    interface RoleDataType {
        key: React.Key;
        id:number;
        roleName: string;
        roleType: string
    }

    const [roleData, setRoleData] = useState<RoleDataType[]>([]);

    const handleEditEmployee = (record: RoleDataType) => {
        console.log(record)
    }
    const handleDeleteRole = async (record: any) => {
        let id = record.id
        console.log(id)
        try {
            const response = await deleteRole(id)
            if (response.status === 200) {
                const newTotal = total - 1;
                const newTotalPages = Math.ceil(newTotal / pageSize);
                if (page > newTotalPages) {
                    // 如果当前页超过了新的总页数，将页码减一
                    setPage(newTotalPages);
                } else {
                    renderRoleTable()
                }
                messageApi.open({
                    type: 'success',
                    content: '删除成功',
                });
            }
        } catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: '删除失败',
            });
        }
    }
    const roleColumns: ColumnsType<RoleDataType> = [
        {
            title: 'id',
            width: 50,
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '角色名称',
            width: 90,
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: '角色类型',
            width: 90,
            dataIndex: 'roleType',
            key: 'roleType',
        },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            render: (record) => (
                <Space>
                    <Button onClick={() => handleEditEmployee(record)}>权限配置</Button>
                    {
                        record.roleName === '自定义角色' &&
                        (<Popconfirm
                            title="提示"
                            description="确定要删除此员工角色？"
                            okText="确定"
                            cancelText="取消"
                            placement="topRight"
                            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                            onConfirm={() => handleDeleteRole(record)}
                        >
                            <Button danger>删除</Button>
                        </Popconfirm>)
                    }
                </Space>
            ),

        },
    ];
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    // 渲染列表
    const renderRoleTable = () => {
        interface Role {
            id: number;
        }

        getRoles(page, pageSize)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    let roles = response.data.data
                    setTotal(response.data.total)
                    setRoleData(roles.map((role: Role) => {
                        const formattedRoles = {
                            ...role,
                            key: role.id,
                        };
                        return formattedRoles;
                    }))
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        console.log(('effect'))
        renderRoleTable()
    }, [page, pageSize])

    const handleChangePage = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }

    const clickAddRole = () => {
        setIsModalOpen(true);
    }

    const [roleForm] = Form.useForm()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {

        // const data = {
        //     roleName: 'whatever'
        // }
        // addRole(data)
        //     .then(response => {
        //         console.log(response)
        //     })
        // setIsModalOpen(false);
    };

    const onRoleFinish = async () => {
        try {
            const data = roleForm.getFieldsValue();
            const roleName = data.roleName
            const response = await addRole({roleName})
            if(response.status ===200){
                messageApi.open({
                    type: 'success',
                    content: '新增成功',
                });
                renderRoleTable()
                setIsModalOpen(false)
            }
        }catch (error){
            console.error(error);
            messageApi.open({
                type: 'error',
                content: '新增失败',
            });
        }
    }

    const onRoleFinishFailed = (errorInfo: object) => {
        messageApi.open({
            type: 'warning',
            content: '请完成必要字段的填写',
        });
        console.log('Failed:', errorInfo);
    }


    const handleCancel = () => {
        setIsModalOpen(false);
        roleForm.resetFields()
    };


    return (
        <>
            {contextHolder}
            <div style={{padding: '16px 16px 0 16px'}}>
                <Button style={{marginBottom: 16}} icon={<PlusOutlined/>} onClick={clickAddRole}>新增角色</Button>
                <Modal title="新增角色" open={isModalOpen} onOk={() => {
                    roleForm.submit()
                }} onCancel={handleCancel}>
                    <Form
                        form={roleForm}
                        onFinish={onRoleFinish}
                        onFinishFailed={onRoleFinishFailed}
                    >
                        <Form.Item
                            rules={[{required: true}]}
                            label="角色名称" name="roleName">
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Table size={"small"}
                       pagination={false}
                       bordered={true}
                       columns={roleColumns}
                       dataSource={roleData}
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
            </div>
        </>
    )
}

export default RoleTabItem