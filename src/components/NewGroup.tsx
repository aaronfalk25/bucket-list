import React, { useState } from "react";
import "src/app/global.css";
import { PlusIcon } from "./icons";
import { Group } from "@/interfaces/schema";
import { writeToCloudFireStore } from "@/api/firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { who } from "src/utilities/queries";

// Inherets this function to reload after submission
interface NewGroupProps {
  refreshOnGroupCreate: () => Promise<void>;
}

function generateRandomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
  
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
  
    return code;
  }

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return randomColor;
  };

  const getTextColorBasedOnBackground = (backgroundColor: string): string => {
    const hexColor = backgroundColor.slice(1); // Remove the "#" from the color
  
    // Convert hexadecimal color to RGB values
    const red = parseInt(hexColor.substring(0, 2), 16);
    const green = parseInt(hexColor.substring(2, 4), 16);
    const blue = parseInt(hexColor.substring(4, 6), 16);
  
    // Calculate relative luminance
    const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  
    // Determine text color based on luminance
    return luminance > 0.5 ? 'black' : 'white';
  };

const NewGroup: React.FC<NewGroupProps> = ({refreshOnGroupCreate}) => {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const createdBy = (await who()).uid;
    const bgColor = generateRandomColor();


    const newGroup: Group = {
      id: uuidv4(),
      name: formValues.name,
      description: formValues.description??"",
      members: [createdBy],
      createdBy: createdBy,
      entryCode: generateRandomCode(),
      backgroundColor: bgColor,
      textColor: getTextColorBasedOnBackground(bgColor)
    };

    await writeToCloudFireStore("groups", newGroup, newGroup.id);
    setShowModal(false);
    clearForm();

    // Post submission refresh the view
    await refreshOnGroupCreate();
  };

  const handleClose = () => {
    setShowModal(false);
    clearForm();
  };

  const clearForm = () => {
    setFormValues({
      id: "",
      name: "",
      description: "",
      members: [],
      createdBy: "",
      entryCode: "",
      backgroundColor: "",
      textColor: ""
    });
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
  
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };


  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState<Group>({
    id: "",
    name: "",
    description: "",
    members: [],
    createdBy: "",
    entryCode: "",
    backgroundColor: "",
    textColor: ""
  });


  return (
    <div>
        <button onClick={() => setShowModal(true)} 
        className="plus-icon">
            <div className="button-subtext">Add a new group</div> 
            <div className="button-subtext fix-icon-pos"><PlusIcon/> </div>
        </button>

      {showModal ? (
        <div>
        <div className="pop-up">
          <h2>Add a New Group</h2>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="new-bucket-item-form">
              <label htmlFor="name">Group Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                required
              /><br />

              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
              /><br />            
            <div className="form-action-buttons">
              <button type="submit" className="button">Submit</button>
              <button onClick={handleClose} className="button-alt">Cancel</button>
            </div>
          </form>

          </div>

        </div>
          <button className='backdrop' onClick={handleClose}></button>
          </div>
      ) : null}
    </div>
  );
  
};

export default NewGroup;
