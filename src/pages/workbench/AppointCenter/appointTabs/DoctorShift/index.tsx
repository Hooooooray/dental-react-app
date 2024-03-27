import React, {useEffect, useState} from "react";
import {App, Button, Checkbox, DatePicker, Flex, Pagination, Radio, RadioChangeEvent, Space, Table, Layout} from "antd";
import {ColumnsType} from "antd/es/table";
import {getShifts} from "../../../../../api/shift";
import style from './style.module.scss'
import {getEmployees} from "../../../../../api/employee";
import {batchAddOrEditDoctorShifts, getDoctorShifts} from "../../../../../api/doctorShift";

const {Header, Footer, Sider, Content} = Layout;
const DoctorShift = () => {
    const {message} = App.useApp();

    interface DoctorShiftDataType {
        id: number;
        key: React.Key;
    }

    const [doctorShiftData, setDoctorShiftData] = useState<DoctorShiftDataType[]>([])
    const [doctorShiftColumns, setDoctorShiftColumns] = useState<ColumnsType<DoctorShiftDataType>>()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [position, setPosition] = useState('DOCTOR')


    interface ShiftData {
        id: number;
        name: string;
        startTime: string;
        endTime: string;
    }


    // 加载班次数据并构建列
    const loadShiftsAndBuildColumns = async () => {
        const initColumns: ColumnsType<DoctorShiftDataType> = [
            {
                title: '科室',
                fixed: 'left',
                dataIndex: 'dentalDepartment',
                key: 'dentalDepartment',
                width: 100,
            },
            {
                title: '员工',
                fixed: 'left',
                dataIndex: 'name',
                key: 'name',
                width: 100
            },
        ]
        const response = await getShifts();
        if (response.data.success) {
            const shifts: ShiftData[] = response.data.data;
            const daysOfWeek = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
            // 为每天动态生成包含所有班次的列
            const dynamicColumns = daysOfWeek.map((day, index) => ({
                title: day,
                dataIndex: day.toLowerCase(),
                key: day.toLowerCase(),
                width: 200,
                children: shifts.map(shift => ({
                    title: shift.name,
                    dataIndex: `${day.toLowerCase()}_${shift.name}`,
                    key: `${day.toLowerCase()}_${shift.id}`,
                    width: 80,
                    render: (_: any, record: any) => {
                        const dataIndex = `${day.toLowerCase()}_${shift.name}`;
                        return (
                            <Checkbox
                                checked={!!record[dataIndex]}
                                onChange={e => onCheckboxChange(record.key, `${day.toLowerCase()}_${shift.name}`, e.target.checked)}
                            />
                        );
                    },
                })),
            }));
            setDoctorShiftColumns([...initColumns, ...dynamicColumns]);
        }
    };

    const loadEmployeeData = async () => {
        console.log(position)
        const response = await getDoctorShifts(page, pageSize, position)
        setTotal(response.data.total)
        if (response.status === 200 && response.data.success) {
            let employeeDatas = response.data.data
            setDoctorShiftData(employeeDatas.map((employeeData: any) => {
                const formattedEmployee: any = {
                    dentalDepartment: employeeData.dentalDepartment,
                    name: employeeData.name,
                    key: employeeData.id,
                };
                employeeData.doctorShifts.forEach((shift: any) => {
                    JSON.parse(shift.week).forEach((dayOfWeek: number) => {
                        const dayString = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',][dayOfWeek].toLowerCase();
                        const shiftKey = `${dayString}_${shift.shift.name}`;
                        formattedEmployee[shiftKey] = true; // 标记为选中
                    });
                });
                return formattedEmployee
            }))
        }
    }

    const onCheckboxChange = (recordKey: any, dataIndex: any, eChecked: any) => {
        setDoctorShiftData(currentData => {
            return currentData.map(item => {
                if (item.key === recordKey) {
                    return {...item, [dataIndex]: eChecked};
                }
                return item;
            });
        });
    }


    const saveDoctorShift = async () => {
        const weekDayMapping: { [key: string]: number } = {
            "星期一": 0,
            "星期二": 1,
            "星期三": 2,
            "星期四": 3,
            "星期五": 4,
            "星期六": 5,
            "星期日": 6,
        };
        const shiftResponse = await getShifts()
        let shiftMapping: { [key: string]: number } = {};

        if (shiftResponse.status === 200 && shiftResponse.data.success) {
            const shiftData = shiftResponse.data.data;
            shiftData.forEach((item: { name: string; id: number; }) => {
                shiftMapping[item.name] = item.id;
            });
        }
        console.log(shiftMapping)

        interface DoctorShiftOperation {
            employeeId: number;
            shiftId: number;
            week: string;
        }

        const operations: DoctorShiftOperation[] = doctorShiftData.flatMap((item) => {
            return Object.keys(shiftMapping).map((shiftName) => {
                const shiftId = shiftMapping[shiftName];
                const weekArray: number[] = [];

                Object.keys(weekDayMapping).forEach((weekDay) => {
                    const key = `${weekDay}_${shiftName}`.toLowerCase();
                    // @ts-ignore
                    if (item[key] === true) {
                        weekArray.push(weekDayMapping[weekDay]);
                    }
                });

                return {
                    employeeId: Number(item.key),
                    shiftId,
                    week: JSON.stringify(weekArray.sort((a, b) => a - b)),
                };
            });
        });
        console.log(operations)

        // 发送操作数组
        try {
            const response = await batchAddOrEditDoctorShifts(operations);
            if (response.status === 200) {
                message.success('保存成功');
            } else {
                message.error('保存失败');
            }
        } catch (error) {
            console.error('保存失败', error);
            message.error('保存失败');
        }


        console.log('saveDoctorShift', doctorShiftData)
    }

    const handleChangePage = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }

    const onChange = (e: RadioChangeEvent) => {
        console.log(`radio checked:${e.target.value}`);
        setPosition(e.target.value)
    };

    useEffect(() => {
        loadShiftsAndBuildColumns().then(() => {
            loadEmployeeData().then(r => {
            })
        });
    }, [page, pageSize, position]);


    return (
        <>
            <Content style={{padding: "10px"}}>
                <Flex style={{marginBottom:"10px"}}>
                    <Space>
                        <Radio.Group defaultValue={"DOCTOR"} buttonStyle="solid" onChange={onChange}>
                            <Radio.Button value="DOCTOR">医生</Radio.Button>
                            <Radio.Button value="COUNSELOR">咨询师</Radio.Button>
                        </Radio.Group>
                        <Button type={"primary"} onClick={saveDoctorShift}>保存</Button>
                    </Space>
                </Flex>
                <Table className={style.centerHead} pagination={false} bordered={true} columns={doctorShiftColumns}
                       dataSource={doctorShiftData}
                       scroll={{x: "max-content", y: '64vh'}}>
                </Table>
                <Pagination
                    style={{marginTop: '10px'}}
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    showQuickJumper
                    showSizeChanger
                    pageSizeOptions={[10, 20, 30, 40, 50, 100]}
                    showTotal={(total) => `共 ${total} 条`}
                    onChange={handleChangePage}
                />
            </Content>
        </>
    );
}

export default DoctorShift