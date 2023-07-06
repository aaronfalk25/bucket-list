import React from 'react'
import { Group as GroupType } from '@/interfaces/schema';
import "src/app/global.css"
import { deleteFromCloudFireStore } from '@/api/firebase/firebase';

interface GroupProps extends GroupType {
    setUserSelectedGroup: (group: string) => void;
    deleteGroup?: (group: string) => void;
}



export default class Group extends React.Component<GroupProps> {
    constructor(props: GroupProps) {
        super(props);
    }

    render() {
        return (
            <div style={{backgroundColor: this.props.color}} className="group-frame">
                <h3>{this.props.name}</h3>
                <p>{this.props.description}</p>
                <button onClick={() => this.props.setUserSelectedGroup(this.props.id)}>Select Group</button>
                {this.props.deleteGroup && <button onClick={() => this.props.deleteGroup?.(this.props.id)}>Delete Group</button>}
            </div>
        )
    }

}