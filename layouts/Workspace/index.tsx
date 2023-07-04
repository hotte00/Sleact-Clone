import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FunctionComponent, useCallback, useState } from "react"
import { Link, Redirect } from 'react-router-dom';
import useSWR from "swr";
import { Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceName, WorkspaceWrapper, Workspaces } from "@layouts/Workspace/style";
import gravatar from 'gravatar';
import Menu from "@components/Menu";

const Workspace: FunctionComponent = ({children}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
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

    const onClickUserProfile = useCallback(() => {
        setShowUserMenu((prev) => !prev);
    }, []);

    if(!data) {
        return <Redirect to="/login"/>
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick = {onClickUserProfile}>
                        <ProfileImg src = {gravatar.url(data.email, {s: '28px', d: 'retro'})} alt= {data.nickname}/>
                        {showUserMenu && (
                        <Menu style={{right:0, top:38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                            <ProfileModal>
                                <img src={gravatar.url(data.email, {s: '36px', d: 'retro'})} alt= {data.nickname}/>
                                <div>
                                    <span id="profile-name">{data.nickname}</span>
                                    <span id="profile-active">Active</span>
                                </div>
                            </ProfileModal>
                            <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                        </Menu>
                        )}
                    </span>
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>test</Workspaces>
                <Channels>
                    <WorkspaceName>
                        Sleact
                    </WorkspaceName>
                    <MenuScroll>
                        MenuScroll
                    </MenuScroll>
                </Channels>
                <Chats></Chats>
            </WorkspaceWrapper>
            {children}
        </div>
    )
}

export default Workspace