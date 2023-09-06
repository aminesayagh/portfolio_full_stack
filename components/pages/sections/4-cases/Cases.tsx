import { useMemo, useRef, useContext } from 'react';
import { twMerge } from 'tailwind-merge';
import { useIsomorphicLayoutEffect } from 'react-use';
import { useTranslation } from 'next-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import { Title, Text, Image } from '@/components/ui';
import { getProjectsByCategory } from '@/conf/projects';
import { ScrollProvider } from '@/context/ScrollContext';

const Case = ({ picture }: { picture?: string[] }) => {
    let ref = useRef(null);
    useIsomorphicLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(ref.current as any, {
                backgroundSize: '100%',
                backgroundPosition: 'center 10%',
            }, {
                backgroundSize: '110%',
                backgroundPosition: 'center 80%',
                ease: 'power1',
                scrollTrigger: {
                    trigger: ref.current as any,
                    scrub: 1,
                    start: 'top center',
                    markers: false,
                }
            })
        }, ref);
        return () => ctx.revert();
    }, [ref.current]);

    return <div
        className={twMerge(
            'flex flex-col items-center justify-center',
            'bg-no-repeat bg-cover',
            'h-screen w-full',
            'image_gsap',
        )}
        ref={ref}
        style={{
            backgroundImage: `url(${!!picture ? picture[0] : ''})`,
            backgroundSize: '100%',
        }}
    >
        
    </div>
} 
const zIndexImages = [
    'z-[20]',
    'z-[30]',
    'z-[40]',
]
const Cases = () => {
    const { t } = useTranslation();
    const projects = useMemo(() => getProjectsByCategory('best'), []);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollbar } = useContext(ScrollProvider);

    useIsomorphicLayoutEffect(() => {
        let ctx = gsap.context((self) => {
            gsap.set('.image_gsap_container', {
                zIndex: (i, target, targets) => targets.length - i,
            })

            let images = gsap.utils.toArray('.image_gsap_container');
            images.forEach((image, i) => {
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current as any,
                        scroller: '#scroller',
                        start: () => 'top -' + (window.innerHeight * (i + 0.5)),
                        end: () => '+=' + window.innerHeight,
                        scrub: true,
                        toggleActions: 'play none reverse none',
                        invalidateOnRefresh: true,
                    }
                });
                tl.to(image as any, { height: 0 })
            })
        });
        return () => ctx.revert();
    }, [containerRef.current]);
    return (
        <>
            <div className={twMerge('flex flex-col gap-14 sm:gap-12 w-full')}>
                <div className={twMerge('flex flex-col sm:flex-row justify-between items-start sm:items-end', 'gap-2 sm:gap-12', 'w-full')}>
                    <Title h2 weight='bold' degree='2' className={'sm:w-min'}>
                        {t('cases.title')}
                    </Title>
                    <div className='w-full xs:w-9/12 sm:w-7/12 md:w-6/12 lg:w-5/12 xl:w-4/12'>
                        <Text p size='md' degree='3' weight='semibold' className='w-auto max-w-[38rem] sm:max-w-[36rem] my-2 md:my-4' >
                            {t('cases.description')}
                        </Text>
                    </div>
                </div>
                <div className={twMerge('w-full')} ref={containerRef} >
                    {projects.map((project, index) => {
                        return <div key={index} className={twMerge(
                            'w-full',
                            `image_gsap_container`
                        )} >
                            <Case picture={project?.picture} />
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}

export default Cases;