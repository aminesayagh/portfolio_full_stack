import React, { useEffect, useRef, useState, useContext } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';
import { ScrollProvider } from './ScrollContext';
import { gsap } from '@/utils/gsap';
import LocomotiveScroll from 'locomotive-scroll';
import { ScrollTrigger } from '@/utils/gsap';



const AnimationConf = ({ children }: { children: React.ReactNode }) => {
    let app = useRef<HTMLDivElement | null>(null);
    const { scrollbar, setScrollbar } = useContext(ScrollProvider)
    useEffect(() => {
        let scroll: LocomotiveScroll | null = null;
        import('locomotive-scroll').then((locomotiveModule) => {
            let el = document.querySelector('[data-scroll-container]') as HTMLElement;
            scroll = new locomotiveModule.default({
                el: el,
                smooth: true,
                reloadOnContextChange: true,
                multiplier: 1,
                getSpeed: true,
                getDirection: true,
                smartphone: {
                    smooth: false
                },
                // @ts-ignore
                tablet: {
                  smooth: true
                },

            })
            setScrollbar(scroll);

            scroll.on('scroll', () => {
                ScrollTrigger.update()
            })

            ScrollTrigger.scrollerProxy('[data-scroll-container]', {
                scrollTop(value) {
                    return arguments.length
                        // @ts-ignore
                        ? scroll.scrollTo(value, {duration: 0, disableLerp: true}) : scroll.scroll.instance.scroll.y
                },
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight,
                    }
                },

                pinType: el?.style?.transform
                    ? 'transform'
                    : 'fixed',
            })
            ScrollTrigger.defaults({ scroller: el })
            ScrollTrigger.addEventListener('refresh', () => {
                scroll?.update()
            })
            // ScrollTrigger.refresh()
        }).catch((err) => {
            console.error('Error importing locomotive-scroll');
            console.error(err);
            setScrollbar(null);
        })

        window.addEventListener('DOMContentLoaded', () => {
            scroll?.update()
            // ScrollTrigger.refresh() // typed error here
        })

        window.addEventListener('resize', () => {
            scroll?.update();            
            // ScrollTrigger.refresh() // typed error here
        })
        return () => {
            scroll?.destroy();
            scrollbar?.destroy();
            ScrollTrigger.getAll().forEach((trigger) => {
                trigger.kill(true);
            });
        }
    }, [])
    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.config({
                nullTargetWarn: false
            });
            if(scrollbar) {
                gsap.to(app, 0, { css: { visibility: 'visible' } });
            }
        });
        return () => {
            ctx.revert();
            scrollbar?.destroy();
        }
    }, [scrollbar]);
    return <><div ref={el => {
        // @ts-ignore
        app = el
    }} className="app-container" id='main-container'>
        {children}
    </div>
        <style jsx>{`
            .app-container{
                visibility: hidden;
            }
        `}</style>
    </>

}

export default AnimationConf;