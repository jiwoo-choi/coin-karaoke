import React from "react";
import styled from 'styled-components'


interface Props {
    title: string;
    id: string;
    onClick: (id:string) => void;
}



const Cell = ({title, id, onClick}:Props) => {

    return(
        <tr>
            <td>
            {title}
            </td>
            <td>
                안녕하세요
            </td>
            <td>
                <button onClick={()=>{onClick(id)}}> 예약하기 </button>
            </td>
        </tr>
        // <CONTAINER>
        //     <TITLE>
        //     </TITLE>
        
        //     <BUTTON>
        //     </BUTTON>
        // </CONTAINER>
    )
}

export default Cell;