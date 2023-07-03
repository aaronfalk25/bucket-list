import { getUserById } from "@/utilities/queries";
import React, {useEffect, useState } from "react";
import "src/app/global.css"
import { ViewParticipantsIcon } from "./icons";

interface Props {
    participants: string[];
}

const ParticipantsWindow: React.FC<Props> = ({ participants }) => {
    
    const [participantsNames, setParticipantsNames] = useState<string[]>(["Loading..."]);
    const [showWindow, setShowWindow] = useState<boolean>(false);

    useEffect(() => {
        const fetchParticipantsNames = async () => {
            if (participants.length === 0) {
                setParticipantsNames(["No participants yet"]);
              } 
              else {
                let participantNames: string[] = [];
                for (let i = 0; i < participants.length; i++) {
                  const user = await (getUserById(participants[i]));
                  participantNames.push(user.displayName ?? "Anonymous");
                }
                setParticipantsNames(participantNames);
              }
        };

        fetchParticipantsNames();
    }, [participants]);



    return (
        <div className='participants-container'>
            <button className='hide-button-border' onClick={() => setShowWindow(!showWindow)}>
                <ViewParticipantsIcon/>
            </button>
            {showWindow && (
                <div className="participants-window">
                    <h3>Participants</h3>
                    <ul>
                        {participantsNames.map((participantName) => (
                            <div key={participantName}>{participantName}</div>
                        ))}
                    </ul>
                </div>)}
        </div>
      );
}

export default ParticipantsWindow;