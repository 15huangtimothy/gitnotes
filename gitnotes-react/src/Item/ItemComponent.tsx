import React from 'react';
import './Item.css';

export type ItemProps = {
    name: string;
    path: string;
    sha: string;
    url: string;
    depth: number;
    handleFileSelect: Function;
};

export default class ItemComponent<P extends ItemProps, S> extends React.Component<
    P,
    S
> {}
