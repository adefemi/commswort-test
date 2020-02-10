import React from "react";
import notFoundImg from "../assets/notFound.jpg";

function NotFound({ heading, content }) {
  return (
    <div className="not-found">
      <img src={notFoundImg} alt="not found" />
      <br />
      <div className="heading">{heading}</div>
      <div className="content">{content}</div>
    </div>
  );
}

export default NotFound;
