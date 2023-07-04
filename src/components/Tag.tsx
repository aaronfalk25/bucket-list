import React, {ReactNode}  from "react";
import "src/app/global.css";

interface TagProps {
    children: ReactNode;
}

const Tag: React.FC<TagProps> = ({children}) => {
    return (
        <div className="tag">
            {children}
        </div>
    )
}

export default Tag;