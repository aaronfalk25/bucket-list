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

const NewGroup: React.FC<NewGroupProps> = ({refreshOnGroupCreate}) => {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const createdBy = (await who()).uid;

    const newGroup: Group = {
      id: uuidv4(),
      name: formValues.name,
      description: formValues.description??"",
      members: [createdBy],
      createdBy: createdBy 
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
      createdBy: ""
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
    createdBy: ""
  });


  return (
    <div>
      <div className="bucket_item_container">
          <div className="bucket_item_container_inner_box">
            Create a New Group
          </div>
        <div className="bucket_item_container_inner_box hover-sheen">
        <button onClick={() => setShowModal(true)} 
        className="hide-button-border plus-icon">
            <PlusIcon/>
        </button>
        </div>
      </div>

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
