import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FunctionComponent, useCallback } from "react"
import { Link, Redirect } from 'react-router-dom';
import useSWR from "swr";

const Workspace: FunctionComponent = ({children}) => {
    const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);
    const onLogout = useCallback(() => {
        axios
        .post('http://localhost:3095/api/users/logout', null, {
            withCredentials: true,
        })
        .then(() => {
            mutate();
        });
    }, [])

    if(!data) {
        return <Redirect to="/login"/>
    }

    return (
        <div>
            <button onClick = {onLogout}>로그아웃</button>
            {children}
        </div>
    )
}

export default Workspace