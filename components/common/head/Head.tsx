
import HeadNext from 'next/head';
import { NextSeo } from 'next-seo';

const Head = ({ title, description, keywords, author, logo }: { title: string, description: string, keywords: string, author: string, logo: string }) => {
    return <>
        <NextSeo title={title} description={description}  />
        <HeadNext>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <meta name='author' content={author} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

=            <link rel="icon" href={logo} />
        </HeadNext>
    </>
}

export default Head;