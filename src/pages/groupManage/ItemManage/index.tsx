import React, {Button, Flex, GetProps, Layout, Table, Tree} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {getCategories} from "../../../api/category";
import {TreeDataNode} from "antd/lib";
import style from './style.module.scss'

const {Header, Footer, Sider, Content} = Layout;
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const ItemManage = () => {
    const [treeData, setTreeData] = useState<TreeDataNode[]>([])
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const {DirectoryTree} = Tree;
    const onSelect: DirectoryTreeProps['onSelect'] = (keys) => {
        console.log('select', keys)
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
    return (
        <>
            <Content style={{padding: "10px"}}>
                <Button type={"primary"} icon={<PlusOutlined/>}>物品新增</Button>
                <Flex style={{marginTop:"10px"}}>
                    <Flex vertical={true}>
                        <Flex justify={"space-between"} align={"center"} className={style.categoryTitle}>
                            <div>全部物品</div>
                            <a href="./categoryManage">分类管理</a>
                        </Flex>
                        <div style={{width: "200px", height: "400px", overflow: "scroll"}}>
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
                    <Table></Table>
                </Flex>
            </Content>
        </>
    )
}

export default ItemManage