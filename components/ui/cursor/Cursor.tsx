import React, { useEffect, useRef, useState, createContext, useContext, useMemo, useCallback, RefObject } from 'react';

import { gsap } from '@/utils/gsap';
import { useHover } from 'react-aria';
import { twMerge } from 'tailwind-merge';
import Cursors, { CursorsArray } from './Cursors';

const cursorContext = createContext<{
    addCursor?: (item: ItemCursor) => void,
    setKey?: (key: string | null) => void,
}>({});

import { useIsomorphicLayoutEffect } from 'react-use';
import { IconNames } from '../icon';

export const CursorContent = ({ children, name, ...props }: {
    children: React.ReactElement,
} & Omit<ItemCursor, 'key'> & {
    name: string
}) => {
    const { addCursor, setKey } = useContext(cursorContext);
    const { isHovered, hoverProps } = useHover({});

    useEffect(() => {
        // @ts-ignore
        addCursor && addCursor({
            name,
            ...props
        })
    }, [props, name, addCursor])

    useEffect(() => {
        if (isHovered) {
            setKey && setKey(name);
        } else {
            setKey && setKey(null);
        }
    }, [isHovered, name, setKey])

    return React.cloneElement(children, { ...hoverProps })
}

type ItemCursor = ({
    name: string,
} & ({
    component: 'CursorScroll',
    props: {
        title: string
    }
} | {
    component: 'CursorActionIcon',
    props: {
        icon: IconNames,
        degree: number,
    }
}));

const DEFAULT_BALL_CLASS_NAME = ['fixed rounded-full pointer-events-none cursor-none', 'top-0 left-0']
const Cursor = ({ children }: { children: React.ReactElement }) => {
    const ref = useRef<HTMLDivElement>(null);
    const secondaryCursor = useRef<HTMLDivElement>(null);

    const list = useRef<ItemCursor[]>([]);

    const addCursor = useCallback(({
        ...props
    }: ItemCursor) => {
        list.current.push({
            ...props
        });
    }, []);

    const [key, setKey] = useState<string | null>(null);
    let ctx = useRef<gsap.Context>();
    useEffect(() => {
        ctx.current = gsap.context((context) => {
            const timeline = gsap.timeline({
                paused: true,
            });
            timeline.to('.ball_main_gsap', {
                duration: 0.3,
                scale: 0,
                ease: 'Power4.easeOut',
            }, 0).fromTo('.ball_secondary_gsap', {
                scale: 1
            },{
                duration: 0.2,
                scale: 0,
                ease: 'Power4.easeOut',
            }).to('.ball_inner_top', {
                duration: 0.1,
                scale: 1,
                ease: 'Power4.easeOut',
            }, 0.2);
            context.add('cursorScroll', () => {
                
                timeline.to('.cursor_scroll_gsap', {
                    duration: 0.1,
                    display: 'flex',
                }).fromTo('.cursor_scroll_gsap', {
                    scale: 0,
                    ease: 'Power4.easeOut',
                    backgroundColor: 'transparent',
                }, {
                    duration: 0.3,
                    scale: 1,
                    backgroundColor: '#F1F1F1',
                    ease: 'Power4.easeOut',
                }, '>').fromTo('.cursor_scroll_gsap .cursor_text_gsap', {
                    rotate: -45,
                    opacity: 0,
                }, {
                    opacity: 1,
                    duration: 0.3,
                    ease: 'Expo.easeOut',
                    rotate: 0,
                }, '-=0.2').play();
            });
            return () => timeline.kill();
        });
        return () => ctx.current?.revert();
    }, [ctx]);


    // default ball animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            // set initial position
            gsap.set(['.ball_main_gsap', '.ball_secondary_gsap', '.ball_inner_top'], {
                xPercent: -50,
                yPercent: -50,
            });
            gsap.set(['.ball_main_gsap', '.ball_secondary_gsap', '.ball_secondary_gsap'], {
                opacity: 0,
                scale: 0
            });
            // mouse move quick to
            let xTo = gsap.quickTo('.ball_main_gsap', 'x', {
                duration: 0.6,
                ease: 'Elastic.easeOut',
            })
            let yTo = gsap.quickTo('.ball_main_gsap', 'y', {
                duration: 0.6,
                ease: 'Elastic.easeOut',
            })
            let xToSecondary = gsap.quickTo(['.ball_secondary_gsap', '.ball_inner_top'], 'x', {
                duration: 0.3,
                ease: 'Power4.easeOut',
            })
            let yToSecondary = gsap.quickTo(['.ball_secondary_gsap', '.ball_inner_top'], 'y', {
                duration: 0.3,
                ease: 'Power4.easeOut',
            })
            let opacityTo = gsap.quickTo(['.ball_secondary_gsap', '.ball_main_gsap'], 'opacity', {
                duration: 0.3,
                scale: 1,
                ease: 'Power4.easeOut',
            })

            ref.current?.addEventListener("mouseenter", e => {
                opacityTo(1);
            });
            ref.current?.addEventListener("mouseleave", e => {
                opacityTo(0);
            });

            ref.current?.addEventListener("mousemove", e => {
                xTo(e.clientX);
                yTo(e.clientY);

                xToSecondary(e.clientX);
                yToSecondary(e.clientY);
            });
            return () => {
                ref.current?.removeEventListener("mouseenter", e => {
                    opacityTo(0);
                });
                ref.current?.removeEventListener("mouseleave", e => {
                    opacityTo(0);
                });
                ref.current?.removeEventListener("mousemove", e => {
                    xTo(0);
                    yTo(0);
                    xToSecondary(0);
                    yToSecondary(0);
                });
            }
        }, ref);

        return () => ctx.revert();
    }, [ref]);

    const blend = useMemo(() => typeof key == 'string' ? '' : 'mix-blend-difference', [key])
    const currentCursor = useMemo(() => list.current.find(item => item.name == key), [key]);
    useEffect(() => {
        console.log(key, currentCursor);
    }, [key]);
    return <>
        <span ref={ref}>
            <cursorContext.Provider value={{
                addCursor, setKey
            }}>
                <span className='cursor_container relative' >
                    {children}
                </span>
                <div className={twMerge(DEFAULT_BALL_CLASS_NAME, blend, 'ball_gsap ball_secondary_gsap pointer-events-none', 'h-6 w-6', 'bg-primary-600/80')} ref={secondaryCursor} ></div>
                <div className={twMerge(DEFAULT_BALL_CLASS_NAME, blend, 'ball_gsap ball_main_gsap', 'w-14 h-14', 'border-2 border-primary-500 bg-white-300/5 backdrop-blur-xs')}></div>
                <div className={twMerge(DEFAULT_BALL_CLASS_NAME, blend, 'ball_gsap ball_inner_top','w-full', 'flex justify-center items-center uppercase')}>
                    {CursorsArray.map((item, index) => {
                        const isActive = item == currentCursor?.component;
                        let otherProps = {};
                        if (isActive) {
                            otherProps = currentCursor?.props;
                        }
                        console.log(isActive);
                        return <span key={item}>
                            {Cursors[item]({ ctx, isActive, ...otherProps })}
                        </span>
                    })}
                </div>
            </cursorContext.Provider>
        </span>
        <style >
            {`
                .cursor_container {
                    cursor: default;
                }
                @media (hover: hover) {
                    .cursor_container {
                        cursor: none;
                    }
                    
                }
                @media (prefers-reduced-motion) {
                    .ball_gsap {
                        display: none;
                    }
                }
                .ball_gsap {
                    // transform: translate(-50%, -50%);
                }
                @media (hover: hover) {
                    .ball_gsap {
                        display: flex;
                    }
                }
                .ball_main_gsap {
                    z-index: 99999999999;
                }
                .ball_secondary_gsap {
                    z-index: 999999999999;
                }
                .ball_inner_top {
                    z-index: 9999999999999;
                }
            `}
        </style>
    </>;
}

export default Cursor;