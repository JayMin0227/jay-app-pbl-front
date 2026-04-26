// import { DeleteIcon, EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";


// import { AddIcon ,ArrowUpIcon,HamburgerIcon,ArrowBackIcon } from "@chakra-ui/icons"; // 必要に応じてアイコンを変更


// import { useEffect, useState, useRef } from "react";
// import {
//   Button,

//   Input,
//   HStack,
//   Tag,
//   VStack,
//   Box,
//   Text,
//   Link as ChakraLink,
//   Spinner,
//   Heading,
// } from "@chakra-ui/react";






// import {
//   Table,
//   // Thead,
  
//   // Tfoot,
//   // Tr,
//   // Th,
//   // Td,
//   TableCaption,
//   // TableContainer,
// } from '@chakra-ui/react'




// import axios from "axios";
// import { useRouter } from "next/router";
// import supabase from "@/libs/supabase";
// import { sessionState } from "@/libs/states";
// import { useRecoilState } from "recoil";
// import { LogoutButton } from "@/components/Buttons/LogOutButton";
// import { IconButton } from "@chakra-ui/react";
// import { SearchIcon } from "@chakra-ui/icons";

// import { Tooltip } from '@chakra-ui/react';


// import { AxiosError } from "axios";

// interface Memo {
//   id: number;
//   title: string;
//   content: string;
//   tags: string[];
//   created_at: string;
//   isCompleted?: boolean; // 新しいプロパティを追加（オプショナル）
// }



// function ensureTagsArray(tags: string | string[] | undefined): string[] {
//   if (Array.isArray(tags)) {
//     return tags;
//   } else if (typeof tags === "string") {
//     return tags.split(",");
//   }
//   return [];
// }

// export default function MemoApp() {
//   const [session, setSession] = useRecoilState(sessionState);
//   const [memos, setMemos] = useState<Memo[]>([]);
//   const [newTitle, setNewTitle] = useState("");
//   const [newContent, setNewContent] = useState("");
//   const [newTags, setNewTags] = useState("");
//   const [isLoading, setIsLoading] = useState(true); // 読み込み状態
//   const router = useRouter();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
//   const [isSearchVisible, setIsSearchVisible] = useState(false); // 検索バー表示状態
//   const [searchKeyword, setSearchKeyword] = useState(""); // 検索キーワード
//   const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]); // 検索結果のメモ
 
  
  


  
//   const [editMemoId, setEditMemoId] = useState<number | null>(null);

//   const saveEdit = async (id: number) => {
//     try {
//       // 必須フィールドのチェック
//       if (!newTitle.trim() || !newContent.trim() || !newTags.trim()) {
//         alert("すべてのフィールドを入力してください！");
//         return;
//       }
  
//       // サーバーが期待するデータ形式に整形
//       const dataToSend = {
//         title: newTitle.trim(),
//         content: newContent.trim(),
//         tags: newTags.trim(), // カンマ区切りの文字列形式で送信
//       };
  
//       console.log("送信データ:", dataToSend); // デバッグ用ログ
  
//       // サーバーにデータを送信
//       const response = await axios.put(`http://localhost:8000/ideas/${id}`, dataToSend);
  
//       console.log("サーバーからの応答:", response.data); // 成功時の応答
  
//       // 成功時の処理
//       await fetchMemos();
//       setEditMemoId(null); // 編集モードを解除
//       setNewTitle(""); // フォームをリセット
//       setNewContent("");
//       setNewTags("");
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         if (err.response) {
//           console.error("サーバーエラー:", err.response.status, err.response.data);
//           alert(`編集に失敗しました: ${JSON.stringify(err.response.data?.detail || "サーバーでエラーが発生しました。")}`);
//         } else {
//           console.error("通信エラー:", err.message);
//           alert("通信エラーが発生しました。サーバーが稼働しているか確認してください。");
//         }
//       } else if (err instanceof Error) {
//         console.error("未知のエラー:", err.message);
//         alert("予期しないエラーが発生しました。");
//       } else {
//         console.error("エラーの詳細:", err);
//         alert("不明なエラーが発生しました。");
//       }
//     }
//   };
  
   
  
  


//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const { data: sessionData, error } = await supabase.auth.getSession();
//         if (error || !sessionData?.session) {
//           console.log("セッションなし: / にリダイレクト");
//           router.replace("/");
//           return;
//         }
//         console.log("セッション確認成功:", sessionData.session);
//         setSession(sessionData.session); // Recoil の状態を更新
//       } catch (err) {
//         console.error("セッション確認エラー:", err);
//         router.replace("/");
//       } finally {
//         setIsLoading(false); // 必ず呼び出されるように修正
//       }
//     };
  
//     checkSession();
//   }, [router, setSession]);
  
//   // セッション確認後にのみ fetchMemos を呼び出す
//   useEffect(() => {
//     if (!isLoading && session) {
//       fetchMemos();
//     }
//   }, [isLoading, session]);
  
//   // const fetchMemos = async () => {
//   //   try {
//   //     const res = await axios.get("http://localhost:8000/ideas");
//   //     const sortedMemos = res.data.map((memo: Memo) => ({
//   //       ...memo,
//   //       tags: ensureTagsArray(memo.tags),
//   //       formattedDate: formatDate(memo.created_at),
//   //     }));
//   //     setMemos(sortedMemos);
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };



//   const fetchMemos = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/ideas");
//       const sortedMemos = res.data.map((memo: Memo) => ({
//         ...memo,
//         tags: ensureTagsArray(memo.tags),
//         formattedDate: formatDate(memo.created_at),
//         isCompleted: memo.isCompleted ?? false, // デフォルト値として false を設定
//       }));
//       setMemos(sortedMemos);
//     } catch (err) {
//       console.error(err);
//     }
//   };

  

//   const toggleComplete = (id: number) => {
//     setMemos((prevMemos) =>
//       prevMemos.map((memo) =>
//         memo.id === id
//           ? { ...memo, isCompleted: !memo.isCompleted }
//           : memo
//       )
//     );
//   };
  
  
//   // 読み込み中の状態
//   if (isLoading) {
//     return (
//       <VStack height="100vh" justify="center">
//         <Spinner size="xl" />
//         <Heading>読み込み中...</Heading>
//       </VStack>
//     );
//   }
  





//   const handleSearch = async () => {
//     if (!searchKeyword.trim()) {
//       alert("検索キーワードを入力してください！");
//       return;
//     }
  
//     try {
//       const response = await axios.get("http://localhost:8000/ideas/search", {
//         params: { keyword: searchKeyword.trim() },
//       });
//       setFilteredMemos(response.data); // 検索結果を状態に保存
//     } catch (err) {
//       console.error("検索エラー:", err);
//       alert("検索に失敗しました。");
//     }
//   };

  





//   const addMemo = async () => {
//     if (!newTitle || !newContent) {
//       alert("タイトルと内容を入力してください！");
//       return;
//     }
//     try {
//       await axios.post("http://localhost:8000/ideas", {
//         title: newTitle,
//         content: newContent,
//         tags: newTags,
//       });
//       setNewTitle("");
//       setNewContent("");
//       setNewTags("");
//       fetchMemos();
//     } catch (err) {
//       console.error(err);
//       alert("メモの追加に失敗しました。");
//     }
//   };

//   const deleteMemo = async (id: number) => {
//     try {
//       await axios.delete(`http://localhost:8000/ideas/${id}`);
//       fetchMemos();
//     } catch (err) {
//       console.error(err);
//       alert("削除に失敗しました。");
//     }
//   };





  


//    const formatDate = (dateString: string): string => {
//     const utcDate = new Date(dateString); // 入力日付をUTCで扱う
//     const jstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // UTCから日本時間に変換

//     // 曜日の配列
//     const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

//     // 年、月、日、曜日を取得
//     const year = jstDate.getFullYear();
//     const month = (jstDate.getMonth() + 1).toString().padStart(2, "0"); // 月を2桁でフォーマット
//     const day = jstDate.getDate().toString().padStart(2, "0"); // 日を2桁でフォーマット
//     const weekDay = dayNames[jstDate.getDay()]; // 曜日を取得

//     // フォーマットされた日付を返す
//     return `${year}-${month}-${day}(${weekDay})`;
// };



//   const groupedMemos = memos.reduce((acc: Record<string, Memo[]>, memo) => {
//     const date = memo.created_at.split("T")[0];
//     if (!acc[date]) acc[date] = [];
//     acc[date].push(memo);
//     return acc;
//   }, {});

//   if (isLoading) {
//     return (
//       <VStack height="100vh" justify="center">
//         <Spinner size="xl" />
//         <Heading>読み込み中...</Heading>
//       </VStack>
//     );
//   }




//   return (
//     <HStack align="start" gap={0}>
//       {/* サイドバー */}














//       <Box
//         position="fixed"
//         top="0"
//         left="0"
//         h="100vh"
//         w={isSidebarOpen ? "10%" : "5%"}
//         bg="gray.100"
//         shadow="lg"
//         transition="width 0.3s ease-in-out"
//         zIndex="1000"
//       >
//         {isSidebarOpen ? (
//           <Box p="4">
//             <HStack justifyContent="space-between">
//   <Text fontWeight="bold" mb="4">
//     作業日時目次
//   </Text>






//   {/* <Tooltip label="検索する">
//   <IconButton
//     aria-label="検索"
//     icon={<SearchIcon />}
//     size="sm"
//     onClick={() => setIsSearchVisible(!isSearchVisible)}
//   />
//   </Tooltip> */}





// <Box
//   as="button"
//   aria-label="検索"
//   display="flex"
//   alignItems="center"
//   justifyContent="center"
//   bg="transparent"
//   borderRadius="md"
//   padding="4px"
//   cursor="pointer"
//   _hover={{ bg: "gray.100" }}
//   _focus={{ boxShadow: "outline" }}
//   onClick={() => setIsSearchVisible(!isSearchVisible)}
// >
//   <SearchIcon boxSize={4} />
// </Box>









// </HStack>

// {isSearchVisible && (
//   <Box mb="4">
//     <HStack>
//       <Input
//         placeholder="キーワードを入力"
//         value={searchKeyword}
//         onChange={(e) => setSearchKeyword(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             if (searchKeyword.trim() === "") {
//               // キーワードが空の場合は元の画面に戻る
//               setFilteredMemos([]); // 検索結果をリセット
//             } else {
//               handleSearch(); // 検索を実行
//             }
//           }
//         }}
//         size="sm"
//       />





//       {/* <Button size="sm" colorScheme="teal" onClick={handleSearch}>
//         検索
//       </Button> */}

// {/* <Tooltip label="空にしてEnterを押せば元に戻ります。">
// <IconButton
//   aria-label="検索" // アクセシビリティ対応
//   icon={<SearchIcon />} // Chakra UI の虫眼鏡アイコン
//   size="sm"
//   bg="brown" // 背景をブラウンに変更
//   color="white" // アイコンの色を白に
//   border="2px solid brown" // 枠線をブラウンに
//   borderRadius="md" // ボタンの角を丸くする
//   _hover={{ bg: "darkred" }} // ホバー時に背景色を濃い赤色に
//   onClick={handleSearch} // 検索機能はそのまま
// />
// </Tooltip> */}



// <Box
//   as="button"
//   aria-label="検索"
//   display="flex"
//   alignItems="center"
//   justifyContent="center"
//   bg="brown"
//   color="white"
//   border="2px solid brown"
//   borderRadius="md"
//   width="32px"
//   height="32px"
//   cursor="pointer"
//   _hover={{ bg: "darkred" }}
//   _focus={{ boxShadow: "outline" }}
//   onClick={handleSearch}
// >
//   <SearchIcon boxSize={4} />
// </Box>






//     </HStack>
//   </Box>
// )}


// <VStack align="start" gap={2}>
//   {Object.keys(groupedMemos)
//     .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
//     .map((date) => (
//       <Box
//         key={date}
//         onClick={() => {
//           const section = document.getElementById(`section-${date}`);
//           if (section) {
//             section.scrollIntoView({ behavior: "smooth" });
//           }
//         }}
//         fontSize="sm" // 適度な文字サイズ
//         fontWeight="bold" // 文字を太く
//         color="black" // 黒色
//         cursor="pointer" // ポインタとして設定
//         _hover={{
//           opacity: 0.7, // カーソルを合わせた時に透明感を追加
//         }}
//       >
//         {formatDate(date)}
//       </Box>
//     ))}
// </VStack>








            




// {/* 
//             <IconButton
//         aria-label="閉じる目次"
//         icon={<ArrowBackIcon  />} // 閉じるアイコン
//         colorScheme="red"
//         bg="red.500" // 背景を赤色に
//         color="white"
//         size="md"
//         borderRadius="full"
//         transform="translateX(100%)" // アイコンの中央位置調整
//         bottom="100%" // ここで位置を調整（値を増やすと下がる）
//         _hover={{ bg: "red.600" }}
//         onClick={() => setIsSidebarOpen(false)} // サイドバーを閉じる
//       /> */}
// {/* 
// <Tooltip label="目次を閉じる">
//       <IconButton
//   aria-label="閉じる目次"
//   icon={<ArrowBackIcon />} // 閉じるアイコン
//   colorScheme="red"
//   bg="red.500" // 背景を赤色に
//   color="white"
//   size="md"
//   borderRadius="full"
//   position="absolute" // 位置を絶対値指定
//   left="50%" // 横位置を中央に
//   transform="translateX(-50%)" // 中央揃え調整
//   bottom="10%" // 下に下げる値（%やpxで調整可能）
//   _hover={{ bg: "red.600" }}
//   onClick={() => setIsSidebarOpen(false)} // サイドバーを閉じる
// />

// </Tooltip> */}

// <Box
//   as="button"
//   aria-label="閉じる目次"
//   display="flex"
//   alignItems="center"
//   justifyContent="center"
//   bg="red.500"
//   color="white"
//   borderRadius="50%"
//   position="absolute"
//   left="50%"
//   transform="translateX(-50%)"
//   bottom="10%"
//   width="48px"
//   height="48px"
//   boxShadow="md"
//   cursor="pointer"
//   _hover={{ bg: "red.600" }}
//   _focus={{ boxShadow: "outline" }}
//   onClick={() => setIsSidebarOpen(false)}
// >
//   <ArrowBackIcon boxSize={6} />
// </Box>






//     </Box>
//   ) : (
    


// //     <Tooltip label="目次を開く">
// //   <IconButton
// //     position="absolute"
// //     top="1rem"
// //     left="1rem"
// //     aria-label="目次を開く"
// //     icon={<HamburgerIcon />}
// //     colorScheme="blue"
// //     bg="blue.500"
// //     color="white"
// //     size="md"
// //     borderRadius="full"
// //     _hover={{ bg: "blue.600" }}
// //     onClick={() => setIsSidebarOpen(true)}
// //   />
// // </Tooltip>




// <Box
//   as="button"
//   position="absolute"
//   top="1rem"
//   left="1rem"
//   aria-label="目次を開く"
//   display="flex"
//   alignItems="center"
//   justifyContent="center"
//   bg="blue.500"
//   color="white"
//   borderRadius="50%"
//   width="48px"
//   height="48px"
//   boxShadow="md"
//   cursor="pointer"
//   _hover={{ bg: "blue.600" }}
//   _focus={{ boxShadow: "outline" }}
//   onClick={() => setIsSidebarOpen(true)}
// >
//   <HamburgerIcon boxSize={6} />
// </Box>








//   )}
// </Box>
      









//       {/* メモ一覧 */}
//       <VStack gap={4} align="stretch" ml={isSidebarOpen ? "10%" : "5%"} w={isSidebarOpen ? "90%" : "95%"} h="calc(100vh - 60px)" overflowY="auto">
//         {/* ログアウトボタン */}

      
//         <Box position="fixed" top="1rem" right="1rem" zIndex="10">
//           <LogoutButton />
//         </Box>
       



// {/* 
//         {filteredMemos.length > 0
//   ? filteredMemos.map((memo) => (
//       <Box key={memo.id} p="4" borderWidth="1px" borderRadius="md" bg="white" shadow="sm">
//         <TableContainer>
//           <Table variant="simple" size="sm">
//             <Thead>
//               <Tr>
//                 <Th w="20%">タイトル</Th>
//                 <Th w="50%">内容</Th>
//                 <Th w="20%">タグ</Th>
//                 <Th w="10%">操作</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               <Tr>
//               <Td
//   whiteSpace="normal"
//   textDecoration={memo.isCompleted ? "line-through" : "none"}
//   onClick={() => toggleComplete(memo.id)}
// >
//   {memo.title}
// </Td>
// <Td
//   whiteSpace="normal"
//   textDecoration={memo.isCompleted ? "line-through" : "none"}
//   onClick={() => toggleComplete(memo.id)}
// >
//   {memo.content}
// </Td>
// <Td>
//   {memo.tags.map((tag, index) => (
//     <Tag
//       key={index}
//       mr={1}
//       cursor="pointer"
//       textDecoration={memo.isCompleted ? "line-through" : "none"}
//       onClick={() => toggleComplete(memo.id)}
//     >
//       {tag}
//     </Tag>
//   ))}
// </Td>

//                 <Td>
//                   <Button
//                     colorScheme="blue"
//                     size="sm"
//                     onClick={() => {
//                       setEditMemoId(memo.id);
//                       setNewTitle(memo.title);
//                       setNewContent(memo.content);
//                       setNewTags(memo.tags.join(", "));
//                     }}
//                   >
//                     編集
//                   </Button>
//                   <Button
//                     colorScheme="red"
//                     size="sm"
//                     onClick={() => deleteMemo(memo.id)}
//                   >
//                     削除
//                   </Button>
//                 </Td>
//               </Tr>
//             </Tbody>
//           </Table>
//         </TableContainer>
//       </Box>
//     ))
//  */}


// {filteredMemos.length > 0
//   ? filteredMemos.map((memo) => (
//       <div
//         key={memo.id}
//         style={{
//           padding: "16px",
//           border: "1px solid #e2e8f0",
//           borderRadius: "8px",
//           backgroundColor: "white",
//           boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//           marginBottom: "16px",
//         }}
//       >
//         <div style={{ overflowX: "auto", marginBottom: "16px" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
//                 <th style={{ width: "20%", padding: "8px", textAlign: "left" }}>タイトル</th>
//                 <th style={{ width: "50%", padding: "8px", textAlign: "left" }}>内容</th>
//                 <th style={{ width: "20%", padding: "8px", textAlign: "left" }}>タグ</th>
//                 <th style={{ width: "10%", padding: "8px", textAlign: "left" }}>操作</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
//                 <td
//                   style={{
//                     padding: "8px",
//                     whiteSpace: "normal",
//                     textDecoration: memo.isCompleted ? "line-through" : "none",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => toggleComplete(memo.id)}
//                 >
//                   {memo.title}
//                 </td>
//                 <td
//                   style={{
//                     padding: "8px",
//                     whiteSpace: "normal",
//                     textDecoration: memo.isCompleted ? "line-through" : "none",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => toggleComplete(memo.id)}
//                 >
//                   {memo.content}
//                 </td>
//                 <td style={{ padding: "8px" }}>
//                   {memo.tags.map((tag, index) => (
//                     <span
//                       key={index}
//                       style={{
//                         marginRight: "8px",
//                         padding: "4px 8px",
//                         backgroundColor: "#edf2f7",
//                         borderRadius: "4px",
//                         cursor: "pointer",
//                         display: "inline-block",
//                         textDecoration: memo.isCompleted ? "line-through" : "none",
//                       }}
//                       onClick={() => toggleComplete(memo.id)}
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </td>
//                 <td style={{ padding: "8px" }}>
//                   <button
//                     style={{
//                       padding: "4px 8px",
//                       backgroundColor: "#4299e1",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                       marginRight: "8px",
//                     }}
//                     onClick={() => {
//                       setEditMemoId(memo.id);
//                       setNewTitle(memo.title);
//                       setNewContent(memo.content);
//                       setNewTags(memo.tags.join(", "));
//                     }}
//                   >
//                     編集
//                   </button>
//                   <button
//                     style={{
//                       padding: "4px 8px",
//                       backgroundColor: "#e53e3e",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => deleteMemo(memo.id)}
//                   >
//                     削除
//                   </button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     ))













//   // : Object.entries(groupedMemos).map(([date, memos]) => (
//   //     <Box key={date} id={`section-${date}`} p="4" borderWidth="1px" borderRadius="md" bg="white" shadow="sm">
//   //       <Text fontWeight="bold" fontSize="lg" mb="2">
//   //       {formatDate(date)}
//   //       </Text>
//   //           <TableContainer>

//   // <Table variant="simple" size="sm">
//   //   <Thead>
//   //     <Tr>
//   //       <Th w="20%">タイトル</Th>
//   //       <Th w="50%">内容</Th>
//   //       <Th w="20%">タグ</Th>
//   //       <Th w="10%">操作</Th>
//   //     </Tr>
//   //   </Thead>


//   : Object.entries(groupedMemos).map(([date, memos]) => (
//     <div
//       key={date}
//       id={`section-${date}`}
//       style={{
//         padding: "16px",
//         border: "1px solid #e2e8f0",
//         borderRadius: "8px",
//         backgroundColor: "white",
//         boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//         marginBottom: "16px",
//       }}
//     >
//       <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "8px" }}>
//         {formatDate(date)}
//       </h3>
//       <div style={{ overflowX: "auto" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
//               <th style={{ width: "20%", padding: "8px", textAlign: "left" }}>タイトル</th>
//               <th style={{ width: "50%", padding: "8px", textAlign: "left" }}>内容</th>
//               <th style={{ width: "20%", padding: "8px", textAlign: "left" }}>タグ</th>
//               <th style={{ width: "10%", padding: "8px", textAlign: "left" }}>操作</th>
//             </tr>
//           </thead>







//     <tbody>
//   {memos.map((memo) => (
//     <tr key={memo.id}>
//       {editMemoId === memo.id ? (
//         // 編集モード
//         <>
//           <td>
//             <Input
//               value={newTitle}
//               onChange={(e) => setNewTitle(e.target.value)}
//               placeholder="タイトルを入力"
//             />
//           </td>
//           <td>
//             <Input
//               value={newContent}
//               onChange={(e) => setNewContent(e.target.value)}
//               placeholder="内容を入力"
//             />
//           </td>
//           <td>
//             <Input
//               value={newTags}
//               onChange={(e) => setNewTags(e.target.value)}
//               placeholder="タグ (カンマ区切り)"
//             />
//           </td>
//           <td>





//           {/* <Tooltip label="追加する">
//           <IconButton
//   aria-label="Add Memo"
//   icon={<CheckIcon boxSize={6} />} // チェックアイコンに変更
//   colorScheme="green"
//   bg="green.500" // 背景を緑色に
//   color="white" // アイコンを白色に
//   borderRadius="full" // 丸型
//   size="lg" // サイズを大きめに
//   _hover={{ bg: "green.600" }} // ホバー時に濃い緑色
//   _focus={{ boxShadow: "outline" }} // フォーカス時にアウトラインを表示
//   zIndex="10" // 他の要素の上に表示
//   onClick={() => saveEdit(memo.id)}

// />

// </Tooltip> */}


// <Box
//   as="button"
//   aria-label="Add Memo"
//   display="flex"
//   alignItems="center"
//   justifyContent="center"
//   bg="green.500"
//   color="white"
//   borderRadius="50%"
//   boxShadow="lg"
//   width="48px"
//   height="48px"
//   _hover={{ bg: "green.600" }}
//   _focus={{ boxShadow: "outline" }}
//   onClick={() => saveEdit(memo.id)}
//   cursor="pointer"
// >
//   <CheckIcon boxSize={6} />
// </Box>








// {/* 
// <Tooltip label="キャンセルする">
// <IconButton
//   aria-label="Cancel Edit"
//   icon={<CloseIcon boxSize={6} />} // キャンセルアイコン
//   colorScheme="red"
//   bg="red.500" // 背景を赤色に
//   color="white" // アイコンを白色に
//   borderRadius="full" // 丸型
//   size="md" // サイズを中程度に
//   _hover={{ bg: "red.600" }} // ホバー時に濃い赤色
//   _focus={{ boxShadow: "outline" }} // フォーカス時にアウトラインを表示
//   zIndex="10" // 他の要素の上に表示
//   onClick={() => {
//     setEditMemoId(null); // 編集モード解除
//     setNewTitle(""); // 入力値リセット
//     setNewContent("");
//     setNewTags("");
//   }}
// />

// </Tooltip>
//  */}






// <Box
//   as="button"
//   aria-label="Cancel Edit"
//   display="flex"
//   alignItems="center"
//   justifyContent="center"
//   bg="red.500"
//   color="white"
//   borderRadius="50%"
//   boxShadow="lg"
//   width="48px"
//   height="48px"
//   _hover={{ bg: "red.600" }}
//   _focus={{ boxShadow: "outline" }}
//   onClick={() => {
//     setEditMemoId(null);
//     setNewTitle("");
//     setNewContent("");
//     setNewTags("");
//   }}
//   cursor="pointer"
// >
//   <CloseIcon boxSize={6} />
// </Box>












//           </td>
//         </>
//       ) : (
//         // 通常モード
//         <>
//           {/* タイトル */}








//      {/* タイトル */}
// <td
//   style={{
//     whiteSpace: "normal", // 改行を許可する
//     textDecoration: memo.isCompleted ? "line-through" : "none", // 取り消し線を適用
//     cursor: "pointer", // カーソルをポインタに
//   }}
//   onClick={() => toggleComplete(memo.id)} // クリックで状態をトグル
// >
//   {memo.title}
// </td>

// {/* 内容 */}
// <td
//   style={{
//     whiteSpace: "normal", // 改行を許可する
//     textDecoration: memo.isCompleted ? "line-through" : "none", // 取り消し線を適用
//     cursor: "pointer", // カーソルをポインタに
//   }}
//   onClick={() => toggleComplete(memo.id)} // クリックで状態をトグル
// >
//   {memo.content}
// </td>









//           {/* タグ */}
//           <td>
//             {memo.tags.map((tag, index) => (





 


              

// //               <Tag
// //   key={index}
// //   mr={1}
// //   cursor="pointer"
// //   maxWidth="100px" // タグの横幅を100pxに制限
// //   isTruncated
// //   px={2}
// //   fontSize="sm" // フォントサイズを小さく
// // >
// //   {tag}
// // </Tag>




// <Box
//   key={index}
//   as="span" // インライン要素に設定
//   display="inline-block" // タグとしての見た目
//   px={2} // 内側の余白を設定
//   py={1} // 縦方向の内側余白
//   fontSize="sm" // 小さめの文字サイズ
//   fontWeight="bold" // 太字に設定
//   borderRadius="md" // 角を丸く
//   bg="gray.200" // 背景色を設定
//   color="black" // 文字色を設定
//   cursor="pointer" // クリック可能なカーソル
//   maxWidth="100px" // 最大横幅
//   overflow="hidden" // コンテンツがはみ出した場合に隠す
//   textOverflow="ellipsis" // 省略記号を表示
//   whiteSpace="nowrap" // 1行に表示
//   _hover={{ bg: "gray.300" }} // ホバー時の背景色
//   onClick={() => console.log("Tag clicked")} // クリックイベント
// >
//   {tag}
// </Box>





//             ))}
//           </td>











//           <td>
            

//           {/* <Tooltip label="編集する">
//           <IconButton
//   aria-label="Edit Memo"
//   icon={<EditIcon boxSize={6} />} // ペンアイコン
//   colorScheme="blue"
//   bg="blue.500" // 背景を青色に
//   color="white" // アイコンを白色に
//   borderRadius="full" // 丸型
//   size="md" // サイズを中程度に
//   _hover={{ bg: "blue.600" }} // ホバー時に濃い青色
//   _focus={{ boxShadow: "outline" }} // フォーカス時にアウトラインを表示
//   zIndex="10" // 他の要素の上に表示
//   onClick={() => {
//     setEditMemoId(memo.id); // 編集モード切り替え
//     setNewTitle(memo.title); // 編集データセット
//     setNewContent(memo.content);
//     setNewTags(memo.tags.join(", "));
//   }}
// />
// </Tooltip> */}


// <Box
//   as="button"
//   aria-label="Edit Memo"
//   position="relative"
//   display="flex"
//   alignItems="center"
//   justifyContent="center"
//   bg="blue.500"
//   color="white"
//   borderRadius="full"
//   padding="12px"
//   _hover={{ bg: "blue.600" }}
//   _focus={{ boxShadow: "outline" }}
//   onClick={() => {
//     setEditMemoId(memo.id);
//     setNewTitle(memo.title);
//     setNewContent(memo.content);
//     setNewTags(memo.tags.join(", "));
//   }}
// >
//   <EditIcon boxSize={6} />
// </Box>









// {/* 
// <Tooltip label="削除する">
// <IconButton
//   aria-label="Delete Memo"
//   icon={<DeleteIcon boxSize={6} />} // ゴミ箱アイコン
//   colorScheme="gray"
//   bg="gray.500" // 背景をグレーに
//   color="white" // アイコンを白色に
//   borderRadius="full" // 丸型
//   size="md" // サイズを中程度に
//   _hover={{ bg: "gray.600" }} // ホバー時に濃いグレー
//   _focus={{ boxShadow: "outline" }} // フォーカス時にアウトラインを表示
//   zIndex="10" // 他の要素の上に表示
//   onClick={() => deleteMemo(memo.id)} // 削除機能
// />
// </Tooltip> */}






// <Box
//   as="button"
//   aria-label="Delete Memo"
//   display="flex"
//   alignItems="center"
//   justifyContent="center"
//   bg="gray.500"
//   color="white"
//   borderRadius="50%"
//   boxShadow="lg"
//   width="48px"
//   height="48px"
//   _hover={{ bg: "gray.600" }}
//   _focus={{ boxShadow: "outline" }}
//   onClick={() => deleteMemo(memo.id)}
//   cursor="pointer"
// >
//   <DeleteIcon boxSize={6} />
// </Box>





//           </td>
//         </>
//       )}
//     </tr>
//   ))}
// </tbody>

//   </table>
// </div>

//           </div>
//         ))}

//         {/* 入力フォーム */}
//         <Box
//           position="fixed"
//           bottom="0"
//           left={isSidebarOpen ? "10%" : "5%"}
//           width={isSidebarOpen ? "85%" : "92%"}
//           bg="white"
//           p="4"
//           boxShadow="0 -2px 5px rgba(0,0,0,0.1)"
//           zIndex="100"
//         >
//           <HStack gap={4}>
//             <Input
//               placeholder="タイトル"
//               value={newTitle}
//               onChange={(e) => setNewTitle(e.target.value)}
//               flex="1"
//             />
//             <Input
//               placeholder="内容"
//               value={newContent}
//               onChange={(e) => setNewContent(e.target.value)}
//               flex="2"
//             />
//             <Input
//               placeholder="タグ (カンマ区切り)"
//               value={newTags}
//               onChange={(e) => setNewTags(e.target.value)}
//               flex="1"
//             />





//             {/* <Button colorScheme="teal" onClick={addMemo}>
//               追加
//             </Button> */}


// {/* 


// <Tooltip label="入力する">
// <Box
//       position="fixed"
//       bottom="14.5px" // ボタンを画面の下に固定
//       right="7px" // ボタンを画面の右に固定
//       zIndex="100" // ボタンが他の要素の上に表示されるように
//     >
//       <IconButton
//         aria-label="Add Memo" // アクセシビリティ用ラベル
//         _icon={{ as: ArrowUpIcon }} // 上矢印アイコン
//         bg="black" // 背景色を黒に
//         color="white" // アイコンの色を白に
//         borderRadius="full" // ボタンを円形に
//         size="lg" // ボタンサイズを大きめに
//         boxShadow="lg" // ボタンに影を追加
//         _hover={{ bg: "gray.700" }} // ホバー時の背景色
//         onClick={addMemo} // 元々の「追加」機能をそのまま適用
//       />
    
//     </Box>
//     </Tooltip>
//  */}

// <Box
//   as="button"
//   position="fixed"
//   bottom="14.5px"
//   right="7px"
//   zIndex="100"
//   bg="black"
//   color="white"
//   borderRadius="full"
//   boxShadow="lg"
//   _hover={{ bg: "gray.700" }}
//   p={4}
//   onClick={addMemo}
// >
//   <ArrowUpIcon style={{ width: "24px", height: "24px" }} />
// </Box>





//           </HStack>
//         </Box>
//       </VStack>
//     </HStack>
//   );
// }





















































































// 修正後のコード
// 共通部分: APIベースURLを環境変数から取得
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");



import { DeleteIcon, EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";


import { ArrowUpIcon,HamburgerIcon,ArrowBackIcon } from "@chakra-ui/icons"; // 必要に応じてアイコンを変更


import { useEffect, useState} from "react";
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  Textarea,
  HStack,
  Tag,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";
import { sessionState } from "@/libs/states";
import { useRecoilState } from "recoil";
import { LogoutButton } from "@/components/Buttons/LogOutButton";
import { IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useCallback } from "react";




import { Tooltip } from "@chakra-ui/react";


// import { AxiosError } from "axios";

interface Memo { 
  id: number;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  isCompleted?: boolean; // 新しいプロパティを追加（オプショナル）
}



function ensureTagsArray(tags: string | string[] | undefined): string[] {
  if (Array.isArray(tags)) {
    return tags.flatMap((tag) => ensureTagsArray(tag));
  }

  if (!tags) {
    return [];
  }

  return tags
    .split(/[,、，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeTagsForSave(tags: string): string {
  return ensureTagsArray(tags).join(",");
}

export default function MemoApp() {
  const [session, setSession] = useRecoilState(sessionState);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 読み込み状態
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const [isSearchVisible, setIsSearchVisible] = useState(false); // 検索バー表示状態
  const [searchKeyword, setSearchKeyword] = useState(""); // 検索キーワード
  const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]); // 検索結果のメモ
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  


  
  const [editMemoId, setEditMemoId] = useState<number | null>(null);

  const saveEdit = async (id: number) => {
    try {
      // 必須フィールドのチェック
      if (!newTitle.trim() || !newContent.trim() || !newTags.trim()) {
        alert("すべてのフィールドを入力してください！");
        return;
      }
  
      // サーバーが期待するデータ形式に整形
      const dataToSend = {
        title: newTitle.trim(),
        content: newContent.trim(),
        tags: normalizeTagsForSave(newTags),
      };
  
      console.log("送信データ:", dataToSend); // デバッグ用ログ
  
      // サーバーにデータを送信
      const headers = await getAuthHeaders();
      const response = await axios.put(`${API_BASE_URL}/ideas/${id}`, dataToSend, {
        headers,
      });
  
      console.log("サーバーからの応答:", response.data); // 成功時の応答
  
      // 成功時の処理
      await fetchMemos();
      setEditMemoId(null); // 編集モードを解除
      setNewTitle(""); // フォームをリセット
      setNewContent("");
      setNewTags("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("サーバーエラー:", err.response.status, err.response.data);
          alert(`編集に失敗しました: ${JSON.stringify(err.response.data?.detail || "サーバーでエラーが発生しました。")}`);
        } else {
          console.error("通信エラー:", err.message);
          alert("通信エラーが発生しました。サーバーが稼働しているか確認してください。");
        }
      } else if (err instanceof Error) {
        console.error("未知のエラー:", err.message);
        alert("予期しないエラーが発生しました。");
      } else {
        console.error("エラーの詳細:", err);
        alert("不明なエラーが発生しました。");
      }
    }
  };
  
   
  
  


  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error || !sessionData?.session) {
          console.log("セッションなし: / にリダイレクト");
          router.replace("/");
          return;
        }
        console.log("セッション確認成功:", sessionData.session);
        setSession(sessionData.session); // Recoil の状態を更新
      } catch (err) {
        console.error("セッション確認エラー:", err);
        router.replace("/");
      } finally {
        setIsLoading(false); // 必ず呼び出されるように修正
      }
    };
  
    checkSession();
  }, [router, setSession]);
  
  // セッション確認後にのみ fetchMemos を呼び出す
  // useEffect(() => {
  //   if (!isLoading && session) {
  //     fetchMemos();
  //   }
  // }, [isLoading, session]);

  
  
  


  // const fetchMemos = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:8000/ideas");
  //     const sortedMemos = res.data.map((memo: Memo) => ({
  //       ...memo,
  //       tags: ensureTagsArray(memo.tags),
  //       formattedDate: formatDate(memo.created_at),
  //       isCompleted: memo.isCompleted ?? false, // デフォルト値として false を設定
  //     }));
  //     setMemos(sortedMemos);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  
  const formatDate = (dateString: string): string => {
    const utcDate = new Date(dateString); // 入力日付をUTCで扱う
    const jstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // UTCから日本時間に変換

    // 曜日の配列
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

    // 年、月、日、曜日を取得
    const year = jstDate.getFullYear();
    const month = (jstDate.getMonth() + 1).toString().padStart(2, "0"); // 月を2桁でフォーマット
    const day = jstDate.getDate().toString().padStart(2, "0"); // 日を2桁でフォーマット
    const weekDay = dayNames[jstDate.getDay()]; // 曜日を取得

    // フォーマットされた日付を返す
    return `${year}-${month}-${day}(${weekDay})`;
};



const getAuthHeaders = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    router.replace("/");
    throw new Error("ログイン情報が取得できませんでした。");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
};

  const fetchMemos = useCallback(async () => {
    try {
      console.log("fetchMemos called");

      const headers = await getAuthHeaders();
      const res = await axios.get(`${API_BASE_URL}/ideas`, { headers });

      console.log("GET /ideas response:", res.data);

      const sortedMemos = res.data.map((memo: Memo) => ({
        ...memo,
        tags: ensureTagsArray(memo.tags),
        formattedDate: formatDate(memo.created_at),
        isCompleted: memo.isCompleted ?? false,
      }));

      console.log("normalized memos:", sortedMemos);

      setMemos(sortedMemos);
    } catch (err) {
      console.error("fetchMemos error:", err);
      alert("メモ一覧の取得に失敗しました。Consoleを確認してください。");
    }
  }, []);


  useEffect(() => {
    if (!isLoading && session) {
      fetchMemos();
    }
  }, [isLoading, session, fetchMemos]);
  

  

  const toggleComplete = (id: number) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id
          ? { ...memo, isCompleted: !memo.isCompleted }
          : memo
      )
    );
  };
  
  
  // 読み込み中の状態
  if (isLoading) {
    return null;
  }
  





  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      alert("検索キーワードを入力してください！");
      return;
    }
  
    try {
      setSelectedTag(null);
      const headers = await getAuthHeaders();

      const response = await axios.get(`${API_BASE_URL}/ideas/search`, {
        params: { keyword: searchKeyword.trim() },
        headers,
      });

      const normalizedMemos = response.data.map((memo: Memo) => ({
        ...memo,
        tags: ensureTagsArray(memo.tags),
        isCompleted: memo.isCompleted ?? false,
      }));

      setFilteredMemos(normalizedMemos);
    } catch (err) {
      console.error("検索エラー:", err);
      alert("検索に失敗しました。");
    }
  };

  const handleTagFilter = (tag: string) => {
  const normalizedTag = tag.trim();

  if (!normalizedTag) {
    return;
  }

  setSelectedTag(normalizedTag);
  setSearchKeyword("");

  const tagFilteredMemos = memos.filter((memo) =>
    ensureTagsArray(memo.tags).includes(normalizedTag)
  );

  setFilteredMemos(tagFilteredMemos);
};

const clearTagFilter = () => {
  setSelectedTag(null);
  setFilteredMemos([]);
  setSearchKeyword("");
};







const addMemo = async () => {
    if (!newTitle || !newContent) {
      alert("タイトルと内容を入力してください！");
      return;
    }
    try {
      const headers = await getAuthHeaders();

      await axios.post(
        `${API_BASE_URL}/ideas`,
        {
          title: newTitle,
          content: newContent,
          tags: normalizeTagsForSave(newTags),
        },
        { headers }
      );
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      fetchMemos();
    } catch (err) {
      console.error(err);
      alert("メモの追加に失敗しました。");
    }
  };

  const deleteMemo = async (id: number) => {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_BASE_URL}/ideas/${id}`, { headers });
      fetchMemos();
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました。");
    }
  };





  


//    const formatDate = (dateString: string): string => {
//     const utcDate = new Date(dateString); // 入力日付をUTCで扱う
//     const jstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // UTCから日本時間に変換

//     // 曜日の配列
//     const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

//     // 年、月、日、曜日を取得
//     const year = jstDate.getFullYear();
//     const month = (jstDate.getMonth() + 1).toString().padStart(2, "0"); // 月を2桁でフォーマット
//     const day = jstDate.getDate().toString().padStart(2, "0"); // 日を2桁でフォーマット
//     const weekDay = dayNames[jstDate.getDay()]; // 曜日を取得

//     // フォーマットされた日付を返す
//     return `${year}-${month}-${day}(${weekDay})`;
// };





























  // const groupedMemos = memos.reduce((acc: Record<string, Memo[]>, memo) => {
  //   const date = memo.created_at.split("T")[0];
  //   if (!acc[date]) acc[date] = [];
  //   acc[date].push(memo);
  //   return acc;
  // }, {});

  // const groupedMemos = (filteredMemos.length > 0 ? filteredMemos : memos).reduce(
  //   (acc: Record<string, Memo[]>, memo) => {
  //     const date = memo.created_at.split("T")[0];
  //     if (!acc[date]) acc[date] = [];
  //     acc[date].push(memo);
  //     return acc;
  //   },
  //   {}
  // );



  // const groupedMemos = (filteredMemos.length > 0 ? filteredMemos : memos).reduce(
  //   (acc: Record<string, Memo[]>, memo) => {
  //     try {
  //       // 日付フォーマットの安全性を確認
  //       const date = memo.created_at.split("T")[0];
  //       if (!acc[date]) acc[date] = [];
  //       acc[date].push(memo);
  //     } catch (err) {
  //       console.error("日付のフォーマットエラー:", memo.created_at, err);
  //     }
  //     return acc;
  //   },
  //   {}
  // );
  
  


const isFiltering = selectedTag !== null || searchKeyword.trim() !== "";
const displayMemos = isFiltering ? filteredMemos : memos;

const groupedMemos = displayMemos.reduce(
  (acc: Record<string, Memo[]>, memo) => {
    const date = memo.created_at.split(" ")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(memo);
    return acc;
  },
  {}
);






  

  




















  return (
    <HStack align="start" spacing={0}>
      {/* サイドバー */}














      <Box
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        w={isSidebarOpen ? "10%" : "5%"}
        bg="gray.100"
        shadow="lg"
        transition="width 0.3s ease-in-out"
        zIndex="1000"
      >
        {isSidebarOpen ? (
          <Box p="4">
            <HStack justifyContent="space-between">
  <Text fontWeight="bold" mb="4">
    作業日時目次
  </Text>
  <Tooltip label="検索する">
  <IconButton
    aria-label="検索"
    icon={<SearchIcon />}
    size="sm"
    onClick={() => setIsSearchVisible(!isSearchVisible)}
  />
  </Tooltip>
</HStack>

{isSearchVisible && (
  <Box mb="4">
    <HStack>
      <Input
        placeholder="キーワードを入力"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (searchKeyword.trim() === "") {
              // キーワードが空の場合は元の画面に戻る
              setFilteredMemos([]); // 検索結果をリセット
            } else {
              handleSearch(); // 検索を実行
            }
          }
        }}
        size="sm"
      />





      {/* <Button size="sm" colorScheme="teal" onClick={handleSearch}>
        検索
      </Button> */}

<Tooltip label="空にしてEnterを押せば元に戻ります。">
<IconButton
  aria-label="検索" // アクセシビリティ対応
  icon={<SearchIcon />} // Chakra UI の虫眼鏡アイコン
  size="sm"
  bg="brown" // 背景をブラウンに変更
  color="white" // アイコンの色を白に
  border="2px solid brown" // 枠線をブラウンに
  borderRadius="md" // ボタンの角を丸くする
  _hover={{ bg: "darkred" }} // ホバー時に背景色を濃い赤色に
  onClick={handleSearch} // 検索機能はそのまま
/>
</Tooltip>






    </HStack>
  </Box>
)}


<VStack align="start" spacing={2}>
  {Object.keys(groupedMemos)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((date) => (
      <Box
        key={date}
        onClick={() => {
          const section = document.getElementById(`section-${date}`);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }}
        fontSize="sm" // 適度な文字サイズ
        fontWeight="bold" // 文字を太く
        color="black" // 黒色
        cursor="pointer" // ポインタとして設定
        _hover={{
          opacity: 0.7, // カーソルを合わせた時に透明感を追加
        }}
      >
        {formatDate(date)}
      </Box>
    ))}
</VStack>












{/*
            <IconButton
        aria-label="閉じる目次"
        icon={<ArrowBackIcon  />} // 閉じるアイコン
        colorScheme="red"
        bg="red.500" // 背景を赤色に
        color="white"
        size="md"
        borderRadius="full"
        transform="translateX(100%)" // アイコンの中央位置調整
        bottom="100%" // ここで位置を調整（値を増やすと下がる）
        _hover={{ bg: "red.600" }}
        onClick={() => setIsSidebarOpen(false)} // サイドバーを閉じる
      /> */}

<Tooltip label="目次を閉じる">
      <IconButton
  aria-label="閉じる目次"
  icon={<ArrowBackIcon />} // 閉じるアイコン
  colorScheme="red"
  bg="red.500" // 背景を赤色に
  color="white"
  size="md"
  borderRadius="full"
  position="absolute" // 位置を絶対値指定
  left="50%" // 横位置を中央に
  transform="translateX(-50%)" // 中央揃え調整
  bottom="10%" // 下に下げる値（%やpxで調整可能）
  _hover={{ bg: "red.600" }}
  onClick={() => setIsSidebarOpen(false)} // サイドバーを閉じる
/>

</Tooltip>






    </Box>
  ) : (



    <Tooltip label="目次を開く">
  <IconButton
    position="absolute"
    top="1rem"
    left="1rem"
    aria-label="目次を開く"
    icon={<HamburgerIcon />}
    colorScheme="blue"
    bg="blue.500"
    color="white"
    size="md"
    borderRadius="full"
    _hover={{ bg: "blue.600" }}
    onClick={() => setIsSidebarOpen(true)}
  />
</Tooltip>





  )}
</Box>









      {/* メモ一覧 */}

        {/* ログアウトボタン */}

      <VStack
        spacing={4}
        align="stretch"
        ml={{ base: "56px", md: isSidebarOpen ? "10%" : "5%" }}
        w={{ base: "calc(100% - 56px)", md: isSidebarOpen ? "90%" : "95%" }}
        h="calc(100vh - 60px)"
        overflowY="auto"
        pb={{ base: "360px", md: "260px" }}
      >


        <Box
          position="sticky"
          top="0"
          zIndex="20"
          bg="white"
          py={2}
        >
          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "stretch", md: "center" }}
            gap={3}
          >
            <Box flex="1" minW="0">
              {selectedTag && (
                <HStack
                  p={3}
                  bg="blue.50"
                  borderRadius="md"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Text fontSize="sm" fontWeight="bold" wordBreak="break-word">
                    タグ「{selectedTag}」で絞り込み中
                  </Text>

                  <Button size="sm" onClick={clearTagFilter}>
                    絞り込み解除
                  </Button>
                </HStack>
              )}
            </Box>

            <Box alignSelf={{ base: "flex-end", md: "center" }}>
              <LogoutButton />
            </Box>
          </Box>
        </Box>











 








{displayMemos.length === 0 && (
  <Box p={4} bg="gray.50" borderRadius="md">
    <Text color="gray.500">
      該当するメモがありません。
    </Text>
  </Box>
)}

{Object.entries(groupedMemos).map(([date, memos]) => (
  <Box key={date} id={`section-${date}`} p="4" borderWidth="1px" borderRadius="md" bg="white" shadow="sm">
    {/* 日付ヘッダー */}
    <Text fontWeight="bold" fontSize="lg" mb="2">
      {formatDate(date)}
    </Text>
    {memos.map((memo) => (
  <Box
    key={memo.id}
    p="3"
    borderWidth="1px"
    borderRadius="md"
    bg="white"
    shadow="sm"
  >
    {/* PC用：テーブル表示 */}
    <Box display={{ base: "none", md: "block" }}>
      <TableContainer overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th w="20%">タイトル</Th>
              <Th w="50%">内容</Th>
              <Th w="20%">タグ</Th>
              <Th w="10%">操作</Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              {editMemoId === memo.id ? (
                <>
                  <Td>
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="タイトルを入力"
                    />
                  </Td>

                  <Td>
                    <Textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="内容を入力"
                      minH="120px"
                      resize="vertical"
                    />
                  </Td>

                  <Td>
                    <Input
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="タグ（, / 、区切り）"
                    />
                  </Td>

                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="保存">
                        <IconButton
                          aria-label="Save Memo"
                          icon={<CheckIcon />}
                          colorScheme="green"
                          bg="green.500"
                          color="white"
                          borderRadius="full"
                          size="md"
                          _hover={{ bg: "green.600" }}
                          onClick={() => saveEdit(memo.id)}
                        />
                      </Tooltip>

                      <Tooltip label="キャンセル">
                        <IconButton
                          aria-label="Cancel Edit"
                          icon={<CloseIcon />}
                          colorScheme="red"
                          bg="red.500"
                          color="white"
                          borderRadius="full"
                          size="md"
                          _hover={{ bg: "red.600" }}
                          onClick={() => {
                            setEditMemoId(null);
                            setNewTitle("");
                            setNewContent("");
                            setNewTags("");
                          }}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </>
              ) : (
                <>
                  <Td
                    whiteSpace="pre-wrap"
                    overflowWrap="anywhere"
                    wordBreak="break-word"
                    textDecoration={memo.isCompleted ? "line-through" : "none"}
                    onClick={() => toggleComplete(memo.id)}
                    cursor="pointer"
                  >
                    {memo.title}
                  </Td>

                  <Td
                    whiteSpace="pre-wrap"
                    overflowWrap="anywhere"
                    wordBreak="break-word"
                    textDecoration={memo.isCompleted ? "line-through" : "none"}
                    onClick={() => toggleComplete(memo.id)}
                    cursor="pointer"
                  >
                    {memo.content}
                  </Td>

                  <Td>
                    <HStack spacing={2} flexWrap="wrap">
                      {memo.tags.map((tag, index) => (
                        <Tag
                          key={index}
                          mr={1}
                          mb={1}
                          cursor="pointer"
                          maxW="180px"
                          whiteSpace="normal"
                          overflowWrap="anywhere"
                          wordBreak="break-word"
                          h="auto"
                          px={2}
                          py={1}
                          fontSize="sm"
                          colorScheme={selectedTag === tag ? "blue" : "gray"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagFilter(tag);
                          }}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </HStack>
                  </Td>

                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="編集">
                        <IconButton
                          aria-label="Edit Memo"
                          icon={<EditIcon />}
                          colorScheme="blue"
                          bg="blue.500"
                          color="white"
                          borderRadius="full"
                          size="md"
                          _hover={{ bg: "blue.600" }}
                          onClick={() => {
                            setEditMemoId(memo.id);
                            setNewTitle(memo.title);
                            setNewContent(memo.content);
                            setNewTags(memo.tags.join(", "));
                          }}
                        />
                      </Tooltip>

                      <Tooltip label="削除">
                        <IconButton
                          aria-label="Delete Memo"
                          icon={<DeleteIcon />}
                          colorScheme="gray"
                          bg="gray.500"
                          color="white"
                          borderRadius="full"
                          size="md"
                          _hover={{ bg: "gray.600" }}
                          onClick={() => deleteMemo(memo.id)}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </>
              )}
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>

    {/* スマホ用：カード表示 */}
    <Box display={{ base: "block", md: "none" }}>
      {editMemoId === memo.id ? (
        <VStack align="stretch" spacing={3}>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="タイトルを入力"
          />

          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="内容を入力"
            minH="120px"
            resize="vertical"
          />

          <Input
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            placeholder="タグ（, / 、区切り）"
          />

          <HStack justifyContent="flex-end" spacing={3}>
            <Tooltip label="保存">
              <IconButton
                aria-label="Save Memo"
                icon={<CheckIcon />}
                colorScheme="green"
                bg="green.500"
                color="white"
                borderRadius="full"
                size="md"
                _hover={{ bg: "green.600" }}
                onClick={() => saveEdit(memo.id)}
              />
            </Tooltip>

            <Tooltip label="キャンセル">
              <IconButton
                aria-label="Cancel Edit"
                icon={<CloseIcon />}
                colorScheme="red"
                bg="red.500"
                color="white"
                borderRadius="full"
                size="md"
                _hover={{ bg: "red.600" }}
                onClick={() => {
                  setEditMemoId(null);
                  setNewTitle("");
                  setNewContent("");
                  setNewTags("");
                }}
              />
            </Tooltip>
          </HStack>
        </VStack>
      ) : (
        <VStack align="stretch" spacing={3}>
          <Box>
            <Text fontSize="xs" color="gray.500" fontWeight="bold">
              タイトル
            </Text>
            <Text
              whiteSpace="pre-wrap"
              overflowWrap="anywhere"
              wordBreak="break-word"
              textDecoration={memo.isCompleted ? "line-through" : "none"}
              onClick={() => toggleComplete(memo.id)}
              cursor="pointer"
            >
              {memo.title}
            </Text>
          </Box>

          <Box>
            <Text fontSize="xs" color="gray.500" fontWeight="bold">
              内容
            </Text>
            <Text
              whiteSpace="pre-wrap"
              overflowWrap="anywhere"
              wordBreak="break-word"
              textDecoration={memo.isCompleted ? "line-through" : "none"}
              onClick={() => toggleComplete(memo.id)}
              cursor="pointer"
            >
              {memo.content}
            </Text>
          </Box>

          <Box>
            <Text fontSize="xs" color="gray.500" fontWeight="bold">
              タグ
            </Text>

            <HStack spacing={2} flexWrap="wrap">
              {memo.tags.map((tag, index) => (
                <Tag
                  key={index}
                  cursor="pointer"
                  whiteSpace="normal"
                  overflowWrap="anywhere"
                  wordBreak="break-word"
                  h="auto"
                  px={2}
                  py={1}
                  colorScheme={selectedTag === tag ? "blue" : "gray"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagFilter(tag);
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </HStack>
          </Box>

          <HStack justifyContent="flex-end" spacing={3}>
            <Tooltip label="編集">
              <IconButton
                aria-label="Edit Memo"
                icon={<EditIcon />}
                colorScheme="blue"
                bg="blue.500"
                color="white"
                borderRadius="full"
                size="md"
                _hover={{ bg: "blue.600" }}
                onClick={() => {
                  setEditMemoId(memo.id);
                  setNewTitle(memo.title);
                  setNewContent(memo.content);
                  setNewTags(memo.tags.join(", "));
                }}
              />
            </Tooltip>

            <Tooltip label="削除">
              <IconButton
                aria-label="Delete Memo"
                icon={<DeleteIcon />}
                colorScheme="gray"
                bg="gray.500"
                color="white"
                borderRadius="full"
                size="md"
                _hover={{ bg: "gray.600" }}
                onClick={() => deleteMemo(memo.id)}
              />
            </Tooltip>
          </HStack>
        </VStack>
      )}
    </Box>
  </Box>
))}
  </Box>
))}





       
      <Box
  position="fixed"
  bottom="0"
  left={{ base: "56px", md: isSidebarOpen ? "10%" : "5%" }}
  right="0"
  bg="white"
  p={{ base: 3, md: 4 }}
  boxShadow="0 -2px 5px rgba(0,0,0,0.1)"
  zIndex="100"
>
  <VStack spacing={3} align="stretch">
    <Input
      placeholder="タイトル"
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
    />

    <Textarea
      placeholder="内容"
      value={newContent}
      onChange={(e) => setNewContent(e.target.value)}
      minH={{ base: "96px", md: "140px" }}
      maxH={{ base: "180px", md: "260px" }}
      resize="vertical"
    />

    <HStack spacing={3} align="stretch">
      <Input
        placeholder="タグ（, / 、区切り）"
        value={newTags}
        onChange={(e) => setNewTags(e.target.value)}
        flex="1"
      />

      <Tooltip label="入力する">
        <IconButton
          aria-label="Add Memo"
          icon={<ArrowUpIcon />}
          bg="black"
          color="white"
          borderRadius="full"
          size="lg"
          boxShadow="lg"
          _hover={{ bg: "gray.700" }}
          onClick={addMemo}
        />
      </Tooltip>
    </HStack>
  </VStack>
</Box>
</VStack>
</HStack>
);
}
