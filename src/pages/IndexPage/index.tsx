import React, {useEffect, useRef, useState} from "react";
import {Flex, Layout} from "antd";
import {Chart} from '@antv/g2';
import {getEmployees} from "../../api/employee";
import style from './style.module.scss'
import {getTotal} from "../../api/total";

const {Content} = Layout;

const IndexPage = () => {
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const [employeeTotal, setEmployeeTotal] = useState(0);
    const [employeeData, setEmployeeData] = useState<any>([]);
    const [totalPatient, setTotalPatient] = useState(0)
    const [totalAppointment, setTotalAppointment] = useState(0)
    const [totalRegistration, setTotalRegistration] = useState(0)


    useEffect(() => {
        getEmployees().then(res => {
            console.log(res)
            if (res.status === 200 && res.data.success === true) {
                setEmployeeTotal(res.data.total);
                setEmployeeData(res.data.data)
            }
        });
        getTotal().then(res=>{
            if (res.status === 200 && res.data.success === true) {
                console.log(res.data.data)
                setTotalPatient(res.data.data.totalPatient)
                setTotalAppointment(res.data.data.totalAppointment)
                setTotalRegistration(res.data.data.totalRegistration)
            }
        })
    }, []);

    useEffect(() => {
        if (!chartRef2.current) {
            return
        }
        const data = [
            {'今日新增': '今日新增患者', '数量': totalPatient},
            {'今日新增': '今日新增预约', '数量': totalAppointment},
            {'今日新增': '今日新增挂号', '数量': totalRegistration},
        ];
        const chart2 = new Chart({
            container: chartRef2.current,
            autoFit: true,
        });

        chart2.interval().data(data).encode('x', '今日新增').encode('y', '数量');

        chart2.render();

        return () => {
            chart2.destroy();
        };
    }, [totalPatient,totalAppointment,totalRegistration]);

    useEffect(() => {
        if (!chartRef1.current || employeeTotal === 0 || employeeData.length === 0) {
            return;
        }

        // 使用索引签名来定义 positionCounts
        const positionCounts: { [key: string]: number } = {};

        employeeData.forEach((employee: { position: string | number; }) => {
            positionCounts[employee.position] = (positionCounts[employee.position] || 0) + 1;
        });

        const data = Object.keys(positionCounts).map(position => ({
            item: position,
            count: positionCounts[position],
            percent: positionCounts[position] / employeeTotal
        }));

        const chart1 = new Chart({
            container: chartRef1.current,
            autoFit: true,
        });

        chart1.coordinate({type: 'theta', outerRadius: 0.8, innerRadius: 0.5});

        chart1
            .interval()
            .data(data)
            .transform({type: 'stackY'})
            .encode('y', 'percent')
            .encode('color', 'item')
            .legend('color', {position: 'bottom', layout: {justifyContent: 'center'}})
            .label({
                position: 'outside',
                text: (data: { item: any; percent: number; }) => `${data.item}: ${(data.percent * 100).toFixed(2)}%`,
            })
            .tooltip((data) => ({
                name: data.item,
                value: `${(data.percent * 100).toFixed(2)}%`,
            }));

        chart1
            .text()
            .style('text', '员工总数')
            .style('x', '50%')
            .style('y', '50%')
            .style('dy', -25)
            .style('fontSize', 34)
            .style('fill', '#8c8c8c')
            .style('textAlign', 'center');

        chart1
            .text()
            .style('text', `${employeeTotal}`)
            .style('x', '50%')
            .style('y', '50%')
            .style('dx', -25)
            .style('dy', 25)
            .style('fontSize', 44)
            .style('fill', '#8c8c8c')
            .style('textAlign', 'center');

        chart1
            .text()
            .style('text', '名')
            .style('x', '50%')
            .style('y', '50%')
            .style('dx', 35)
            .style('dy', 25)
            .style('fontSize', 34)
            .style('fill', '#8c8c8c')
            .style('textAlign', 'center');

        chart1.render();

        return () => {
            chart1.destroy();
        };
    }, [employeeTotal]); // 依赖 employeeTotal，当它更新时重新渲染图表

    return (
        <>
            <Layout>
                <Content>
                    <Flex className={style.flexContainer} justify={"center"} align={"center"}>
                        <div ref={chartRef1} style={{width: '100%', height: '400px'}}></div>
                        <div ref={chartRef2} style={{width:'100%',height:'400px'}}></div>
                    </Flex>
                </Content>
            </Layout>
        </>
    );
};

export default IndexPage;
