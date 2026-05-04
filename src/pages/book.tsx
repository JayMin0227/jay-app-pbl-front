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
  Spinner,
  Heading,
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();



  // 他の state が続く
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false); // 検索バー表示状態
  const [searchKeyword, setSearchKeyword] = useState(""); // 検索キーワード
  const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]); // 検索結果のメモ
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  


  
  const [editMemoId, setEditMemoId] = useState<number | null>(null);

  const saveEdit = async (id: number) => {
    try {
      setErrorMessage("");

      // 必須フィールドのチェック
      if (!editTitle.trim() || !editContent.trim()) {
        setErrorMessage("タイトルと内容を入力してください。");
        return;
      }
      // サーバーが期待するデータ形式に整形
      const dataToSend = {
        title: editTitle.trim(),
        content: editContent.trim(),
        tags: normalizeTagsForSave(editTags),
      };
  
      console.log("送信データ:", dataToSend); // デバッグ用ログ
  
      // サーバーにデータを送信
      const headers = await getAuthHeaders();

      if (!headers) {
        router.replace("/");
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/ideas/${id}`, dataToSend, {
        headers,
      });
  
      console.log("サーバーからの応答:", response.data); // 成功時の応答
  
      // 成功時の処理
// 成功時の処理
// 成功時の処理
      await refreshMemosKeepingFilter();
      setEditMemoId(null);
      setEditTitle("");
      setEditContent("");
      setEditTags("");
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.replace("/");
          return;
        }

        console.error("編集エラー:", err);
        setErrorMessage("メモの編集に失敗しました。時間をおいてもう一度お試しください。");
      }
  };
  
   
  
  


  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();

        if (error || !sessionData?.session) {
          router.replace("/");
          return;
        }

        if (isMounted) {
          setSession(sessionData.session);
        }
      } catch (err) {
        console.error("セッション確認エラー:", err);
        router.replace("/");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
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




const getAuthHeaders = useCallback(async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("セッション取得エラー:", error);
    return null;
  }

  if (!session?.access_token) {
    return null;
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}, []);

  const fetchMemos = useCallback(async () => {
    try {
      setErrorMessage("");
      console.log("fetchMemos called");

      const headers = await getAuthHeaders();

      // ここが重要：
      // ログイン直後などで Authorization がまだ取れないなら、
      // /ideas を叩かずに処理を止める。
      if (!headers) {
        console.log("認証情報がまだないため、メモ一覧取得をスキップします。");
        router.replace("/");
        return null;
      }

      const res = await axios.get(`${API_BASE_URL}/ideas`, {
        headers,
      });

      console.log("GET /ideas response:", res.data);

      const sortedMemos = res.data.map((memo: Memo) => ({
        ...memo,
        tags: ensureTagsArray(memo.tags),
        formattedDate: formatDate(memo.created_at),
        isCompleted: memo.isCompleted ?? false,
      }));

      console.log("normalized memos:", sortedMemos);

      setMemos(sortedMemos);
      return sortedMemos;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        console.warn("認証切れのためトップページに戻します。", err.response.data);
        router.replace("/");
        return null;
      }

      console.error("fetchMemos error:", err);
      setErrorMessage(
        "メモ一覧を読み込めませんでした。時間をおいて再読み込みしてください。"
      );
      return null;
    }
  }, [getAuthHeaders, router]);



  const refreshMemosKeepingFilter = async () => {
  const latestMemos = await fetchMemos();

  if (!latestMemos) {
    return;
  }

  if (selectedTag) {
    const tagFilteredMemos = latestMemos.filter((memo: Memo) =>
      ensureTagsArray(memo.tags).includes(selectedTag)
    );

    setFilteredMemos(tagFilteredMemos);
    return;
  }

  const keyword = searchKeyword.trim().toLowerCase();

  if (keyword) {
    const searchedMemos = latestMemos.filter((memo: Memo) => {
      const tags = ensureTagsArray(memo.tags);

      return (
        memo.title.toLowerCase().includes(keyword) ||
        memo.content.toLowerCase().includes(keyword) ||
        tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    });

    setFilteredMemos(searchedMemos);
    return;
  }

  setFilteredMemos([]);
};


  useEffect(() => {
    if (!isLoading && session?.access_token) {
      fetchMemos();
    }
  }, [isLoading, session?.access_token, fetchMemos]);
  

  

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
    return (
      <VStack height="100vh" justify="center" spacing={4}>
        <Spinner size="xl" />
        <Heading size="md">読み込み中...</Heading>
      </VStack>
    );
  }
  





const handleSearch = async () => {
  if (!searchKeyword.trim()) {
    setFilteredMemos([]);
    setSelectedTag(null);
    setErrorMessage("");
    return;
  }

  try {
    setErrorMessage("");
    setSelectedTag(null);
    const headers = await getAuthHeaders();

      if (!headers) {
        router.replace("/");
        return;
      }

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
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.replace("/");
          return;
        }

        console.error("検索エラー:", err);
        setErrorMessage("検索に失敗しました。時間をおいてもう一度お試しください。");
      }
  };

  const handleTagFilter = (tag: string) => {
    const normalizedTag = tag.trim();

    if (!normalizedTag) {
      return;
    }

    setErrorMessage("");
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
  setErrorMessage("");
};







const addMemo = async () => {
  if (!newTitle.trim() || !newContent.trim()) {
    setErrorMessage("タイトルと内容を入力してください。");
    return;
  }

  try {
    setErrorMessage("");
    const headers = await getAuthHeaders();

      if (!headers) {
        router.replace("/");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/ideas`,
        {
          title: newTitle.trim(),
          content: newContent.trim(),
          tags: normalizeTagsForSave(newTags),
        },
        { headers }
      );
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      await refreshMemosKeepingFilter();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.replace("/");
          return;
        }

        console.error("メモ追加エラー:", err);
        setErrorMessage("メモの追加に失敗しました。時間をおいてもう一度お試しください。");
      }
  };

  const deleteMemo = async (id: number) => {
    try {
      setErrorMessage("");
      const headers = await getAuthHeaders();

      if (!headers) {
        router.replace("/");
        return;
      }

      await axios.delete(`${API_BASE_URL}/ideas/${id}`, { headers });
      await refreshMemosKeepingFilter();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.replace("/");
        return;
      }

      console.error("削除エラー:", err);
      setErrorMessage("メモの削除に失敗しました。時間をおいてもう一度お試しください。");
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






  

const sidebarWidth = isSidebarOpen
  ? { base: "260px", md: "240px" }
  : { base: "56px", md: "64px" };

const contentWidth = isSidebarOpen
  ? { base: "calc(100% - 260px)", md: "calc(100% - 240px)" }
  : { base: "calc(100% - 56px)", md: "calc(100% - 64px)" };




















  return (
    <HStack align="start" spacing={0}>
      {/* サイドバー */}














      <Box
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        w={sidebarWidth}
        bg="gray.100"
        shadow="lg"
        transition="width 0.3s ease-in-out"
        zIndex="1000"
      >
        {isSidebarOpen ? (
          <Box p="4">
            
  <HStack justifyContent="space-between" alignItems="center" mb="4" spacing={2}>
    <Text
      fontWeight="bold"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      mb="0"
      flex="1"
      minW="0"
    >
      作業日時目次
    </Text>

    <Tooltip label="検索する">
      <IconButton
        aria-label="検索"
        icon={<SearchIcon />}
        size="sm"
        flexShrink={0}
        onClick={() => setIsSearchVisible(!isSearchVisible)}
      />
    </Tooltip>
  </HStack>

{isSearchVisible && (
  <Box mb="4" w="100%">
    <HStack align="stretch" spacing={2} w="100%">
      <Input
        placeholder="キーワードを入力"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        size="sm"
        flex="1"
        minW="0"
      />





      {/* <Button size="sm" colorScheme="teal" onClick={handleSearch}>
        検索
      </Button> */}

<Tooltip label="空にすれば元に戻ります。">
  <IconButton
    aria-label="検索"
    icon={<SearchIcon />}
    size="sm"
    bg="brown"
    color="white"
    border="2px solid brown"
    borderRadius="md"
    flexShrink={0}
    _hover={{ bg: "darkred" }}
    onClick={handleSearch}
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
        fontSize="sm"
        fontWeight="bold"
        color="black"
        cursor="pointer"
        w="100%"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        _hover={{
          opacity: 0.7,
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
        ml={sidebarWidth}
        w={contentWidth}
        h="calc(100vh - 60px)"
        overflowY="auto"
        pb={{ base: "360px", md: "260px" }}
        minW="0"
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
                  alignItems={{ base: "stretch", md: "center" }}
                  flexDirection={{ base: "column", md: "row" }}
                  gap={2}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    wordBreak="break-word"
                    minW="0"
                  >
                    タグ「{selectedTag}」で絞り込み中
                  </Text>

                  <Button
                    size="sm"
                    onClick={clearTagFilter}
                    alignSelf={{ base: "flex-start", md: "center" }}
                    flexShrink={0}
                  >
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











 








{errorMessage && (
  <Box
    p={4}
    bg="red.50"
    color="red.700"
    borderRadius="md"
    borderWidth="1px"
    borderColor="red.200"
  >
    <Text>{errorMessage}</Text>
  </Box>
)}

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
    <Text
      fontWeight="bold"
      fontSize="lg"
      mb="2"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
    >
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
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="タイトルを入力"
                    />
                  </Td>

                  <Td>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="内容を入力"
                      minH="120px"
                      resize="vertical"
                    />
                  </Td>

                  <Td>
                    <Input
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
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
                            setEditTitle("");
                            setEditContent("");
                            setEditTags("");
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
                            setEditTitle(memo.title);
                            setEditContent(memo.content);
                            setEditTags(memo.tags.join(", "));
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
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="タイトルを入力"
          />
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="内容を入力"
            minH="120px"
            resize="vertical"
          />

          <Input
            value={editTags}
            onChange={(e) => setEditTags(e.target.value)}
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
                  setEditTitle("");
                  setEditContent("");
                  setEditTags("");
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
                  setEditTitle(memo.title);
                  setEditContent(memo.content);
                  setEditTags(memo.tags.join(", "));
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
  left={sidebarWidth}
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
