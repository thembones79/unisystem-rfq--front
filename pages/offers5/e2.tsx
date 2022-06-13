import { marked } from "marked";
import { useState } from "react";

const Dupa = () => {
  const [text, setText] = useState("");

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => {
          console.log(e.target.value);
          setText(e.target.value);
        }}
      />
      <div
        id="preview"
        dangerouslySetInnerHTML={{ __html: marked.parse(text) }}
      />
      <hr />
      <div>{text}</div>
      <hr />
      <p>{text}</p>
      <hr />
      <textarea
        style={{ border: 0, width: "100%", height: "100%" }}
        value={text}
        readOnly
      />
    </div>
  );
};

export default Dupa;
