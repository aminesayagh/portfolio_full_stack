import React, { ElementRef, useContext, useRef, useEffect, useCallback } from 'react';
 
import { memo } from 'react';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import { useIsomorphicLayoutEffect } from 'react-use';


import  Link from '@/components/ui/typography/Link';
import Button from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Text from '@/components/ui/typography/Text';
import { ScrollProvider } from '@/context/AnimationConf';
import { gsap } from 'utils/gsap';
import useGsap from '@/hook/useGsap';
import { MenuItem } from '@/conf/router';
import { useEventListener } from '@/hook/useEventListener';

const BASE_LOCALE_SOCIAL = 'socialNetwork';

const ICON_SIZE_CLASS_NAME = 'w-5 h-5 lg:w-6 lg:h-6';

const FollowUs = () => {
    const ref = useRef<ElementRef<'div'>>(null);
    const menuSocialNetworksRef = useRef<MenuItem[]>([]);

    useEffect(() => {
        const { signal } = new AbortController();
        let active = false;
        fetch('/api/menu?name=socialNetworks', {
            signal
        }).then(async (res1) => {
            res1.json().then((response1) => {
                if(active) return;
                menuSocialNetworksRef.current = response1.items;
            })
        });
        return () => {
            active = true;
        }
    }, [menuSocialNetworksRef]);
    const ctx = useRef<gsap.Context | null>(null);

    useIsomorphicLayoutEffect(() => {
        if(!menuSocialNetworksRef.current.length) return;
        ctx.current = gsap.context((self) => {      
            const tl = gsap.timeline({
                paused: true
            }).fromTo('.fallow-button-gsap', {
                xPercent: 0,
            }, {
                xPercent: 100,
                duration: 0.3,
                ease: 'Power4.out',
            }).to('.fallow-button-gsap', {
                width: 0,
                duration: 0.01
            }).fromTo('.social-button-gsap', {
                xPercent: -100,
                opacity: 0,
            }, {
                opacity: 1,
                xPercent: 0,
                stagger: -0.07,
                duration: 0.3,
            });
            
            

            self.add('followButtonShow', () => {
                tl.play();
            });
            self.add('followButtonHide', () => {
                tl.reverse();
            });

            gsap.set('.social-button-gsap', {
                xPercent: -100,
                opacity: 0,
            });
            gsap.set('.fallow-button-gsap', {
                xPercent: 0,
            });
            return () => {
                tl.kill();
            }
        }, ref)
        return () => {
            ctx.current?.revert();
        }
    }, [ref, menuSocialNetworksRef.current.length]);
    const handler = useCallback(() => {
        console.log('start');
        ctx.current?.followButtonShow();
    }, [ctx]);
    const handlerLeave = useCallback(() => {
        console.log('end');
        ctx.current?.followButtonHide();
    }, [ctx]);
    useEventListener('mouseenter', handler, ref);
    useEventListener('mouseleave', handlerLeave, ref);

    const { t } = useTranslation();
    return (
        <div ref={ref} className='flex flex-row justify-end items-center gap-4'>
            <div className='flex flex-row gap-8 items-center'>
                {menuSocialNetworksRef.current.map((item, index) => <li key={index} className='overflow-hidden list-none'>
                    <Link size='sm' href={item.link} degree='4' weight='semibold' className='social-button-gsap' >
                        {t(`${BASE_LOCALE_SOCIAL}.${item.id}.key`)}
                    </Link>
                </li>
                )}
            </div>
            <span className='overflow-hidden'>
                <Text p className='fallow-button-gsap whitespace-nowrap-important' degree='3' weight='semibold' size='sm' >
                    {t('footer.socialNetwork')}
                </Text>
            </span>
            <Icon name='IconShare' size='24' className={twMerge('stroke-gray-400', ICON_SIZE_CLASS_NAME)} />
        </div>
    )
}

// const FollowUs = memo(FollowUs);

const TextAnimated = ({ phrase, className, ...props }: { phrase: string } & Omit<React.ComponentProps<typeof Text>, 'div' | 'children'>) => {
    const container = useRef<ElementRef<'div'>>(null);
    useGsap(() => {
        gsap.fromTo('.word-gsap', {
            y: '100%',
        }, {
            y: '0%',
            stagger: 0.04,
            duration: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: container.current,
                start: 'top bottom-=80px',
                toggleActions: 'play none reverse reverse'
            }
        })
    }, container);
    return <span ref={container} ><Text div className={twMerge('flex flex-row flex-wrap', className)} {...props}>
        {phrase.split(' ').map((word, index) => {
            return <div key={index} className='overflow-y-animate py-px' >
                <div className='word-gsap will-change-transform-animation'>
                    {word}
                </div>
            </div>
        })}
    </Text></span>
}

const GoToTop = ({ handler, text }: { handler: () => void, text: string }) => {
    const ref = useRef<HTMLButtonElement | null>(null);
    const ctx = useRef<gsap.Context | null>(null);
    useIsomorphicLayoutEffect(() => {
        ctx.current = gsap.context((self) => {
            const tlIcon = gsap.timeline({
                paused: true
            }).fromTo('.icon_gsap', {
                opacity: 1,
                yPercent: 0,
                xPercent: 0
            }, {
                opacity: 0,
                yPercent: -100,
                xPercent: 100,
                duration: 0.3,
            }).fromTo('.icon_gsap', {
                opacity: 0,
                yPercent: 100,
                xPercent: -100
            }, {
                opacity: 1,
                yPercent: 0,
                duration: 0.3,
                xPercent: 0,
            });
            const tlText = gsap.timeline({
                paused: true,
            }).fromTo('.text_gsap', {
                opacity: 1,
                yPercent: 0,
            }, {
                opacity: 0,
                yPercent: -100,
                duration: 0.3
            }).fromTo('.text_gsap', {
                opacity: 0,
                yPercent: 100,
            }, {
                opacity: 1,
                yPercent: 0,
                duration: 0.3
            })
            tlIcon.play();
            tlText.play();
            self.add('handlerGoToTop', () => {
                tlIcon.progress(0);
                tlText.progress(0);
                tlIcon.play();
                tlText.play();
            });
            self.add('handlerGoToTopLeave', () => {
                tlIcon.reverse();
                tlText.reverse();
            });
            return () => {
                tlIcon.kill();
                tlText.kill();
            }
        }, ref);
        
        return () => {
            ctx.current?.revert();
        }
    }, [ref]);


    const handlerMouse = useCallback(() => {
        ctx.current?.handlerGoToTop();
    }, [ctx]);
    const handlerMouseLeave = useCallback(() => {
        ctx.current?.handlerGoToTopLeave();
    }, [ctx]);


    useEventListener('mouseenter', handlerMouse, ref);
    useEventListener('mouseleave', handlerMouseLeave, ref);

    return <Button ref={ref} onPress={() => handler()} className={twMerge('flex flex-row justify-start items-center', 'gap-6 md:gap-8', 'uppercase')}>
        <Icon name='IconArrowUpRight' size='24' className={twMerge('stroke-gray-400 icon_gsap', ICON_SIZE_CLASS_NAME)} />
        <Text p size='sm' weight='semibold' degree='3' className='text_gsap' >
            {text}
        </Text>
    </Button>
}

const GoToTopMemo = memo(GoToTop);

const Footer = () => {
    const { t } = useTranslation();
    const { scrollbar } = useContext(ScrollProvider);

    const goToSection = useCallback(() => {
        scrollbar && scrollbar.scrollTo(0, { duration: 1000 });
    }, [scrollbar]);

    return (<>
        <div className={twMerge(
            'max-w-[14rem] xxs:w-8/12 xs:max-w-[46vw] sm:max-w-[40vw] md:max-w-[30vw] mdl:max-w-[26vw] xl:max-w-[20vw] 2xl:max-w-[28vw] 3xl:max-w-[22rem]'
        )} >
            <TextAnimated degree='3' weight='medium' size='md' className='uppercase max-w-xs justify-start gap-x-2' phrase={t('footer.state')} />
        </div>
        <div className={twMerge('flex flex-row flex-wrap sm:flex-nowrap justify-between', 'gap-y-4', 'pb-10 pt-6')}>
            <div className={twMerge('flex flex-row flex-1', 'order-2 sm:order-1')} >
                <GoToTopMemo handler={goToSection} text={t('footer.action')} />
            </div>
            <div className='flex flex-row flex-none grow-0 justify-start sm:justify-center items-center  order-1 sm:order-2'>
                <Text p degree='3' weight='semibold' size='sm' className='uppercase'>
                    {t('footer.name')}
                </Text>
                <Text p degree='3' weight='semibold' size='sm' className={twMerge('ml-2')} >
                    {t('footer.copy')}
                </Text>
            </div>
            <div className='order-3 flex-1'>
                <FollowUs />
            </div>
        </div>
    </>)
}

export default memo(Footer);