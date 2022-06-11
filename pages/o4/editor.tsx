import Editor from "rich-markdown-editor";

const Dupa = () => (
  <Editor
    defaultValue={`Hello wob**bbbbbb**brld!


  1. kkkkkk
  2. jjjjj
  3. jjjkjkjmm

  jhjhhjh


  1. dupa
  2. kupa

  \
  `}
    onChange={(e) => console.log(e())}
  />
);

export default Dupa;
