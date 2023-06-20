import React, { ChangeEvent, KeyboardEvent } from "react";
import { BucketItem } from "src/interfaces/schema";
import { v4 as uuidv4 } from "uuid";
import "src/app/global.css";
import {
  writeToCloudFireStore,
  updateIdInCloudFireStore,
  deleteFromCloudFireStore,
  readFromCloudFireStore,
} from "@/api/firebase/firebase";

interface Props extends BucketItem {
    updateBucketItem: (updatedItem: BucketItem) => Promise<void>;
    deleteBucketItem?: (id: string) => void;
    insertNewBucketItem?: (newItem: BucketItem) => Promise<void>;
  }

interface State {
    isEditing: boolean;
    editedName: string;
    editedDescription: string;
    editedDate: string;
    editedTime: string;
    editedCost: string;
}

export class BucketItemComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: false,
      editedName: props.name,
      editedDescription: props.description,
      editedDate: props.date? props.date : "",
      editedTime: props.time? props.time : "",
      editedCost: props.cost? props.cost : "",
    };
    this.resetNewBucketItem = this.resetNewBucketItem.bind(this);
  }

  editBucketItem = async () => {
    const { editedName, editedDescription, editedDate, editedTime, editedCost } = this.state;
    await updateIdInCloudFireStore(
      "bucketItems",
      {
        name: editedName,
        description: editedDescription,
        date: this.props.date? this.props.date : "",
        time: this.props.time? this.props.time : "",
        cost: this.props.cost? this.props.cost : "",
        likes: 0,
      },
      this.props.id
    );

    if (this.props.id !== 'new') { 
        await this.props.updateBucketItem({
            id: this.props.id,
            name: editedName,
            description: editedDescription,
            date: editedDate,
            time: editedTime,
            cost: editedCost,
            likes: 0,
            likedBy: []
        });
    }
  };

  deleteBucketItem = async () => {
    if (this.props.deleteBucketItem) await this.props.deleteBucketItem(this.props.id);
  };

  insertNewBucketItem = async () => {
    const today: Date = new Date();
    const formattedToday = today.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    });
    if (this.props.insertNewBucketItem) await this.props.insertNewBucketItem({
        id: uuidv4(),
        name: this.state.editedName,
        description: this.state.editedDescription,
        date: formattedToday,
        likes: 0,
        likedBy: []
    });

    this.resetNewBucketItem();
};

resetNewBucketItem = () => {
    this.setState({
        editedName: "New Bucket Item",
        editedDescription: "This is a new bucket item",
        editedDate: "",
        editedTime: "",
        editedCost: ""
    });
  };
  handleEdit = async () => {
    this.setState({ isEditing: true });

    // Retrieve the current values from the database
    const res = await readFromCloudFireStore("bucketItems");

    for (let i = 0; i < res.documents.length; i++) {
      const document: BucketItem = res.documents[i] as unknown as BucketItem;
      if (document.id === this.props.id) {
        this.setState({
            editedName: this.props.name,
            editedDescription: this.props.description,
            editedDate: this.props.date? this.props.date : "",
            editedTime: this.props.time? this.props.time : "",
            editedCost: this.props.cost? this.props.cost : "",
        });
        break;
      }
    }
  };

  handleSave = () => {
    const { editedName, editedDescription } = this.state;
    // Perform any validation or checks here before saving
    // For simplicity, assuming the edited values are valid
    this.setState({ isEditing: false });
    this.editBucketItem(); // Call the update function
  };

  handleCancel = () => {
    const { name, description, date, time, cost } = this.props;
    this.setState({
        isEditing: false,
        editedName: name,
        editedDescription: description,
        editedDate: date? date : "",
        editedTime: time? time : "",
        editedCost: cost? cost : "",
    });
  };

  handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ editedName: e.target.value });
  };

  handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ editedDescription: e.target.value });
  };

  handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ editedDate: e.target.value });
  };

  handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ editedTime: e.target.value });
  };

  handleCostChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ editedCost: e.target.value });
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSave();
    }
  };

  handleKeyPressTextArea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSave();
    }
  };

  render() {
    const { isEditing, editedName, editedDescription, editedDate, editedTime, editedCost } = this.state;

    return (
        <div>
          {isEditing ? (
            <div>
              <button onClick={this.handleSave}>Save</button>
              <button onClick={this.handleCancel}>Cancel</button>
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={editedName}
                  onChange={this.handleNameChange}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              <div>
                <textarea
                  value={editedDescription}
                  placeholder="Description"
                  onChange={this.handleDescriptionChange}
                  onKeyPress={this.handleKeyPressTextArea}
                />
              </div>
              <div className="bucket_item_container_inner_box">
              <div> Date: &nbsp;
                <input
                  type="text"
                  placeholder="Date"
                  value={editedDate}
                  onChange={this.handleDateChange}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              <div> Time: &nbsp;
                <input
                  type="text"
                  placeholder="Time"
                  value={editedTime}
                  onChange={this.handleTimeChange}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              <div> Cost: &nbsp;
                <input
                  type="text"
                  placeholder="Cost $$$"
                  value={editedCost}
                  onChange={this.handleCostChange}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              </div>
            </div>
          ) : (
            <div>
              <button onClick={this.handleEdit}>Edit</button>
              {this.props.id === 'new' ? <button onClick={this.insertNewBucketItem}>Add</button> : <button onClick={this.deleteBucketItem}>Delete</button>}
              <h3>{editedName}</h3>
              <p>{editedDescription}</p>
              <div className="bucket_item_container_inner_box">
                <div>{editedDate}</div>
                <div>{editedTime}</div>
                <div>{editedCost}</div>
              </div>
            </div>
          )}
        </div>
      );
  }
}
