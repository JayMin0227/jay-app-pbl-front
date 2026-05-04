
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Ideas() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/book");
  }, [router]);

  return null;
}



// // 修正後のコード
// // 共通部分: APIベースURLを環境変数から取得
// const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Idea } from "../types/idea";
//  // 修正
// import {
//   Button,
//   Input,
//   Textarea,

// } from "@chakra-ui/react";

// export default function Ideas() {
//     const [ideas, setIdeas] = useState<Idea[]>([]);
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");
//     const [tags, setTags] = useState("");
//     const [searchKeyword, setSearchKeyword] = useState("");
//     const [editId, setEditId] = useState<number | null>(null);
  
//     async function fetchIdeas() {
//       const res = await axios.get(`${API_BASE_URL}/ideas`);
//       setIdeas(res.data);
//     }
  
//     async function saveIdea() {
//       if (editId) {
//         await axios.put(`${API_BASE_URL}/ideas/${editId}`, {
//           title,
//           content,
//           tags,
//         });
//         setEditId(null);
//       } else {
//         await axios.post(`${API_BASE_URL}/ideas`, {
//           title,
//           content,
//           tags,
//         });
//       }
//       setTitle("");
//       setContent("");
//       setTags("");
//       fetchIdeas();
//     }
  



//     //ddd
//     async function searchIdeas() {
//       const res = await axios.get(`${API_BASE_URL}/ideas/search`, {
//         params: { keyword: searchKeyword },
//       });
//       setIdeas(res.data);
//     }
  
//     useEffect(() => {
//       fetchIdeas();
//     }, []);



//       // 警告を回避するための useEffect
//   useEffect(() => {
//     console.log(ideas); // `ideas` の使用を明示
//   }, [ideas]);
  
//     return (
//       <div>
//         <Input
//           placeholder="Search by keyword"
//           value={searchKeyword}
//           onChange={(e) => setSearchKeyword(e.target.value)}
//         />
//         <Button onClick={searchIdeas}>Search</Button>
//         <Input
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <Textarea
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />
//         <Input
//           placeholder="Tags (comma separated)"
//           value={tags}
//           onChange={(e) => setTags(e.target.value)}
//         />
//         <Button onClick={saveIdea}>
//           {editId ? "Update Idea" : "Add Idea"}
//         </Button>
//       </div>
//     );
//   }

