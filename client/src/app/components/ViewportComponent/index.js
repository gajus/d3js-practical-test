import React from 'react';
import './styles.scss';

export default class extends React.Component {
    render () {
        return <div className='viewport'>{this.props.children}</div>;
    }
};
