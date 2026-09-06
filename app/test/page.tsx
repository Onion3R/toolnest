import React from 'react'

function page() {

  function hanldeUploadFile(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    console.log(JSON.stringify(file)); // "{}"
  }

  return (
    <div><input type="file" /></div>
  )
}

export default page