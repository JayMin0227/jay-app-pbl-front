






// import { useEffect, useState } from "react";
// import { Box, Button, Text } from "@chakra-ui/react";
// import { useRouter } from "next/router";
// import supabase from "@/libs/supabase";

// export default function MemoPage() {
//   const router = useRouter();
//   const message = "今日は何を書きますか？";
//   const [displayedText, setDisplayedText] = useState(""); // 表示中の文字
//   const [currentIndex, setCurrentIndex] = useState(0); // 現在の文字位置

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (currentIndex < message.length) {
//         setDisplayedText((prev) => prev + message[currentIndex]);
//         setCurrentIndex((prev) => prev + 1);
//       } else {
//         clearInterval(interval); // 全ての文字が表示されたら停止
//       }
//     }, 100); // 100msごとに次の文字を追加

//     return () => clearInterval(interval); // コンポーネントがアンマウントされたらクリーンアップ
//   }, [currentIndex]);

//   const handleLogin = async () => {
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "github",
//       });
//       if (error) throw error;
//       console.log("GitHub 認証開始");
//     } catch (err) {
//       console.error("ログインエラー:", err);
//       alert("ログインに失敗しました。もう一度お試しください。");
//     }
//   };

//   useEffect(() => {
//     const { data } = supabase.auth.onAuthStateChange((event, session) => {
//       if (session) {
//         console.log("セッション変更検出: /loading に遷移");
//         router.replace("/loading");
//       }
//     });

//     return () => {
//       if (data?.subscription) {
//         data.subscription.unsubscribe(); // リスナー解除
//       }
//     };
//   }, [router]);

//   return (
//     <Box
//       bg="linear-gradient(to bottom, #fffef8, #f4f0e9)" // 紙の質感を表現
//       minH="100vh"
//       display="flex"
//       flexDirection="column" // 縦方向に配置
//       justifyContent="center"
//       alignItems="center"
//       textAlign="center"
//     >
//       {/* テキスト */}
//       <Text
//         mb={6}
//         fontFamily="'Permanent Marker', cursive"
//         fontSize="2xl"
//         color="#555"
//         fontWeight="bold"
//       >
//         {displayedText}
//         <Box as="span" color="#000" ml="2" fontSize="50px">
//           {currentIndex < message.length ? "●" : ""}
//         </Box>
//       </Text>

//       {/* ボタン */}
//       <Button
//         bg="#ffec99"
//         color="#444"
//         fontWeight="bold"
//         _hover={{ bg: "#ffe066" }}
//         boxShadow="md"
//         fontSize="lg"
//         px={8}
//         py={4}
//         onClick={handleLogin}
//       >
//         書き始める
//       </Button>
//     </Box>
//   );
// }






import { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";

export default function MemoPage() {
  const router = useRouter();
  const message = "今日は何を書きますか？";
  const [displayedText, setDisplayedText] = useState(""); // 表示中の文字
  const [currentIndex, setCurrentIndex] = useState(0); // 現在の文字位置

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText((prev) => prev + message[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        clearInterval(interval); // 全ての文字が表示されたら停止
      }
    }, 100); // 100msごとに次の文字を追加

    return () => clearInterval(interval); // コンポーネントがアンマウントされたらクリーンアップ
  }, [currentIndex]);

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/book`,
        },
      });

      if (error) throw error;
      console.log("GitHub 認証開始");
    } catch (err) {
      console.error("ログインエラー:", err);
      alert("ログインに失敗しました。もう一度お試しください。");
    }
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log("セッション変更検出: /book に遷移");
        router.replace("/book");
      }
    });

    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, [router]);

  return (
    <Box
      bg="linear-gradient(to bottom, #fffef8, #f4f0e9)" // 紙の質感を表現
      minH="100vh"
      display="flex"
      flexDirection="column" // 縦方向に配置
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      {/* テキスト */}
      <Text
        mb={6}
        fontFamily="'Permanent Marker', cursive"
        fontSize="2xl"
        color="#555"
        fontWeight="bold"
      >
        {displayedText}
        <Box as="span" color="#000" ml="2" fontSize="50px">
          {currentIndex < message.length ? "●" : ""}
        </Box>
      </Text>

      {/* ボタン */}
      <Button
        bg="#ffec99"
        color="#444"
        fontWeight="bold"
        _hover={{ bg: "#ffe066" }}
        boxShadow="md"
        fontSize="lg"
        px={8}
        py={4}
        onClick={handleLogin}
      >
        書き始める
      </Button>
    </Box>
  );
}
