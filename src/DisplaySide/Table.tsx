import React, {ReactNode} from "react";
import styled from 'styled-components'



const TABLE = styled.table`
    margin: auto;
    flex-basis:90%;
    min-width: 90%;
    max-width: 90%;

`
const BUTTONTH = styled.th`
    width: 120px;
`

const SINGERTH = styled.th`
    width: 120px;
`
interface Props {
    children : ReactNode
}
const Table = ({children}:Props) => {
    return (
        <TABLE>
            <tr>
                <th>노래제목</th>
                <SINGERTH>가수</SINGERTH>
                <BUTTONTH>예약하기</BUTTONTH>
            </tr>
            {children}
        </TABLE>
    )
}

export default Table