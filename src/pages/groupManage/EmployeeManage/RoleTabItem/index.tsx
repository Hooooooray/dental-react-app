import React, {useEffect, useState} from "react";
import {App, Button, Drawer, Form, Input, Modal, Pagination, Popconfirm, Space, Table, Tree} from "antd";
import {PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import type {DataNode} from 'antd/es/tree';
import {addRole, deleteRole, getRole, getRoles} from "../../../../api/role";
import {deleteEmployee} from "../../../../api/employee";
import {getPermissions} from "../../../../api/permission";

const RoleTabItem = () => {
    const {message} = App.useApp();

    interface RoleDataType {
        key: React.Key;
        id: number;
        roleName: string;
        roleType: string
    }


    const [roleData, setRoleData] = useState<RoleDataType[]>([]);

    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);


    const convertToTreeData = (permissions: any) => {
        return permissions.map((permission: { id: number, name: string, children: object }) => {
            const node = {
                key: permission.id,
                title: permission.name,
                children: convertToTreeData(permission.children || []),
            };
            return node;
        });
    };

    const handleEditPermission = async (record: RoleDataType) => {
        setCheckedKeys([])
        try {
            const role = await getRole(record.id)
            if (role.status === 200) {
                const permissionsId = role.data.data.permissions
                console.log(permissionsId)
                const permissionsArray = permissionsId.length > 1 ? permissionsId.split(',') : [permissionsId]
                console.log('permissionsArray', permissionsArray)
                if (permissionsArray.length > 0) {
                    setCheckedKeys(permissionsArray.map((permission: string) => parseInt(permission)))
                }
            }
            const permissions = await getPermissions()
            if (permissions.status === 200) {
                const permissionData = permissions.data.data
                setTreeData(convertToTreeData(permissionData))
            }
        } catch (error) {
            console.error(error)
        }
        setPermissionOpen(true)
    }

    useEffect(() => {
        console.log('useEffect', treeData, checkedKeys)
    }, [treeData, checkedKeys]);

    const onExpand = (expandedKeysValue: React.Key[]) => {
        console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue: any) => {
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
    };

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
                message.success('删除成功')
            }
        } catch (error) {
            console.error(error);
            message.error('删除失败')
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
                    <Button onClick={() => handleEditPermission(record)}>权限配置</Button>
                    {
                        record.roleType === '自定义角色' &&
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
            if (response.status === 200) {
                message.success('新增成功')
                renderRoleTable()
                setIsModalOpen(false)
            }
        } catch (error) {
            console.error(error);
            message.error('新增失败')
        }
    }

    const onRoleFinishFailed = (errorInfo: object) => {
        message.warning('请完成必要字段的填写')
        console.log('Failed:', errorInfo);
    }


    const handleCancel = () => {
        setIsModalOpen(false);
        roleForm.resetFields()
    };

    const [permissionOpen, setPermissionOpen] = useState(false)
    const onPermissionClose = () => {
        setPermissionOpen(false)
    };


    return (
        <>
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
                <Drawer
                    size={"large"}
                    title='权限配置'
                    placement="right"
                    closable={false}
                    onClose={onPermissionClose}
                    open={permissionOpen}
                    extra={
                        <Space size={"middle"}>
                            <Button type="primary" onClick={() => {
                                // employeeForm.submit();
                            }}>
                                确定
                            </Button>
                            <Button onClick={onPermissionClose}>取消</Button>
                        </Space>
                    }
                >
                    <style>
                        {`.ant-drawer-header {background: linear-gradient(to right, #9ED2EF, #A1ECC8);padding-left:10px !important;padding-right:10px !important`}
                    </style>
                    <Tree
                        checkable
                        onExpand={onExpand}
                        onCheck={onCheck}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        checkedKeys={checkedKeys}
                        treeData={treeData}
                    />
                    <Button onClick={() => {
                        console.log(checkedKeys)
                    }}>显示check</Button>
                </Drawer>
            </div>
        </>
    )
}

export default RoleTabItem