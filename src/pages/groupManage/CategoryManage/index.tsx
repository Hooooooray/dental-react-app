import React, {App, Button, Col, Flex, Input, List, Modal, Popconfirm, Row} from "antd";
import style from './style.module.scss'
import {PlusOutlined} from "@ant-design/icons";
import {MouseEvent, useEffect, useState} from "react";
import {addCategory, deleteCategory, getCategories} from "../../../api/category";
import {
    DeleteOutlined
} from '@ant-design/icons';


const CategoryManage = () => {
    const {message} = App.useApp();

    interface Category {
        id: number;
        name: string;
        children?: Category[];
    }

    const [categoryFirst, setCategoryFirst] = useState<Category[]>([]);
    const [categorySecond, setCategorySecond] = useState<Category[]>([]);
    const [categoryThird, setCategoryThird] = useState<Category[]>([]);
    const [activeFirstCat, setActiveFirstCat] = useState<number | null>(null);
    const [activeSecondCat, setActiveSecondCat] = useState<number | null>(null);
    const [activeThirdCat, setActiveThirdCat] = useState<number | null>(null);

    const renderCategoryList = async () => {
        try {
            const response = await getCategories();
            if (response.status === 200 && Array.isArray(response.data.data) && response.data.data.length > 0) {
                const firstLevelCategories = response.data.data;
                setCategoryFirst(firstLevelCategories);

                // 检查当前激活的一级分类是否还存在
                const currentActiveFirst = firstLevelCategories.find((cat: {
                    id: number | null;
                }) => cat.id === activeFirstCat) || firstLevelCategories[0];
                setCategorySecond(currentActiveFirst.children || []);
                setActiveFirstCat(currentActiveFirst.id);

                // 检查当前激活的二级分类是否还存在
                if (currentActiveFirst.children && currentActiveFirst.children.length > 0) {
                    const currentActiveSecond = currentActiveFirst.children.find((cat: {
                        id: number | null;
                    }) => cat.id === activeSecondCat) || currentActiveFirst.children[0];
                    setCategoryThird(currentActiveSecond.children || []);
                    setActiveSecondCat(currentActiveSecond.id);

                    // 检查当前激活的三级分类是否还存在
                    if (currentActiveSecond.children && currentActiveSecond.children.length > 0) {
                        const currentActiveThird = currentActiveSecond.children.find((cat: {
                            id: number | null;
                        }) => cat.id === activeThirdCat) || currentActiveSecond.children[0];
                        setActiveThirdCat(currentActiveThird.id);
                    } else {
                        setActiveThirdCat(null);
                    }
                } else {
                    setCategorySecond([]);
                    setCategoryThird([]);
                    setActiveSecondCat(null);
                    setActiveThirdCat(null);
                }
            } else {
                setCategoryFirst([]);
                setCategorySecond([]);
                setCategoryThird([]);
                setActiveFirstCat(null);
                setActiveSecondCat(null);
                setActiveThirdCat(null);
            }
        } catch (error) {
            console.error("Error fetching categories", error);
            setCategoryFirst([]);
            setCategorySecond([]);
            setCategoryThird([]);
            setActiveFirstCat(null);
            setActiveSecondCat(null);
            setActiveThirdCat(null);
        }
    };

    useEffect(() => {
        renderCategoryList()
    }, []);

    const [categoryInput, setCategoryInput] = useState<string>('')

    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);

    const showFirstModal = () => {
        setIsFirstModalOpen(true);
    };

    const handleFirstOk = async () => {
        try {
            const response = await addCategory({
                name: categoryInput
            })
            console.log(response)
            if (response.status === 200 && response.data.success === true) {
                renderCategoryList()
                message.success('新增成功')
                handleClose()
            }
        } catch (e) {
            console.log(e)
            message.error('新增失败')
        }
    };

    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

    const showSecondModal = () => {
        setIsSecondModalOpen(true);
    };

    const handleSecondOk = async () => {
        try {
            const response = await addCategory({
                name: categoryInput,
                parentId: activeFirstCat as number
            })
            console.log(response)
            if (response.status === 200 && response.data.success === true) {
                renderCategoryList()
                message.success('新增成功')
                handleClose()
            }
        } catch (e) {
            console.log(e)
            message.error('新增失败')
        }
    };

    const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);

    const showThirdModal = () => {
        setIsThirdModalOpen(true);
    };

    const handleThirdOk = async () => {
        try {
            const response = await addCategory({
                name: categoryInput,
                parentId: activeSecondCat as number
            })
            console.log(response)
            if (response.status === 200 && response.data.success === true) {
                renderCategoryList()
                message.success('新增成功')
                handleClose()
            }
        } catch (e) {
            console.log(e)
            message.error('新增失败')
        }
    };

    const handleClose = () => {
        setIsFirstModalOpen(false);
        setIsSecondModalOpen(false);
        setIsThirdModalOpen(false);
        setCategoryInput('')
    };

    const handleDeleteCategory = async (id: number) => {
        const response = await deleteCategory({id})
        if (response.status === 200 && response.data.success === true) {
            message.success('删除成功')
            renderCategoryList()
        }
    };

    return (
        <>
            <Modal title="新增一级分类" open={isFirstModalOpen} onOk={handleFirstOk} onCancel={handleClose}>
                <Input value={categoryInput} onChange={(e) => {
                    setCategoryInput(e.target.value)
                }}></Input>
            </Modal>
            <Modal title="新增二级分类" open={isSecondModalOpen} onOk={handleSecondOk} onCancel={handleClose}>
                <Input value={categoryInput} onChange={(e) => {
                    setCategoryInput(e.target.value)
                }}></Input>
            </Modal>
            <Modal title="新增三级分类" open={isThirdModalOpen} onOk={handleThirdOk} onCancel={handleClose}>
                <Input value={categoryInput} onChange={(e) => {
                    setCategoryInput(e.target.value)
                }}></Input>
            </Modal>
            <Row className={style.rowPadding}>
                <Col className={style.colPadding} span={8}>
                    <List
                        size="small"
                        header={<div>一级分类</div>}
                        footer={
                            <Button
                                icon={<PlusOutlined/>}
                                onClick={() => showFirstModal()}>
                                新增
                            </Button>}
                        bordered
                        dataSource={categoryFirst}
                        renderItem={(item: Category) => (
                            <List.Item
                                className={item.id === activeFirstCat ? style.activeItem : style.ListItem}
                                onClick={() => {
                                    setCategorySecond(Array.isArray(item.children) ? item.children : []);
                                    setActiveFirstCat(item.id);
                                    if (item.children && item.children.length > 0) {
                                        setActiveSecondCat(item.children[0].id);
                                        setCategoryThird(item.children[0].children || []);
                                        if (item.children[0].children && item.children[0].children.length > 0) {
                                            setActiveThirdCat(item.children[0].children[0].id);
                                        } else {
                                            setActiveThirdCat(null);
                                        }
                                    } else {
                                        setActiveSecondCat(null);
                                        setCategoryThird([]);
                                        setActiveThirdCat(null);
                                    }
                                }}>
                                <Flex style={{width: "100%"}} justify={"space-between"}>
                                    <div>{item.name}</div>
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                    }}>
                                        <Popconfirm
                                            title="删除分类"
                                            description="确认删除这个分类吗？"
                                            onConfirm={() => {
                                                handleDeleteCategory(item.id)
                                            }}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <DeleteOutlined/>
                                        </Popconfirm>
                                    </div>
                                </Flex>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col className={style.colPadding} span={8}>
                    <List
                        size="small"
                        header={<div>二级分类</div>}
                        footer={<Button icon={<PlusOutlined/>} onClick={showSecondModal
                        }>新增</Button>}
                        bordered
                        dataSource={categorySecond}
                        renderItem={(item: Category) => (
                            <List.Item
                                className={item.id === activeSecondCat ? style.activeItem : style.ListItem}
                                onClick={() => {
                                    setCategoryThird(Array.isArray(item.children) ? item.children : []);
                                    setActiveSecondCat(item.id);
                                    if (item.children && item.children.length > 0) {
                                        setActiveThirdCat(item.children[0].id);
                                    } else {
                                        setActiveThirdCat(null);
                                    }
                                }}>
                                <Flex style={{width: "100%"}} justify={"space-between"}>
                                    <div>{item.name}</div>
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                    }}>
                                        <Popconfirm
                                            title="删除分类"
                                            description="确认删除这个分类吗？"
                                            onConfirm={() => {
                                                handleDeleteCategory(item.id)
                                            }}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <DeleteOutlined/>
                                        </Popconfirm>
                                    </div>
                                </Flex>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col className={style.colPadding} span={8}>
                    <List
                        size="small"
                        header={<div>三级分类</div>}
                        footer={<Button icon={<PlusOutlined/>} onClick={showThirdModal}>新增</Button>}
                        bordered
                        dataSource={categoryThird}
                        renderItem={(item: Category) => (
                            <List.Item
                                className={item.id === activeThirdCat ? style.activeItem : style.ListItem}
                                onClick={() => {
                                    setActiveThirdCat(item.id);
                                }}>
                                <Flex style={{width: "100%"}} justify={"space-between"}>
                                    <div>{item.name}</div>
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                    }}>
                                        <Popconfirm
                                            title="删除分类"
                                            description="确认删除这个分类吗？"
                                            onConfirm={() => {
                                                handleDeleteCategory(item.id)
                                            }}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <DeleteOutlined/>
                                        </Popconfirm>
                                    </div>
                                </Flex>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </>
    )
}

export default CategoryManage