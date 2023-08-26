import React, {useState} from 'react';
import { Group as GroupType } from '@/interfaces/schema';
import "src/app/global.css";
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, ArrowRightIcon, TrashIcon } from './icons';

interface GroupProps extends GroupType {
    setUserSelectedGroup: (group: string) => void;
    deleteGroup?: (group: string) => void;
    leaveGroup?: (group: string) => void;
}

const Group: React.FC<GroupProps> = (props: GroupProps) => {
    const { setUserSelectedGroup, deleteGroup, leaveGroup, id, backgroundColor, textColor, name, description, entryCode } = props;
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [showEntryCode, setShowEntryCode] = useState(false);

    const goToGroup = () => {
        setUserSelectedGroup(id);
        router.push('/events');
    };

    const handleDeleteGroup = () => {
        if (deleteGroup) {
            if (isDeleting) {
                deleteGroup(id);
            } else {
                setIsDeleting(true);
            }
        }
    };

    const handleLeaveGroup = () => {
        console.log("here")
        if (leaveGroup) {
            if (isLeaving) {
                console.log("Leaving group with id", id)
                leaveGroup(id);
            }
            else {
                setIsLeaving(true);
            }
        }
    };

    return (
        <div style={{ backgroundColor, color: textColor }} className="group-frame">
            <div className="group-text">
                <h3>{name}</h3>
                <p>{description}</p>
            </div>
            <div className='group-buttons'>
                <button onClick={goToGroup}>Go to group page</button>
                {showEntryCode ? (
                    <div>
                        <button onClick={() => setShowEntryCode(false)}>Hide Entry Code</button>
                        <div className="entry-code">{entryCode}</div>
                    </div>
                ) : (
                    <button onClick={() => setShowEntryCode(true)}>Show Entry Code</button>
                )}
                {deleteGroup && (
                    <>
                        {isDeleting ? (
                            <div className="delete-box">
                                <button onClick={handleDeleteGroup}>Confirm Delete <TrashIcon/></button>
                                <button onClick={() => setIsDeleting(false)}>Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsDeleting(true)}>Delete Group</button>
                        )}
                    </>
                )}
                {leaveGroup && (
                    <>
                        {isLeaving ? (
                            <div className="leave-box">
                                <button onClick={handleLeaveGroup}>Confirm Leave</button>
                                <button onClick={() => setIsLeaving(false)}>Cancel</button>
                            </div>
                        ) : (    
                            <button onClick={() => setIsLeaving(true)}>Leave Group</button>
                        )
                        }
                    </>
                )}
            </div>
        </div>
    );
};

export default Group;