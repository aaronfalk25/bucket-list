import React, { ChangeEvent, KeyboardEvent } from "react";
import { BucketItem } from "src/interfaces/schema";
import { v4 as uuidv4 } from "uuid";
import {PencilIcon, TrashIcon, PlusIcon, HeartIcon, UndoIcon, SaveIcon } from "@/components/icons";
import { who } from "src/utilities/queries";

import "src/app/global.css";
import {
  updateIdInCloudFireStore,
  deleteFromCloudFireStore,
  readFromCloudFireStore,
} from "@/api/firebase/firebase";

interface Props extends BucketItem {
    updateBucketItem: (updatedItem: BucketItem) => Promise<void>;
    deleteBucketItem?: (id: string) => void;
    likeBucketItem?: (bucketId: string, userId: string) => Promise<void>;
  }

interface State {
    isEditing: boolean;
    editedName: string;
    editedDescription: string;
    editedDate: string;
    editedTime: string;
    editedCost: string;
    editedNumParticipants: number;
    userId: string | null;
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
      editedNumParticipants: props.numParticipants? props.numParticipants : 0,
      userId: null
    };
    this.resetNewBucketItem = this.resetNewBucketItem.bind(this);
  }

  componentDidMount() {
    this.fetchUserId();
  }

  fetchUserId = async () => {
    const user = await who();
    this.setState({ userId: user.uid });
  };

  editBucketItem = async () => {
    const { editedName, editedDescription, editedDate, editedTime, editedCost, editedNumParticipants } = this.state;
    await updateIdInCloudFireStore(
      "bucketItems",
      {
        name: editedName,
        description: editedDescription,
        date: this.props.date? this.props.date : "",
        time: this.props.time? this.props.time : "",
        cost: this.props.cost? this.props.cost : "",
        numParticipants: this.props.numParticipants? this.props.numParticipants : 0,
        participants: [],
        likes: 0,
        likedBy: [],
        createdBy: this.props.createdBy? this.props.createdBy : ""
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
            numParticipants: editedNumParticipants,
            participants: [],
            cost: editedCost,
            likes: 0,
            likedBy: [],
            createdBy: this.props.createdBy? this.props.createdBy : ""
        });
    }
  };

  deleteBucketItem = async () => {
    if (this.props.deleteBucketItem) await this.props.deleteBucketItem(this.props.id);
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

  handleLike = async () => {
    const user = await who();
    const userid = user.uid;
    if (this.props.likeBucketItem) this.props.likeBucketItem(this.props.id ,userid);
  };

  render() {
    const { isEditing, editedName, editedDescription, editedDate, editedTime, editedCost, userId } = this.state;

    return (
        <div>
          {isEditing ? (
            <div>
              <div className="bucket_item_icons_container">
                <div className="bucket_item_icons_container_inner">
                  <button onClick={this.handleSave}><SaveIcon/></button>
                  <div className="spacer"/>
                  <button onClick={this.handleCancel}><UndoIcon/></button>
                </div>
                <div className="spacer"/>
              </div>
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
              <div className="bucket_item_icons_container">
                <div className="bucket_item_icons_container_inner"> 
                { userId === this.props.createdBy &&
                  <>
                  <button onClick={this.handleEdit}><PencilIcon /></button>
                  <div className="spacer"/>
                  <button onClick={this.deleteBucketItem}><TrashIcon/></button>
                  </>
                }
                </div>
                <div> 
                  {
                  userId && this.props.likedBy.includes(userId)
                    ? <button className="hide-button-border heart-icon-liked" onClick={this.handleLike}><HeartIcon/> </button>
                    : <button className="hide-button-border heart-icon" onClick={this.handleLike}> <HeartIcon/> </button>
                  }
                
                {this.props.id !== 'new' ? this.props.likes : <div></div>}
                </div>
              </div>
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
