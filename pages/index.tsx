import { Head } from '@/components/common';
import { Noise } from '@/components/ui';
import '@/utils/i18n';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import '@/components/InitGsap';

import AnimationConf from '@/context/AnimationConf';
import ScrollContextProvider from '@/context/ScrollContext';
import { LandingPage } from '@/components/pages';
import { Header, Footer } from '@/components/common';

export default function Home() {

  return (
    <>
      <Head title={"Mohamed Amine SAYAGH - Full Stack Web Developer"}
        description={"Mohamed Amine SAYAGH - Full Stack Web Developer"}
        keywords="Mohamed Amine SAYAGH - Full Stack Web Developer"
        author="Mohamed Amine SAYAGH"
        logo='/favicon.svg'
      />
      <ScrollContextProvider >
        <AnimationConf >
          <Header />
          <div data-scroll-container>
            <LandingPage />
          </div>
          <Noise />
        </AnimationConf>
      </ScrollContextProvider>
    </>
  )
}
import nextI18NextConfig from '../next-i18next.config.js'

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], nextI18NextConfig)),
    },
  };
}