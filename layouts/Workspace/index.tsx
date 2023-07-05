import Menu from "@components/Menu";
import Modal from "@components/Modal";
import useInput from "@hooks/useinput";
import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FunctionComponent, useCallback, useState } from "react"
import { Link, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from "swr";
import { 
    AddButton, 
    Channels, 
    Chats, 
    Header, 
    LogOutButton, 
    MenuScroll, 
    ProfileImg, 
    ProfileModal, 
    RightMenu, 
    WorkspaceButton, 
    WorkspaceName, 
    WorkspaceWrapper, 
    Workspaces 
} from "@layouts/Workspace/style";
import gravatar from 'gravatar';
import { Button, Input, Label } from '@pages/SignUp/style';
import { IUser } from "@typings/db";


const Workspace: FunctionComponent = ({children}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal ,setShowCreateWorkspaceModal] = useState(false);
    const [newWorkspace,onChangeNewWorkspace, setNewWorkSpace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    const { data:userData , error, mutate} = useSWR<IUser | false>('/api/users', fetcher);
    const onLogout = useCallback(() => {
        axios
        .post('/api/users/logout', null, {
            withCredentials: true,
        })
        .then(() => {
            mutate();
        });
    }, [])

    const onClickUserProfile = useCallback((e) => {
        e.stopPropagation();
        setShowUserMenu((prev) => !prev);
    }, []);

    const onClickCreateWorkSpace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    }, []);

    const onCreateWorkspace = useCallback((e) => {
        e.preventDefault();
        if(!newWorkspace || !newWorkspace.trim()) return;
        if(!newUrl || !newUrl.trim()) return;
        axios
        .post(
        '/api/workspaces', 
        {
            workspace: newWorkspace,
            url : newUrl,
        }, 
        {
            withCredentials: true,
        })
        .then(() => {
            mutate();
            setShowCreateWorkspaceModal(false);
            setNewWorkSpace('');
            setNewUrl('');
        })
        .catch((error)=>{
            console.dir(error);
            toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl]);

    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
    }, []);

    if(!userData) {
        return <Redirect to="/login"/>
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick = {onClickUserProfile}>
                        <ProfileImg src = {gravatar.url(userData.email, {s: '28px', d: 'retro'})} alt= {userData.nickname}/>
                        {showUserMenu && (
                        <Menu style={{right:0, top:38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                            <ProfileModal>
                                <img src={gravatar.url(userData.email, {s: '36px', d: 'retro'})} alt= {userData.nickname}/>
                                <div>
                                    <span id="profile-name">{userData.nickname}</span>
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
                <Workspaces>
                    {userData?.Workspaces?.map((ws) => {
                        return (
                            <Link key={ws.id} to={'/workspace/${}/channel/일반'}>
                                <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        );
                    })}
                    <AddButton onClick={onClickCreateWorkSpace}>+</AddButton>
                </Workspaces>
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
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>워크스페이스 이름</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
                    </Label>
                    <Label id="workspace-url-label">
                        <span>워크스페이스 url</span>
                        <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl}/>
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
        </div>
    )
}

export default Workspace