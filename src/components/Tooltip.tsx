import React, {ReactNode} from 'react'
import "src/app/global.css";

interface TooltipProps {
    message: string;
    children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({message, children}) => {
    return (
        <div className="tooltip">
            {children}
            <span className="tooltip-text">{message}</span>
        </div>
    )
}

export default Tooltip
