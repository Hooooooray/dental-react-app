import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {updatePermissions} from "../../store/actions/actions";
import {verify} from "../../api/user";

const IndexPage = () => {
    const dispatch = useDispatch();
    const store = useSelector(state => state);
    console.log(store)

    useEffect(() => {
        verify().then(res => {
            console.log(res)
            if (res.status === 200) {
                const loadPermissions = res.data.data.permissions
                const loadPermissionsArray = loadPermissions.length > 1 ? loadPermissions.split(',') : [loadPermissions]
                if (loadPermissionsArray.length > 0) {
                    dispatch(updatePermissions(loadPermissionsArray.filter((permission: string) => permission !== '')
                        .map((permission: string) => Number(permission))))
                }
            }
        })
    }, [])
    return (
        <>
            <div>IndexPage</div>
        </>
    )
}

export default IndexPage