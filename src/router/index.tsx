import React, {useState, useEffect, FunctionComponent} from 'react';
import {createBrowserRouter, RouterProvider, Navigate, RouteObject, useNavigate, redirect} from 'react-router-dom';
import {useSelector} from "react-redux";
import IndexPage from "../pages/IndexPage";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import {AppState} from "../store/index"
import LayoutPage from "../components/LayoutPage";
import {getPermissions} from "../api/permission";
import WorkbenchLayout from "../components/WorkbenchLayout";
import AppointCenter from "../pages/workbench/AppointCenter";
import PatientCenter from "../pages/workbench/PatientCenter";
import PatientManage from "../pages/workbench/PatientManage";
import GroupManageLayout from "../components/GroupManageLayout";
import EmployeeManage from "../pages/groupManage/EmployeeManage";
import PermissionConfiguration from "../pages/groupManage/PermissionConfiguration";
import ProjectManage from "../pages/groupManage/ProjectManage";
import RegistrationManagement from "../pages/workbench/RegistrationManagement";

type RouterConfigType = RouteObject[];
const RouterView = () => {
    const baseRoutes: any = [
        {
            path: '/',
            element: <LayoutPage></LayoutPage>,
            children: [
                {
                    path: '',
                    element: <Navigate to='index'></Navigate>
                },
                {
                    path: 'index',
                    element: <IndexPage></IndexPage>
                },
            ]
        },
        {path: '', element: <Navigate to='index'/>},
        {path: '/login', element: <LoginPage/>},
        {path: '*', element: <NotFound/>}
    ]
    // 定义一个状态来保存路由配置
    const [routerConfig, setRouterConfig] = useState<RouterConfigType>(baseRoutes);
    const userPermissions = useSelector((state: AppState) => state.permissions);
    // console.log("userPermissions", userPermissions)
    // 根据权限动态添加路由
    useEffect(() => {
        interface Permission {
            id: number;
        }
        // 过滤和转换路由数据
        const filterRoutesByPermissions = (routes: any[], permissions: string | any[]) => {
            return routes.filter(route => {
                // 如果路由有子路由，检查是否至少有一个子路由在用户权限中
                if (route.children && route.children.length > 0) {
                    // 检查顶级路由的子路由中是否至少有一个在用户权限中
                    return route.children.some((child: { id: any; }) => permissions.includes(child.id))
                }
                // 没有子路由的情况，直接检查该路由是否在用户权限中
                return permissions.includes(route.id);
            }).map(route => {
                // 保留顶级路由，同时过滤子路由
                return {
                    ...route,
                    children: route.children ? route.children.filter((child: {
                        id: string;
                    }) => permissions.includes(child.id)) : []
                };
            });
        }
        const fetchPermissions = async () => {
            try {
                const response = await getPermissions(); // 发送请求
                const permissionsData = response.data.data;
                type ComponentMap = {
                    [key: string]: FunctionComponent;
                };

                // 定义您的组件映射
                const componentsMap:ComponentMap = {
                    'WorkbenchLayout': WorkbenchLayout,
                    'AppointCenter': AppointCenter,
                    'PatientCenter': PatientCenter,
                    'PatientManage': PatientManage,
                    'GroupManageLayout': GroupManageLayout,
                    'EmployeeManage': EmployeeManage,
                    'PermissionConfiguration': PermissionConfiguration,
                    'ProjectManage': ProjectManage,
                    'RegistrationManagement':RegistrationManagement,
                };
                const dynamicRoutes = filterRoutesByPermissions(permissionsData, userPermissions).map(route => {
                    const component = componentsMap[route.component];
                    const childRoutes = route.children.map((child: { component: string | number; path: any; }) => {
                        const childComponent = componentsMap[child.component];
                        return {
                            path: child.path,
                            element: React.createElement(childComponent)
                        };
                    });

                    // 如果存在子路由，添加重定向规则
                    if (childRoutes.length > 0) {
                        childRoutes.unshift({
                            path: '',
                            element: <Navigate to={childRoutes[0].path} />
                        });
                    }

                    return {
                        path: route.path,
                        element: React.createElement(component),
                        children: childRoutes
                    };
                });
                // console.log('filter', dynamicRoutes)
                const newBaseRoutes = [...baseRoutes];
                newBaseRoutes[0].children = [...newBaseRoutes[0].children, ...dynamicRoutes];

                // 更新路由配置
                setRouterConfig(newBaseRoutes);
            } catch (error:any) {
                console.error(error)
            }
        };
        fetchPermissions()
        // 更新路由配置
        setRouterConfig(baseRoutes);

    }, [userPermissions]); // 当权限更改时，这个effect将重新运行


    const router = createBrowserRouter(routerConfig);

    return (
        <RouterProvider router={router}/>
    );
}

export default RouterView;
