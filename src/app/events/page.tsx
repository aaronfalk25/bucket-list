"use client";

import "src/app/global.css";
import { writeToCloudFireStore, readFromCloudFireStore, updateIdInCloudFireStore } from "@/api/firebase/firebase";
import { BucketItem, User } from "@/interfaces/schema";
import { BucketItemComponent } from "@/components/bucketItem";
import React, {useEffect} from "react";

export default function Events() {

   // Render all bucket items from firestore
    const [bucketItems, setBucketItems] = React.useState<BucketItem[]>([]);
    
    useEffect(() => {
        fetchBucketItems();
      }, []);
    
      const fetchBucketItems = async () => {
        const res = await readFromCloudFireStore("bucketItems");
        const fetchedBucketItems = res.documents.map(
          (doc) => doc as unknown as BucketItem
        );
        setBucketItems(fetchedBucketItems);
      };
    
      const dispBucketItems = () => {
        return bucketItems.map((bucketItem) => {
          return (
            <div key={bucketItem.id} className="bucket_item_container">
              <BucketItemComponent
                {...bucketItem}
                updateBucketItem={updateBucketItem}
              />
            </div>
          );
        });
      };
    
      const updateBucketItem = async (updatedItem: BucketItem) => {
        await updateIdInCloudFireStore(
          "bucketItems",
          updatedItem,
          updatedItem.id
        );
        fetchBucketItems();
      };

    function newBucketItem() {
        return <div className="bucket_item_container"><BucketItemComponent
        updateBucketItem={updateBucketItem} 
            id="new" 
            name="New Bucket Item" 
            description="This is a new bucket item" 
            likes={0}
            likedBy={[] as User[]}/></div>
    }

return(
<div className="">
    <h1>
        Hello World!
    </h1>

    <div>
        <button onClick={(e:any) => writeToCloudFireStore("bucketItems", {"name": "test", "description": "This is a test", likes: 0})}>Write to Cloud Firestore</button>

        <button onClick={() => readFromCloudFireStore("bucketItems")}>Read from Cloud Firestore</button>
    </div>

    <div className = "bucket_item_box" >
    {dispBucketItems()}
    {newBucketItem()}
    </div> 
    
    
</div>)

}