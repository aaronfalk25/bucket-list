import React, {useState} from 'react';
import { Group as GroupType } from '@/interfaces/schema';
import "src/app/global.css";
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, ArrowRightIcon, TrashIcon } from './icons';

interface GroupProps extends GroupType {
    setUserSelectedGroup: (group: string) => void;
    deleteGroup?: (group: string) => void;
}

const Group: React.FC<GroupProps> = (props: GroupProps) => {
    const { setUserSelectedGroup, deleteGroup, id, backgroundColor, textColor, name, description, entryCode } = props;
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
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

    return (
        <div style={{ backgroundColor, color: textColor }} className="group-frame">
            <div className="group-text">
                <h3>{name}</h3>
                <p>{description}</p>
            </div>
            <div className='group-buttons'>
                <button onClick={goToGroup}>Go to group page</button>
                {showEntryCode ? (
                    <div className="entry-code">
                        <button onClick={() => setShowEntryCode(false)}>Hide Entry Code</button>
                        <p>{entryCode}</p>
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
            </div>
        </div>
    );
};

export default Group;