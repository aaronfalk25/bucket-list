import React, { ChangeEvent, KeyboardEvent } from "react";
import { BucketItem } from "src/interfaces/schema";
import "src/app/global.css";
import {
  writeToCloudFireStore,
  updateIdInCloudFireStore,
  deleteFromCloudFireStore,
  readFromCloudFireStore,
} from "@/api/firebase/firebase";

interface Props extends BucketItem {
  updateBucketItem: (updatedItem: BucketItem) => Promise<void>;
}

interface State {
  isEditing: boolean;
  editedName: string;
  editedDescription: string;
}

export class BucketItemComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: false,
      editedName: props.name,
      editedDescription: props.description,
    };
  }

  writeBucketItem = async () => {
    const { editedName, editedDescription } = this.state;
    const input = {
      name: editedName,
      description: editedDescription,
      date: this.props.date,
      likes: this.props.likes,
      likedBy: this.props.likedBy,
    };
    await writeToCloudFireStore("bucketItems", input, this.props.id);
  };

  editBucketItem = async () => {
    const { editedName, editedDescription } = this.state;
    await updateIdInCloudFireStore(
      "bucketItems",
      {
        name: editedName,
        description: editedDescription,
        likes: 0,
      },
      this.props.id
    );
    this.props.updateBucketItem({
      ...this.props,
      name: editedName,
      description: editedDescription,
    });
  };

  deleteBucketItem = async () => {
    await deleteFromCloudFireStore("bucketItems", this.props.id);
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
    const { name, description } = this.props;
    this.setState({
      isEditing: false,
      editedName: name,
      editedDescription: description,
    });
  };

  handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ editedName: e.target.value });
  };

  handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ editedDescription: e.target.value });
  };

  handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleSave();
    }
  };

  render() {
    const { isEditing, editedName, editedDescription } = this.state;

    return (
      <div>
        {isEditing ? (
          <div>
            <button onClick={this.handleSave}>Save</button>
            <button onClick={this.handleCancel}>Cancel</button>
            <input
              type="text"
              value={editedName}
              onChange={this.handleNameChange}
              onKeyPress={this.handleKeyPress}
            />
            <textarea
              value={editedDescription}
              onChange={this.handleDescriptionChange}
            />
          </div>
        ) : (
          <div>
            <button onClick={this.handleEdit}>Edit</button>
            <button onClick={this.deleteBucketItem}>Delete</button>
            <h3>{editedName}</h3>
            <p>{editedDescription}</p>
          </div>
        )}
      </div>
    );
  }
}
