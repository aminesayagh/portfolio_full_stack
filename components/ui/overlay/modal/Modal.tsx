import React, { useEffect, useState } from 'react';
import { useModal } from 'react-aria';
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay, ModalRenderProps, } from 'react-aria-components';
import { DialogTriggerProps, ModalOverlayProps } from 'react-aria-components';
import { mergeClassName } from '@/helpers/className'
import { twMerge } from 'tailwind-merge';

const ModalContext = React.createContext<{ isOpen: boolean, handler: () => void }>({ isOpen: false, handler: () => console.log('error') });

const ModalUi = ({ children, isOpenExternal, menuHandler, ...props }: {
    children: React.ReactNode[] | React.ReactNode,
    isOpenExternal?: boolean,
    menuHandler?: () => void
}) => {
    const [isOpen, setOpen] = useState(false);
    const menuHandlerIntern = () => {
        setOpen(!isOpen);
    }
    if(menuHandler === undefined && isOpenExternal === undefined) throw new Error('ModalUi: isOpen or handler is undefined');
    
    if (typeof isOpenExternal !== 'boolean' || menuHandler === undefined) {
        return (
            <DialogTrigger {...props}>
                <ModalContext.Provider value={{ isOpen, handler: menuHandlerIntern }} >
                    {children}
                </ModalContext.Provider>
            </DialogTrigger>
        )
    }
    return (
        <DialogTrigger {...props}>
            <ModalContext.Provider value={{ isOpen: isOpenExternal, handler: menuHandler }} >
                {children}
            </ModalContext.Provider>
        </DialogTrigger>
    )
}


const ButtonUi = ({ children, className = '', ...props }: { children: React.ReactNode | (({ handler, isOpen }: { handler: () => void, isOpen: boolean }) => React.ReactNode) } & { className?: string }) => {
    const { isOpen, handler } = React.useContext(ModalContext);
    if(handler === undefined) throw new Error('ModalUiContent: isOpen or handler is undefined');

    return typeof children == 'function' ? children({ isOpen ,handler}) : <Button className={mergeClassName('outline-none', className)} onPress={handler} {...props}>{children}</Button>
}

const ModalUiOverlay = ({ children, ...props }: { children: React.ReactNode[] | React.ReactNode } & ModalOverlayProps) => {
    const { isOpen } = React.useContext(ModalContext);
    if (typeof isOpen !== 'boolean') throw new Error('ModalUiOverlay: isOpen is undefined');

    return <ModalOverlay {...props}>{children}</ModalOverlay>
}

const ModalUiContent = ({ children, className, ...props }: { children: React.ReactNode | ((arg: { handler: () => void }) => React.ReactNode) } & Omit<ModalOverlayProps, 'children'> & React.RefAttributes<HTMLDivElement>) => {
    const { isOpen, handler } = React.useContext(ModalContext);
    useEffect(() => {
        console.log('ModalUiContent', isOpen);
    }, [isOpen])
    if(handler === undefined || typeof isOpen !== 'boolean') throw new Error('ModalUiContent: isOpen or handler is undefined');

    return <Modal isOpen={isOpen} onOpenChange={handler} className={mergeClassName('remove_outline', className)}  {...props}>
        <Dialog className='remove_outline'>
            {typeof children == 'function' ? (value) => children({ handler }) : children}
        </Dialog>
    </Modal>
}

ModalUi.Button = ButtonUi;
ModalUi.Overlay = ModalUiOverlay;
ModalUi.Content = ModalUiContent;

export default ModalUi;