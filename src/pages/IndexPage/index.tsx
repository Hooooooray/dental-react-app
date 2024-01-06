import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {updatePermissions} from "../../store/actions/actions";
import {verify} from "../../api/user";
import {getPermissions} from "../../api/permission";
import store from "../../store";

const IndexPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {

    }, [])
    return (
        <>
            <div>IndexPage</div>
        </>
    )
}

export default IndexPage