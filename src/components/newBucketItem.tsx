import React, { useState } from "react";
import "src/app/global.css";
import { PlusIcon } from "./icons";
import { BucketItem, User } from "@/interfaces/schema";
import { writeToCloudFireStore } from "@/api/firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { who } from "src/utilities/queries";

// Inherets this function to reload after submission
interface NewBucketItemProps {
  fetchBucketItemsAfterSubmission: () => Promise<void>;
}

const NewBucketItem: React.FC<NewBucketItemProps> = ({fetchBucketItemsAfterSubmission}) => {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user: User = await who();

    const newItem: BucketItem = {
      id: uuidv4(),
      name: formValues.name,
      description: formValues.description,
      date: formValues.date,
      time: formValues.time,
      cost: formValues.cost,
      numParticipants: formValues.numParticipants,
      participants: [],
      location: formValues.location,
      likes: 0,
      likedBy: [],
      createdBy: user.uid,
      groupId: user.userSelectedGroup
    };

    await writeToCloudFireStore("bucketItems", newItem, newItem.id);

    setShowModal(false);

    await fetchBucketItemsAfterSubmission();
    clearForm();
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
      date: "",
      time: "",
      cost: "",
      numParticipants: 0,
      participants: [],
      location: "",
      likes: 0,
      likedBy: [],
      createdBy: "",
      groupId: ""
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
  const [formValues, setFormValues] = useState<BucketItem>({
    id: "",
    name: "",
    description: "",
    date: "",
    time: "",
    cost: "",
    numParticipants: 0,
    participants: [],
    location: "",
    likes: 0,
    likedBy: [],
    createdBy: "",
    groupId: ""
  });


  return (
    <div>
      <div className="bucket_item_container">
          <div className="bucket_item_container_inner_box">
            Add a New Item
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
          <h1>Add a New Event</h1>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="new-bucket-item-form">
              <label htmlFor="name">Name of Activity:</label>
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
                required
              /><br />

              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formValues.date}
                onChange={handleInputChange}
              /><br />

              <label htmlFor="time">Time:</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formValues.time}
                onChange={handleInputChange}
              /><br />

              <label htmlFor="cost">Cost:</label>
              <input
                type="text"
                id="cost"
                name="cost"
                value={formValues.cost}
                onChange={handleInputChange}
              /><br />

              <label htmlFor="numParticipants">Number of Participants:</label>
              <input
                type="number"
                id="numParticipants"
                name="numParticipants"
                value={formValues.numParticipants}
                onChange={handleInputChange}
              /><br />

              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formValues.location}
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

export default NewBucketItem;
