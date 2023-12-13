import { createBrowserRouter, RouterProvider,Navigate } from 'react-router-dom';

import Layout from "../components/LayoutPage";
import WorkbenchLayout from "../components/WorkbenchLayout";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import IndexPage from "../pages/IndexPage";
import GroupManageLayout from "../components/groupManageLayout";


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
                    element:<WorkbenchLayout></WorkbenchLayout>
                },
                {
                    path:'groupManage',
                    element:<GroupManageLayout></GroupManageLayout>
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