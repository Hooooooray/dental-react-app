import React, {
    App,
    Button,
    Col,
    Drawer,
    Flex,
    Form,
    GetProps,
    Input,
    Layout,
    Modal, Popconfirm,
    Row,
    Space,
    Table,
    Tree
} from "antd";
import {PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {getCategories} from "../../../api/category";
import {TreeDataNode} from "antd/lib";
import style from './style.module.scss'
import {closePatientDrawer} from "../../../store/actions/actions";
import TextArea from "antd/lib/input/TextArea";
import {addItem, deleteItem, editItem, getItems} from "../../../api/item";

const {Header, Footer, Sider, Content} = Layout;
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const ItemManage = () => {
    const {message} = App.useApp()
    const [treeData, setTreeData] = useState<TreeDataNode[]>([])
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [expandedKeysIn, setExpandedKeysIn] = useState<string[]>([]);
    const {DirectoryTree} = Tree;
    const [checkedCategoryId, setCheckedCategoryId] = useState<any>()
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
    const [isItemEdit, setIsItemEdit] = useState(false)
    const onSelect: DirectoryTreeProps['onSelect'] = (keys) => {
        console.log('select', keys)
        const id = parseInt(keys[0] as string)
        setCheckedCategoryId(id)
        setCategoryId(id)
    };

    interface Category {
        id: number;
        name: string;
        parentId: number | null;
        children: Category[];  // 递归地定义子分类
    }

    const initCategory = async () => {
        const response = await getCategories();
        if (response.status === 200 && response.data.success === true) {
            const formattedData = response.data.data.map((item: Category) => ({
                key: item.id.toString(),
                title: item.name,
                children: item.children.map((child: Category) => ({
                    key: child.id.toString(),
                    title: child.name,
                    children: child.children.map((subChild: Category) => ({
                        key: subChild.id.toString(),
                        title: subChild.name
                    }))
                }))
            }));
            setTreeData(formattedData);
            // 设置所有节点为展开状态
            const allKeys = getAllKeys(formattedData);
            setExpandedKeys(allKeys);
            setExpandedKeysIn(allKeys)
        }
    }

    function getAllKeys(nodes: any[]) {
        let keys: any[] = [];
        nodes.forEach(node => {
            keys.push(node.key.toString()); // 确保 key 为字符串
            if (node.children) {
                keys = keys.concat(getAllKeys(node.children)); // 递归调用以继续处理子节点
            }
        });
        return keys;
    }

    useEffect(() => {
        initCategory()
    }, []);


    const [itemOpen, setItemOpen] = useState(false)
    const [itemForm] = Form.useForm();
    const [speForm] = Form.useForm()
    const onItemClose = () => {
        itemForm.resetFields();
        setItemOpen(false)
    };
    const onItemFinish = async () => {
        if (!isItemEdit) {
            const formData = itemForm.getFieldsValue();  // 获取表单数据
            const itemData = {
                ...formData,
                specifications: speList  // 假设您的后端希望在一个名为specifications的字段中接收规格数据
            };

            try {
                const response = await addItem(itemData)
                if (response && response.data.success) {
                    fetchItems()
                    message.success('物品添加成功！');
                    // 清空表单和规格列表等逻辑处理
                    itemForm.resetFields();
                    setSpeList([]);
                    setItemOpen(false)
                } else {
                    message.error('添加物品失败：' + response.data.message);
                }
            } catch (error) {
                console.error('添加物品出错:', error);
                message.error('添加物品失败：网络或服务器错误');
            }
        } else {
            const formData = itemForm.getFieldsValue();  // 获取表单数据
            try {
                const response = await editItem(formData)
                if (response && response.data.success) {
                    message.success('物品编辑成功！');
                    // 清空表单和规格列表等逻辑处理
                    fetchItems()
                    itemForm.resetFields();
                    setSpeList([]);
                    setItemOpen(false)
                } else {
                    message.error('添加物品失败：' + response.data.message);
                }
            } catch (error) {
                console.error('添加物品出错:', error);
                message.error('添加物品失败：网络或服务器错误');
            }
        }
    };

    const onItemFinishFailed = () => {
        message.warning('请完成必要字段的填写')
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSpeOpen, setIsSpeOpen] = useState(false)
    const [speList, setSpeList] = useState<any>([])
    const handleOk = () => {
        itemForm.setFieldValue('categoryId', checkedCategoryId)
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSpeOk = () => {
        speForm.submit()
    }

    const handleSpeCancel = () => {
        setIsSpeOpen(false)
    }

    const onSpeFinish = () => {
        const data = speForm.getFieldsValue();
        // 给每个新添加的规格分配一个唯一的 key
        const newSpec = {
            ...data,
            key: Date.now() // 使用当前时间戳作为 key
        };
        setSpeList((currentList: any) => [...currentList, newSpec]);
        setIsSpeOpen(false);
        speForm.resetFields()
    };


    const onItemSpeFailed = () => {
        message.info('请检查必要字段的填写')
    }

    const handleDelete = (key: any) => {
        setSpeList((currentList: any[]) => currentList.filter(item => item.key !== key));
    };

    const columns = [
        {
            title: '单位',
            dataIndex: 'unit', // 对应数据中的字段
            key: 'unit'
        },
        {
            title: '规格名称',
            dataIndex: 'name', // 对应数据中的字段
            key: 'name'
        },
        {
            title: '操作',
            key: 'action',
            render: (text: any, record: { key: any; }) => (
                <Button danger type="link" onClick={() => handleDelete(record.key)}>删除</Button>
            )
        }
    ];

    const [items, setItems] = useState([]); // 存储物品数据

    const handleItemDelete = async (id: any) => {
        const response = await deleteItem(id)
        if (response.status === 200) {
            fetchItems()
            message.success('删除成功')
        }
    }


    // 表格列定义
    const itemColumns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '型号',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: '保质期',
            dataIndex: 'expiration',
            key: 'expiration',
        },
        {
            title: '所属类名',
            dataIndex: 'categoryId',
            key: 'categoryId',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            key: 'action',
            render: (text: any, record: { key: any; }) => (
                <>
                    <Space>
                        <Button onClick={() => {
                            setItemOpen(true)
                            setIsItemEdit(true)
                            itemForm.setFieldsValue(record)
                        }}>编辑</Button>
                        <Popconfirm
                            title="提示"
                            description="确定要删除此物品？"
                            okText="确定"
                            cancelText="取消"
                            placement="topRight"
                            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                            onConfirm={() => handleItemDelete(record.key)}
                        >
                            <Button danger>删除</Button>
                        </Popconfirm>
                    </Space>
                </>
            )
        }
    ];
    useEffect(() => {
        fetchItems();
    }, [categoryId]);

    const fetchItems = async () => {
        try {
            const response = await getItems(categoryId);
            if (response.status === 200 && response.data.success === true) {
                const items = response.data.data
                setItems(items.map((item: any) => {
                    const formattedItem = {
                        ...item,
                        key: item.id
                    }
                    return formattedItem
                }));
            } else {
                message.error('获取物品数据失败');
            }
        } catch (error) {
            console.error('获取物品数据出错:', error);
            message.error('网络或服务器错误');
        }
    };


    return (
        <>
            <Modal
                title="选择分类" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={330}
            >
                <DirectoryTree
                    style={{maxHeight: "60vh", overflow: "scroll"}}
                    multiple
                    expandedKeys={expandedKeysIn}
                    onSelect={onSelect}
                    onExpand={(expandedKeys, {node, expanded, nativeEvent}) => {
                        // 转换所有键为字符串类型
                        const stringKeys = expandedKeys.map(key => key.toString());
                        setExpandedKeysIn(stringKeys);
                    }}
                    treeData={treeData}
                />
            </Modal>
            <Modal
                title={'新增规格'}
                open={isSpeOpen}
                onOk={handleSpeOk}
                onCancel={handleSpeCancel}
            >
                <Form
                    form={speForm}
                    onFinish={onSpeFinish}
                    onFinishFailed={onItemSpeFailed}
                >
                    <Form.Item rules={[{required: true}]} label={'单位'} name={'unit'}>
                        <Input/>
                    </Form.Item>
                    <Form.Item rules={[{required: true}]} label={'规格名称'} name={'name'}>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
            <Drawer
                size={"large"}
                title={isItemEdit ? '编辑物品' : '新增物品'}
                placement="right"
                closable={false}
                onClose={onItemClose}
                open={itemOpen}
                extra={
                    <Space size={"middle"}>
                        <Button type="primary" onClick={() => {
                            itemForm.submit();
                        }}>
                            确定
                        </Button>
                        <Button onClick={onItemClose}>取消</Button>
                    </Space>
                }>
                <style>
                    {`.ant-drawer-header {background: linear-gradient(to right, #9ED2EF, #A1ECC8);padding-left:10px !important;padding-right:10px !important`}
                </style>
                <Row>
                    <span className={style.itemFormTitle}>基本信息</span>
                </Row>
                <Form form={itemForm}
                      onFinish={onItemFinish}
                      onFinishFailed={onItemFinishFailed}
                      labelCol={{span: 6}}
                      wrapperCol={{span: 18}}
                      autoComplete="off"
                      style={{maxWidth: 716}}

                >
                    <Row>
                        <Col span={12}>
                            <Form.Item rules={[{required: true}]} label={'名称'} name={'name'}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'型号'} name={'model'}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item rules={[{required: true}]} label={'所属类名'} name={'categoryId'}>
                                <Input onClick={() => {
                                    setIsModalOpen(true)
                                }} readOnly style={{cursor: "pointer", background: "#fff"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'品牌'} name={'brand'}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label={'保质期'} name={'expiration'}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'描述'} name={'description'}>
                                <TextArea/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item hidden={true} label={'id'} name={'id'}>
                        <Input/>
                    </Form.Item>
                </Form>
                <Flex justify={"space-between"} align={"center"} style={{marginBottom: "10px"}}>
                    <span className={style.itemFormTitle} style={{marginBottom: 0}}>规格信息</span>
                    <Button icon={<PlusOutlined/>} type={"primary"} onClick={() => {
                        setIsSpeOpen(true)
                    }}>新增规格</Button>
                </Flex>
                <Table
                    columns={columns}
                    dataSource={speList}
                    pagination={false} // 如果不需要分页，可以设置为 false
                />

            </Drawer>
            <Content style={{padding: "10px"}}>
                <Button onClick={() => {
                    setItemOpen(true)
                    setIsItemEdit(false)
                }} type={"primary"} icon={<PlusOutlined/>}>物品新增</Button>
                <Flex style={{marginTop: "10px",}}>
                    <Flex vertical={true}>
                        <Flex justify={"space-between"} align={"center"} className={style.categoryTitle}>
                            <div style={{cursor: "pointer"}} onClick={() => {
                                setCategoryId(undefined)
                                setCheckedCategoryId(null)
                            }}>全部物品
                            </div>
                            <a href="./categoryManage">分类管理</a>
                        </Flex>
                        <div style={{
                            width: "200px",
                            height: "calc(100vh - 140px)",
                            overflow: "scroll",
                            marginRight: "10px"
                        }}>
                            <DirectoryTree
                                multiple
                                expandedKeys={expandedKeys}
                                onSelect={onSelect}
                                onExpand={(expandedKeys, {node, expanded, nativeEvent}) => {
                                    // 转换所有键为字符串类型
                                    const stringKeys = expandedKeys.map(key => key.toString());
                                    setExpandedKeys(stringKeys);
                                }}
                                treeData={treeData}
                            />
                        </div>
                    </Flex>
                    <Table style={{width: "100%"}}
                           columns={itemColumns}
                           dataSource={items}
                           bordered={true}
                    />
                </Flex>
            </Content>
        </>
    )
}

export default ItemManage