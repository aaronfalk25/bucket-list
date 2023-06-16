"use client";

import "src/app/global.css";
import { writeToCloudFireStore, readFromCloudFireStore } from "@/api/firebase/firebase";

export default function Events() {
return(
<div>
    <h1>
        Hello World!
    </h1>

    <div>
        <button onClick={(e:any) => writeToCloudFireStore("users", {"test": 1, "another": 2})}>Write to Cloud Firestore</button>

        <button onClick={(e:any) => readFromCloudFireStore("users")}>Read from Cloud Firestore</button>
    </div>

</div>)

}