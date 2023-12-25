import { createBrowserRouter, RouterProvider,Navigate } from 'react-router-dom';

import Layout from "../components/LayoutPage";
import WorkbenchLayout from "../components/WorkbenchLayout";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import IndexPage from "../pages/IndexPage";
import GroupManageLayout from "../components/GroupManageLayout";
import EmployeeManage from '../pages/groupManage/EmployeeManage';
import ProjectManage from '../pages/groupManage/ProjectManage';
import AppointCenter from '../pages/workbench/AppointCenter';
import PatientCenter from '../pages/workbench/PatientCenter';
import PatientManage from '../pages/workbench/PatientManage';



const RouterView = ()=>{
    const router = createBrowserRouter([
        {
            path:'/',
            element:<Layout></Layout>,
            children:[
                {
                    path:'',
                    element:<Navigate to='index'></Navigate>
                },
                {
                    path:'index',
                    element:<IndexPage></IndexPage>
                },
                {
                    path:'workbench',
                    element:<WorkbenchLayout></WorkbenchLayout>,
                    children:[
                        {
                            path:'',
                            element: <Navigate to="appointCenter" />
                        },
                        {
                            path:'appointCenter',
                            element:<AppointCenter></AppointCenter>
                        },
                        {
                            path:'patientCenter',
                            element:<PatientCenter></PatientCenter>
                        },
                        {
                            path:'patientManage',
                            element:<PatientManage></PatientManage>
                        },
                        
                    ]
                },
                {
                    path:'groupManage',
                    element:<GroupManageLayout></GroupManageLayout>,
                    children:[
                        {
                            path:'',
                            element: <Navigate to="employeeManage" />
                        },
                        {
                            path:'employeeManage',
                            element:<EmployeeManage></EmployeeManage>
                        },
                        {
                            path:'projectManage',
                            element:<ProjectManage></ProjectManage>
                        }
                    ]
                }
            ]
        },
        {
            path:'/login',
            element:<LoginPage></LoginPage>
        },

        {
            path:'*',
            element:<NotFound></NotFound>
        }
    ])

    return (
        <RouterProvider router={router}></RouterProvider>
    );
}

export default RouterView