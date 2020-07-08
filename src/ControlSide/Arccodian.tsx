import styled from 'styled-components'
import {Accordion} from 'semantic-ui-react'
import React, {ReactNode , useState } from 'react'

const COLLAPSAIBLE = styled.button`
    background-color: white;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    border-bottom: 1px solid #ccc;
    margin:0px;
`  

const CONTENT = styled.div`
    padding: 0 18px;
    display: none;
    overflow: hidden;
    background-color: #f1f1f1;
    border-bottom: 1px solid #ccc;
    padding-top:10px;
    padding-bottom:10px;
    margin:0px;
`

interface Props {
    title : String,
    children: ReactNode
}
const COLLAPSE = ({title, children}: Props) => {

    const [ active, setActive ] = useState(false)
    let ref: HTMLElement | null;
    let collapseref : HTMLElement | null; 
    //useState - // 
    // a b c - //
    // if it is active
    //if it is active?
    //style.display

    function onExpand() {    

        if (ref && collapseref) {
            if (active) {
                
                // 현재 true라면 접어준다.
                ref.style.display = 'none';
                collapseref.style.background = 'white';
                collapseref.style.borderBottom = '1px solid #ccc';
            } else {
                // 현재 false라면 열어준다.
                ref.style.display = 'block';
                collapseref.style.background = '#f1f1f1';
                collapseref.style.borderBottom = '0px';
            } 
        }
        setActive(!active);
    }

    return(
        <>
            <COLLAPSAIBLE ref={(c)=> collapseref = c} onClick={onExpand}>
                {title}
            </COLLAPSAIBLE>
            <CONTENT ref={(c) => ref = c}>
                {children}
            </CONTENT>
        </>
    )
}

export default COLLAPSE