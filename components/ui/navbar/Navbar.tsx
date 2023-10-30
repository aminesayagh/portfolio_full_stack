import { useState, useRef, useEffect, useContext, createContext, useMemo } from 'react';
import { useRouter } from 'next/router';

import { Link as LinkUi } from '@/components/ui';
import { gsap } from '@/utils/gsap';

import { useIsomorphicLayoutEffect } from 'react-use';


import { NavbarProps, NavbarType, BrandProps, ContentProps, ItemProps, LinkProps } from './Navbar.type';
import { twMerge } from 'tailwind-merge';
import { containerStyle } from '@/components/ui';
import { useHover } from 'react-aria';
import { zIndex } from '../conf';
import { ScrollProvider } from '@/context/AnimationConf';

const NavbarAnimation = createContext<{ scale: string } | null>(null);

const Navbar: NavbarType = ({ children, size, className, inTopOfScroll, ...props }: NavbarProps) => {
    const delta = useRef(0);
    const lastScrollY = useRef(0);

    const [active, setActive] = useState(false);
    const { scrollbar } = useContext(ScrollProvider);
    console.log('navbar')
    // useEffect(() => {
    //     scrollbar && scrollbar.on('scroll', (e) => {
    //         // console.log(e.delta.y, lastScrollY.current);
    //         if (e?.delta?.y < 140) {
    //             setActive(false);
    //         } else {
    //             setActive(true);
    //         }

    //         const diff = Math.abs(e.delta.y - lastScrollY.current);
    //         if (e.delta.y >= lastScrollY.current) {
    //             delta.current = delta.current >= 10 ? 10 : delta.current + diff;
    //         } else {
    //             delta.current = delta.current <= -10 ? -10 : delta.current - diff;
    //         }
    //         if (delta.current >= 10 && e.delta.y > 200) {
    //             gsap.to(".header-gsap", { duration: 0.3, y: -100, opacity: 0, ease: "power2.inOut" });
    //         } else if (delta.current <= -10 || e.delta.y < 200) {
    //             gsap.to(".header-gsap", { duration: 0.3, y: 0, opacity: 1, ease: "power2.inOut" });
    //         }
    //         lastScrollY.current = e.delta.y;
    //     });
    // }, [lastScrollY.current, delta.current, scrollbar]);

    const padding = useMemo(() => active ? '0.8rem' : '1rem', [active]);
    const backdropFilter = useMemo(() => active ? 'blur(40px)' : 'blur(0px)', [active]);
    const backgroundColor = useMemo(() => active ? '#1f1f1f90' : 'transparent', [active]);


    return <NavbarAnimation.Provider value={{ scale: active ? 'scale(80%)' : 'scale(100%)' }}>
        <header className={twMerge(
            'header-fixed fixed top-0 left-0 w-full max-w-[100vw] py-4 z-header', className, zIndex.navbar, 'header-gsap will-change-transform-animation'
        )}
            {...props}
        >
            <div className={twMerge('flex flex-row items-center justify-between w-full', containerStyle({ size }))}>
                {children}
            </div>
        </header>
    </NavbarAnimation.Provider>
};

const Brand = ({ children, className, ...props }: BrandProps) => {
    const styled = useContext(NavbarAnimation);
    if (!styled) return null;

    return <>
        <div className={twMerge(className)} >
            {children}
        </div>
        <style jsx>{`
            div {
                transform: ${styled.scale};
                transition: transform 0.2s ease;
            }
        `}</style>
    </>
}

const ContentActiveItem = createContext<{ activeItem: string; handleItemClick: (item: string) => void } | null>(null)

const Content = ({ children, className, ...props }: ContentProps) => {
    const router = useRouter();
    const [activeItem, setActiveItem] = useState<string>('');


    useEffect(() => {
        const activeItem = router.pathname.split('/')[1];
        setActiveItem(activeItem);
    }, [router.pathname])
    const handleItemClick = (item: string) => {
        setActiveItem(item);
    }

    // if(!styled) return null;

    return <>
        <ContentActiveItem.Provider value={{ activeItem, handleItemClick }}>
            <div className={twMerge('flex flex-row items-center', className)} {...props}>
                {children}
            </div>
        </ContentActiveItem.Provider>
    </>
}

const useActiveItem = (href: string) => {
    const activeItem = useContext(ContentActiveItem);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (activeItem) {
            setIsActive(activeItem.activeItem === href);
        }
    }, [activeItem, href])
    return { isActive, handlerActiveItem: activeItem?.handleItemClick } as const;
}

const Item = ({ children, href }: ItemProps) => {
    const { isActive, handlerActiveItem } = useActiveItem(href.toString());

    if (!handlerActiveItem) return <></>;

    return <>{children({ isActive, handlerActiveItem })}</>
}

const Link = ({ children, href, className, ...props }: LinkProps) => {
    const { isActive, handlerActiveItem } = useActiveItem(href.toString());
    const [data, setData] = useState<object>();

    const { hoverProps, isHovered } = useHover({
        onHoverStart: (e) => {
            setData({ 'data-entering': true, 'data-exiting': false });
        },
        onHoverEnd: (e) => {
            setData({ 'data-entering': false, 'data-exiting': true });
        }
    });

    if (!handlerActiveItem) return null;

    return <LinkUi href={href} {...hoverProps} {...data} className={twMerge(className, 'whitespace-nowrap')} {...props} >
        {typeof children === 'function' ? children(isActive, handlerActiveItem) : children}
    </LinkUi>
}

Navbar.Brand = Brand;
Navbar.Content = Content;
Navbar.Item = Item;
Navbar.Link = Link;

export default Navbar;