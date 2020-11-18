import React, { useState } from 'react';
import './ScrollContainer.css';

function ScrollContainer(props) {
    const [scroll, setScroll] = useState({x: 0, y: 0});
    const [mouseDown, setMouseDown] = useState(false);
    let className = props.className ? props.className : '';
    className = props.scrollbar ? className : className ? `${className} hidden-scrollbar` : 'hidden-scrollbar';

    return (
        <div style={{overflowY: props.overflowY, overflowX: props.overflowX}} 
        id={props.id} 
        className={className}
        onMouseDown={onMouseDown(setScroll, setMouseDown)}
        onMouseMove={onMouseMove(scroll, setScroll, mouseDown)}
        onMouseUp={onMouseUp(setMouseDown)}
        onMouseLeave={() => setMouseDown(false)}
        >
            {props.children}
        </div>
    );
}

const onMouseDown = (setScroll, setMouseDown) => (e) => {
    const target = e.currentTarget;
    const targetRect = target.getBoundingClientRect();
    const x = getX(e, targetRect);
    const y = getY(e, targetRect);
    setScroll({x, y});
    setMouseDown(true);
}

const onMouseMove = (scroll, setScroll, isMouseDown) => (e) => {
    if (!isMouseDown) {
        return;
    }
    const target = e.currentTarget;
    const targetRect = target.getBoundingClientRect();
    const x = getX(e, targetRect);
    const y = getY(e, targetRect);
    const newPosition = {x, y};
    target.scrollLeft += scroll.x - newPosition.x;
    target.scrollTop += scroll.y - newPosition.y;
    setScroll(newPosition);
}

const onMouseUp = (setMouseDown) => (e) => {
    //const target = e.currentTarget;
    //console.log('released');
    setMouseDown(false)
}

function getX(e, rect) {
    return e.clientX - rect.left;
}

function getY(e, rect) {
    return e.clientY - rect.top;
}

export default ScrollContainer;