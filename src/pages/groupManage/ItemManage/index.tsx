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
    Modal,
    Row,
    Space,
    Table,
    Tree
} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {getCategories} from "../../../api/category";
import {TreeDataNode} from "antd/lib";
import style from './style.module.scss'
import {closePatientDrawer} from "../../../store/actions/actions";
import TextArea from "antd/lib/input/TextArea";

const {Header, Footer, Sider, Content} = Layout;
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const ItemManage = () => {
    const {message} = App.useApp()
    const [treeData, setTreeData] = useState<TreeDataNode[]>([])
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [expandedKeysIn, setExpandedKeysIn] = useState<string[]>([]);
    const {DirectoryTree} = Tree;
    const [checkedCategoryId, setCheckedCategoryId] = useState<any>()
    const onSelect: DirectoryTreeProps['onSelect'] = (keys) => {
        console.log('select', keys)
        const id = parseInt(keys[0] as string)
        setCheckedCategoryId(id)
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
    const onItemClose = () => {
        itemForm.resetFields();
        setItemOpen(false)
    };
    const onItemFinish = () => {
        const data = itemForm.getFieldsValue()
        console.log(data)
    }
    const onItemFinishFailed = () => {
        message.warning('请完成必要字段的填写')
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOk = () => {
        itemForm.setFieldValue('categoryId', checkedCategoryId)
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
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
            <Drawer
                size={"large"}
                title={'新增物品'}
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
                </Form>
                    <Flex justify={"space-between"} align={"center"} style={{marginBottom:"10px"}}>
                        <span className={style.itemFormTitle} style={{marginBottom:0}}>规格信息</span>
                        <Button icon={<PlusOutlined/>} type={"primary"}>新增规格</Button>
                    </Flex>

            </Drawer>
            <Content style={{padding: "10px"}}>
                <Button onClick={() => {
                    setItemOpen(true)
                }} type={"primary"} icon={<PlusOutlined/>}>物品新增</Button>
                <Flex style={{marginTop: "10px",}}>
                    <Flex vertical={true}>
                        <Flex justify={"space-between"} align={"center"} className={style.categoryTitle}>
                            <div>全部物品</div>
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
                    <Table style={{width: "100%"}}></Table>
                </Flex>
            </Content>
        </>
    )
}

export default ItemManage