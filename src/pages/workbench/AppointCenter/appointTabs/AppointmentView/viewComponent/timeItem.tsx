//timeItem.tsx
import React from "react";
import {Flex} from "antd";

const timeItem = ()=>{
    const numbers12 = Array.from({length: 12}, (_, index) => index);
    const minutesItem = numbers12.map((number) => (
        <Flex
            justify={"center"}
            align={"center"}
            style={{height: "50px", fontSize: "12px"}}
            key={number}
        >
            {number * 5 < 10 ? `0${number * 5}` : number * 5}
        </Flex>
    ));
    const timeItem = numbers12.map((number) => (
        <div key={number}>
            <Flex style={{borderBottom:"1px solid #E0E0E0",marginBottom:"-1px"}}>
                <Flex justify={"center"} align={"center"}
                      style={{background: "#EEF5FE", height: "600px", width: "32px", fontSize: "16px"}}>{number+8}
                </Flex>
                <Flex vertical={true} style={{borderRight:"#E0E0E0 1px solid", height: "600px", width: "22px"}}>
                    {minutesItem}
                </Flex>
            </Flex>
        </div>
    ))
    return(
        <>
            {timeItem}
        </>
    )
}

export default timeItem()
