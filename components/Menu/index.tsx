import React, { CSSProperties, FunctionComponent, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './style';

interface Props {
    show: boolean;
    onCloseModal: (e:any) => void;
    style: CSSProperties;
    closeButton?: boolean;
}
const Menu: FunctionComponent<Props> = ({children, style, show, onCloseModal, closeButton}) => {
    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    }, []);
    
    return (
        <CreateMenu onClick={onCloseModal}>
            <div style={style} onClick={stopPropagation}>
                {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                {children}
            </div>
        </CreateMenu>
    );
};

Menu.defaultProps = {
    closeButton: true,
};

export default Menu;