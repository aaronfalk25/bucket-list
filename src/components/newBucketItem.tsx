import React, { useState } from "react";
import "src/app/global.css";

const NewBucketItem = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div>
        <button onClick={() => setShowModal(true)}>
            Open First Modal
        </button>
      </div>

      {showModal ? (
        <div>
        <div className="pop-up">
          <div> Form for new popup content </div>
          <button onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
          <button className='backdrop' onClick={() => setShowModal(false)}></button>
          </div>
      ) : null}
    </div>
  );
  
};

export default NewBucketItem;
