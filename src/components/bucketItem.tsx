import React, { ChangeEvent, KeyboardEvent } from "react";
import { BucketItem } from "src/interfaces/schema";
import { v4 as uuidv4 } from "uuid";
import {PencilIcon, TrashIcon, PlusIcon, HeartIcon, UndoIcon, SaveIcon, SadIcon, SmileIcon, ViewParticipantsIcon } from "@/components/icons";
import { who, getUserById } from "src/utilities/queries";
import Tooltip from "./Tooltip";
import ParticipantsWindow from "./ParticipantsWindow";
import Tag from "./Tag";

import "src/app/global.css";
import {
  updateIdInCloudFireStore,
  deleteFromCloudFireStore,
  readFromCloudFireStore,
} from "@/api/firebase/firebase";

interface Props extends BucketItem {
    updateBucketItem: (updatedItem: BucketItem) => Promise<void>;
    deleteBucketItem: (id: string) => void;
    likeBucketItem: (bucketId: string, userId: string) => Promise<void>;
    addParticipant: (bucketItem: string, userId: string) => Promise<void>;
  }

interface State {
    isEditing: boolean;
    editedName: string;
    editedDescription: string;
    editedDate: string;
    editedTime: string;
    editedCost: string;
    editedLocation: string;
    editedNumParticipants: number;
    userId: string | null;
    groupId: string;
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
      editedLocation: props.location? props.location : "",
      userId: null,
      groupId: props.groupId? props.groupId : ""
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
    const { editedName, editedDescription, editedDate, editedTime, editedCost, editedLocation, editedNumParticipants } = this.state;
    await updateIdInCloudFireStore(
      "bucketItems",
      {
        name: editedName,
        description: editedDescription,
        date: this.props.date? this.props.date : "",
        time: this.props.time? this.props.time : "",
        cost: this.props.cost? this.props.cost : "",
        location: this.props.location? this.props.location : "",
        numParticipants: this.props.numParticipants? this.props.numParticipants : 0,
        participants: [],
        likes: 0,
        likedBy: [],
        createdBy: this.props.createdBy? this.props.createdBy : "",
        groupId: this.props.groupId? this.props.groupId : ""
      },
      this.props.id
    );

      await this.props.updateBucketItem({
          id: this.props.id,
          name: editedName,
          description: editedDescription,
          date: editedDate,
          time: editedTime,
          numParticipants: editedNumParticipants,
          participants: [],
          cost: editedCost,
          location: editedLocation,
          likes: 0,
          likedBy: [],
          createdBy: this.props.createdBy? this.props.createdBy : "",
          groupId: this.props.groupId? this.props.groupId : ""
      });
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
            editedLocation: this.props.location? this.props.location : ""
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
    const { name, description, date, time, cost, location } = this.props;
    this.setState({
        isEditing: false,
        editedName: name,
        editedDescription: description,
        editedDate: date? date : "",
        editedTime: time? time : "",
        editedCost: cost? cost : "",
        editedLocation: location? location : ""
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

  handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ editedLocation: e.target.value });
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLElement | HTMLTextAreaElement>) => {
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

  handleAddParticipant = async () => {
    const user = await who();
    const userid = user.uid;
    if (this.props.addParticipant) this.props.addParticipant(this.props.id ,userid);
  };

  render() {
    const { isEditing, editedName, editedDescription, editedDate, editedTime, editedCost, editedLocation, userId } = this.state;

    return (
        <div>
          {isEditing ? (
            <div>
              <div className="bucket_item_icons_container">
                <div className="bucket_item_icons_container_inner">
                  <Tooltip message="Save">
                  <button onClick={this.handleSave}><SaveIcon/></button>
                  </Tooltip>
                  <div className="spacer"/>
                  <Tooltip message="Cancel Changes">
                  <button onClick={this.handleCancel}><UndoIcon/></button>
                  </Tooltip>
                </div>
              </div>
              <br></br>
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
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              <div className="bucket_item_container_inner_box">
              <div className="bucket-info-box">
              <div className="bucket-info-box-text"> <Tag>Date</Tag>
                <input
                  type="date"
                  value={editedDate}
                  onChange={this.handleDateChange}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              <div className="bucket-info-box-text"> <Tag>Time</Tag>
                <input
                  type="time"
                  value={editedTime}
                  onChange={this.handleTimeChange}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              <div className="bucket-info-box-text"> <Tag>Cost</Tag>
                <input
                  type="text"
                  placeholder="Cost $$$"
                  value={editedCost}
                  onChange={this.handleCostChange}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              <div className="bucket-info-box-text"> <Tag>Location</Tag>
                <input
                  type="text"
                  placeholder="Location"
                  value={editedLocation}
                  onChange={this.handleLocationChange}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              </div>
            </div>
            </div>
          ) : (
            <div>
              <div className="bucket_item_icons_container">
                <div className="bucket_item_icons_container_inner"> 
                { userId === this.props.createdBy &&
                  <>
                  <Tooltip message="Edit"><button onClick={this.handleEdit}><PencilIcon /></button></Tooltip>
                  <div className="spacer"/>
                  <Tooltip message="Delete"><button onClick={this.deleteBucketItem}><TrashIcon/></button></Tooltip>
                  </>
                }
                </div>
              <div>
                  <div className="like-container">
                    <div className="like-container-icon"> 
                      {
                      userId && this.props.likedBy.includes(userId)
                        ? <Tooltip message="Unlike"><button className="hide-button-border heart-icon-liked" onClick={this.handleLike}><HeartIcon/> </button></Tooltip>
                        : <Tooltip message="Like"><button className="hide-button-border heart-icon" onClick={this.handleLike}> <HeartIcon/> </button></Tooltip>
                      }
                    </div>
                    <p className="like-container-text">{this.props.likes}</p>
                </div>
                <div className="bucket_item_icons_container_inner">
                    <div>
                      {
                      userId && this.props.participants.includes(userId)
                        ? <Tooltip message="I can't make it"><button className="hide-button-border smile-icon-pressed" onClick={this.handleAddParticipant}><SmileIcon/> </button></Tooltip>
                        : <Tooltip message="I'll be there!"><button className="hide-button-border smile-icon" onClick={this.handleAddParticipant}> <SmileIcon/> </button></Tooltip>
                      }
                      </div>
                  <Tooltip message="View Participants"><ParticipantsWindow participants={this.props.participants}/></Tooltip>
                </div>

                <div>
                  {}
                </div>
              </div>
              </div>
              <h1>{editedName}</h1>
              <p>{editedDescription}</p>
              <div className="bucket_item_container_inner_box">
                <div className="bucket-info-box"> 
                <div className="bucket-info-box-text"><Tag>Date</Tag> {editedDate}</div>
                <div className="bucket-info-box-text"><Tag>Time</Tag>{editedTime}</div>
                <div className="bucket-info-box-text"><Tag>Cost</Tag>{editedCost}</div>
                <div className="bucket-info-box-text"><Tag>Location</Tag>{editedLocation}</div>
                </div> 
              </div>
            </div>
          )}
        </div>
      );
  }
}
