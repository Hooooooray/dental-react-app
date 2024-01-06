import IndexPage from "../pages/IndexPage";
import WorkbenchLayout from "../components/WorkbenchLayout";
import {Navigate} from "react-router-dom";
import AppointCenter from "../pages/workbench/AppointCenter";
import PatientCenter from "../pages/workbench/PatientCenter";
import PatientManage from "../pages/workbench/PatientManage";
import GroupManageLayout from "../components/GroupManageLayout";
import EmployeeManage from "../pages/groupManage/EmployeeManage";
import PermissionConfiguration from "../pages/groupManage/PermissionConfiguration";
import ProjectManage from "../pages/groupManage/ProjectManage";

export default [
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
                path:'permissionConfiguration',
                element: <PermissionConfiguration></PermissionConfiguration>
            },
            {
                path:'projectManage',
                element:<ProjectManage></ProjectManage>
            }
        ]
    }
]