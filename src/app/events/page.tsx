"use client";

import "src/app/global.css";
import { writeToCloudFireStore, readFromCloudFireStore, updateIdInCloudFireStore, deleteFromCloudFireStore } from "@/api/firebase/firebase";
import { BucketItem, User } from "@/interfaces/schema";
import { BucketItemComponent } from "@/components/bucketItem";
import React, {useEffect} from "react";
import NewBucketItem from "@/components/newBucketItem"; 
import Header from "@/components/Header";
import { isLoggedIn } from "@/utilities/login";
import { useRouter } from 'next/navigation';
import { who } from "src/utilities/queries";

export default function Events() {

   // Render all bucket items from firestore
    const [bucketItems, setBucketItems] = React.useState<BucketItem[]>([]);
    const router = useRouter();
    
    useEffect(() => {
        fetchBucketItems();
      }, []);
    
      const fetchBucketItems = async () => {
        const res = await readFromCloudFireStore("bucketItems");
        const fetchedBucketItems = res.documents.map(
          (doc) => doc as unknown as BucketItem
        );
        setBucketItems(fetchedBucketItems);

        const user = await who();
        if (!user.userSelectedGroup) {
          router.push('/');
        }

      };
    
      const dispBucketItems = () => {
        return bucketItems.map((bucketItem) => {
          return (
            <div key={bucketItem.id} className="bucket_item_container">
              <BucketItemComponent
                {...bucketItem}
                updateBucketItem={updateBucketItem}
                deleteBucketItem={deleteBucketItem}
                likeBucketItem={likeBucketItem}
                addParticipant={addParticipant}
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
      
      const deleteBucketItem = async (id: string) => {
        await deleteFromCloudFireStore("bucketItems", id);
        fetchBucketItems();
        };

        const likeBucketItem = async (bucketId: string, userId: string) => {
            const bucketItem = bucketItems.find((item) => item.id === bucketId);
            if (userId !== "") {
              if (bucketItem) {
                if (bucketItem.likedBy.includes(userId)) {
                  bucketItem.likedBy = bucketItem.likedBy.filter((item) => item !== userId);
                  bucketItem.likes = bucketItem.likes - 1;
                }
                else {
                  bucketItem.likedBy.push(userId);
                  bucketItem.likes = bucketItem.likes + 1;
                }
                await updateIdInCloudFireStore(
                  "bucketItems",
                  bucketItem,
                  bucketItem.id
                );
                fetchBucketItems();
              }
            }
          }

          const addParticipant = async (bucketId: string, userId: string) => {
            const bucketItem = bucketItems.find((item) => item.id === bucketId);
            if (userId !== "") {
              if (bucketItem) {
                if (bucketItem.participants.includes(userId)) {
                  bucketItem.participants = bucketItem.participants.filter((item) => item !== userId);
                }
                else {
                  bucketItem.participants.push(userId);
                }
                await updateIdInCloudFireStore(
                  "bucketItems",
                  bucketItem,
                  bucketItem.id
                );
                fetchBucketItems();
              }
            }
          }

      const fetchBucketItemsAfterSubmission = async () => {
        await fetchBucketItems();
      };

return(
<div>

    <Header/>
    <br></br>
    <div className = "bucket_item_box" >
    {isLoggedIn() && bucketItems.length > 1 && <NewBucketItem fetchBucketItemsAfterSubmission={fetchBucketItemsAfterSubmission}/>}
    {dispBucketItems()}
    {isLoggedIn() && <NewBucketItem fetchBucketItemsAfterSubmission={fetchBucketItemsAfterSubmission}/>}
    </div> 
    
    
</div>)

}