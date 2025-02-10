import React from 'react';
import bg from '../../../public/bg.jpeg'
import './Background.css'

const Background: React.FC = () => {
    return (
        <div className={'background'}>
            <img src={bg} alt={'bg'}/>
        </div>
    );
}

export default Background;