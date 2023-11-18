import React, { useRef } from "react";
import { useTranslation } from "next-i18next";
import { twMerge } from 'tailwind-merge';
import Text from '@/components/ui/typography/Text';
import Display from '@/components/ui/typography/Display';
import Link from '@/components/ui/typography/Link';
import { CursorContent } from '@/components/ui/cursor';
import { Icon } from '@/components/ui/icon'

import { gsap } from "@/utils/gsap";

import { useIsomorphicLayoutEffect } from 'react-use';
import { useLenis } from "@/lib/Lenis";

const Action = () => {
    const { t, i18n } = useTranslation();
    const refContainer = useRef<HTMLDivElement>(null);
    const lenis  = useLenis();

    useIsomorphicLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                paused: true,
                scrollTrigger: {
                    trigger: refContainer.current as any,
                    scrub: true,
                    start: 'top center',
                    end: 'top top',
                    toggleActions: 'play pause reverse reverse',
                    invalidateOnRefresh: true,
                }
            }).fromTo('.contact-title-gsap', {
                yPercent: -100,
            }, {
                yPercent: 0,
                duration: 1,
                stagger: 0.4,
                ease: 'Power3.easeOut',
            }).fromTo('.contact_quota_gsap', {
                opacity: 0,
                left: "-100%",
            }, {
                opacity: 1,
                left: "0%"
            }, '-=0.7').fromTo('.contact-arrow-gsap', {
                opacity: 0,
                xPercent: -50,
            }, {
                xPercent: 0,
                duration: 0.5,
                opacity: 1,
                ease: 'elastic.out(1, 0.6)',
            }, '-=0.2');

            return () => {
                tl.kill();
            }
        }, refContainer);
        return () => {
            ctx.revert();
        }
    }, [refContainer.current, lenis]);

    return <div ref={refContainer} className={twMerge(
        'h-[64vh] flex flex-col gap-1 xs:gap-2 sm:gap-6',
        'justify-center items-start xs:items-center place-content-start')}
    >
        <span className='overflow-hidden'>
            <Display size='lg' className={twMerge('uppercase text-start xs:text-center', 'contact-title-gsap will-change-transform-animation')} >
                {t('contactCall.title')}
            </Display>
        </span>
        <div className='flex flex-row justify-start xs:justify-center items-start relative'>
            <div className={twMerge(
                'absolute hidden xxs:block',
                'left-[103%] xs:right-[103%] rotate-180	xs:rotate-0',
                'right-auto xs:left-auto xs:top-1 will-change-transform-animation contact-arrow-gsap',
            )}>
                <Icon name='IconArrowBigRightFilled' className='w-[2.8rem] xs:w-12 md:w-14 lg:w-16 xl:w-20 [&>*]:fill-primary-400' style={{}} />
            </div>
            <CursorContent name='CursorActionIconContactAction' component='CursorActionIcon' props={{
                degree: -45,
                iconName: 'IconArrowUpRight',
            }} className='overflow-hidden' >
                <Link href='/contact'>
                    <Display size='lg' weight='bold' className={twMerge('whitespace-nowrap-important uppercase text-primary-400', 'contact-title-gsap will-change-transform-animation')} >
                        {t('contactCall.action')}
                    </Display>
                </Link>
            </CursorContent>
            <Text p degree='3' size={i18n.language == 'en' ? 'xxs' : 'xs'} weight='medium' className={twMerge(
                'absolute left-[-1.5%] xs:left-auto sm:left-[103%]',
                'top-[100%] sm:top-[-6px]',
                'xs:right-[-1%] md:right-auto', // right
                'mt-3 xl:mt-4', // margin top
                'ml-2',
                i18n.language == 'en' ? 'w-32 xl:w-40 4xl:w-52' : 'w-36 xl:w-46 4xl:w-52', // width
                'text-start xs:text-end sm:text-start'
            )} >
                <span className='contact_quota_gsap will-change-transform-animation'>
                    {t('contactCall.description')}
                </span>
            </Text>
        </div>
    </div>
}

export default Action;