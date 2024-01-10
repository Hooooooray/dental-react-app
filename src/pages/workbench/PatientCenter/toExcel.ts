import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const patientColumnMap = {
    id: "客户号",
    patientType: "患者类型",
    name: "姓名",
    address:"地址",
    consultationProject: "咨询项目",
    acceptancePerson: "受理人",
    createdAt: "创建时间",
    phone: "手机号码",
    phoneType: "电话类型",
    idCardNo: "身份证号码",
    gender: "性别",
    birthDate: "出生日期",
    nickname: "昵称",
    refereerName: "介绍人姓名",
    referrerType: "介绍人类型",
    referralSource: "患者来源",
    addressProvince: "家庭地址省份",
    addressCity: "家庭地址城市",
    addressDistrict: "家庭地址区/县",
    addressDetail: "家庭详细地址",
    source: "信息来源",
    weChat: "微信号",
    patientNotes: "备注信息",
    age: "年龄",
    patientTags: "患者标签",
    qq: "QQ号码",
    issuingAuthority: "身份证发证机关",
    email: "电子邮件地址",
    nationality: "国籍",
    otherMedicalRecordNo: "其他病历号",
    expiryDate: "身份证有效期截止日期",
    medicalSocialSecurityNo: "医疗社保号"
};


export const exportToExcel = (dataSource:any, fileName = 'data') => {
    const dataWithChineseHeaders = dataSource.map((item: { [x: string]: any; }) => {
        const newItem = {};
        Object.keys(item).forEach(key => {
            if (key !== 'avatar' && key !== 'key') {
                // @ts-ignore
                newItem[patientColumnMap[key] || key] = item[key];
            }
        });
        return newItem;
    });

    delete dataWithChineseHeaders.avatar
    console.log(dataWithChineseHeaders)

    const ws = XLSX.utils.json_to_sheet(dataWithChineseHeaders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const exportFileName = `${fileName}.xlsx`;

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), exportFileName);
};
