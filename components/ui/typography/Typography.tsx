import React, { FC } from 'react';
import { useRef, useLayoutEffect } from 'react';
import LinkNext from 'next/link';
import { twMerge } from 'tailwind-merge';
import { textColorDegree, displayStyle, textStyle, titleStyle } from './Typography.style'
import { DisplayPropsExtended } from './Typography.type';
import Style from './Typography.module.scss';
import { useHover } from 'react-aria';

import { ReactFitty } from 'react-fitty';
// DISPLAY
export type { DisplayPropsExtended } from './Typography.type';
export const Display: FC<DisplayPropsExtended> = ({ fitty, size, weight, exchange, children, className, ...props }) => {
    const element = fitty ? ReactFitty : 'h1'
    return React.createElement(element, {
        className: twMerge(
            displayStyle({
                weight
            }),
            textColorDegree[exchange ? 'exchanged' : 'normal']['1'],
            Style[`display_${size}`],
            Style['display'],
            className,
        ),
        ...props
    }, children)
}

// TITLE
import type { TitleElement, TitleNames, TitlePropsExtended, } from './Typography.type';
import { validTitleElements } from './Typography.type'
export const Title: FC<TitlePropsExtended> = ({ weight, degree = '1', exchange, className, children, ...props }) => {
    const ElementType = (Object.keys(props) as Array<TitleNames>).find(prop => validTitleElements.includes(prop)) || 'h2';
    // @ts-expect-error
    validTitleElements.forEach(prop => delete props[prop]);
    const classes = twMerge(
        titleStyle({
            weight
        }),
        className,
        Style[`title_${ElementType}`],
        Style['title'],
        textColorDegree[exchange ? 'exchanged' : 'normal'][degree]
    )
    return React.createElement(ElementType, {
        className: classes,
        ...props
    }, children);
}

// TEXT
import { TextNames, TextPropsExtended, validTextElements } from './Typography.type';
export type TextPropsType = Pick<TextPropsExtended, 'exchange' | 'size' | 'weight' | 'degree'>;

export const textClassNames = ({ weight, size, degree, exchange }: TextPropsType) => {
    return twMerge(
        textStyle({
            weight
        }),
        Style[`text_${size}`],
        Style['text'],
        textColorDegree[!!exchange ? "exchanged" : "normal"][degree]
    )
}
export const Text: FC<TextPropsExtended> = ({ weight, degree = '3', size, exchange, className, children, ...props }) => {
    const ElementType = (Object.keys(props) as Array<TextNames>).find(prop => validTextElements.includes(prop)) || 'p';
    // @ts-expect-error
    validTextElements.forEach(prop => delete props[prop]);
    return React.createElement(ElementType, {
        className: twMerge(
            textClassNames({ weight, size, degree, exchange }), className
        ),
        ...props
    }, children);
}


// LINK
import { LinkPropsExtended } from './Typography.type';
const buttonHover = {
    hoverColor: 'hover:text-primary-500 duration-200 ease-in-out',
}



export const Link: FC<LinkPropsExtended> = ({ weight, degree = '3', size, exchange, className, animation, children, href, ...props }) => {

    return <LinkNext href={href} className={twMerge(
        textClassNames({ weight, size, degree, exchange }), 'remove_outline', className
    )} {...props}>{children}</LinkNext>
}