import Menu from "@components/Menu";
import Modal from "@components/Modal";
import CreateChannelModal from "@components/CreateChannelModal";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal";
import InviteChannelModal from "@components/InviteChannelModal";
import useInput from "@hooks/useinput";
import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FunctionComponent, useCallback, useState } from "react"
import { Link, Redirect, Route, Switch, useParams } from 'react-router-dom';
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
    WorkspaceModal,
    WorkspaceName, 
    WorkspaceWrapper, 
    Workspaces 
} from "@layouts/Workspace/style";
import gravatar from 'gravatar';
import { Button, Input, Label } from '@pages/SignUp/style';
import { IChannel, IUser } from "@typings/db";
import loadable from "@loadable/component";


const Channel = loadable(() => import('@pages/SignUp'));
const DirectMessage = loadable(() => import('@layouts/Workspace'));

const Workspace: FunctionComponent = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [newWorkspace,onChangeNewWorkspace, setNewWorkSpace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    const { workspace } = useParams<{workspace: string}>();
    const { data: userData , error, mutate} = useSWR<IUser | false>(
        '/api/users', 
        fetcher, 
        {
            dedupingInterval: 2000,
        }
    );
    const { data: channelData } = useSWR<IChannel[]>(
        userData? `api/workspaces/${workspace}/channels` : null, 
        fetcher
    );

    const onLogout = useCallback(() => {
        axios
        .post('/api/users/logout', null, {
            withCredentials: true,
        })
        .then(() => {
            mutate(false, false);
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
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    }, []);

    if(!userData) {
        return <Redirect to="/login"/>
    }

    const toggleWorkspaceModal = useCallback(()=> {
        setShowWorkspaceModal((prev) => !(prev));
    },[]);

    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true);
    }, []);

    const onClickInviteWorkspace = useCallback(() => {
        setShowInviteWorkspaceModal(true);
    }, []);

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
                            <Link key={ws.id} to={'/workspace/${123}/channel/일반'}>
                                <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        );
                    })}
                    <AddButton onClick={onClickCreateWorkSpace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>
                        Sleact
                    </WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80}}>
                            <WorkspaceModal>
                                <h2>Sleact</h2>
                                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                                <button onClick={onClickAddChannel}>채널 만들기</button>
                                <button onClick={onLogout}>로그아웃</button>
                            </WorkspaceModal>
                        </Menu>
                        {channelData?.map((v) => (<div>{v.name}</div>))}
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
                        <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
                    </Switch>
                </Chats>
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
            <CreateChannelModal
                show={showCreateChannelModal}
                onCloseModal={onCloseModal}
                setShowCreateChannelModal={setShowCreateChannelModal}
            />
            <InviteWorkspaceModal
                show={showInviteWorkspaceModal} 
                onCloseModal={onCloseModal}
                setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
            />
            <InviteChannelModal 
                show={showInviteChannelModal} 
                onCloseModal={onCloseModal} 
                setShowInviteChannelModal={setShowInviteChannelModal}
            />
        </div>
    )
}

export default Workspace