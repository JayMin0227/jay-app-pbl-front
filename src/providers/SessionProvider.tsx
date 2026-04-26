
// import { Session } from "@supabase/supabase-js";
// import { useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import { useRouter } from "next/router";
// import supabase from "@/libs/supabase";
// import { sessionState } from "@/libs/states";

// type SessionProviderProps = {
//   children: React.ReactNode;
// };

// export const SessionProvider = ({ children }: SessionProviderProps) => {
//   const router = useRouter();
//   const pathname = router.pathname;
//   const [session, setSession] = useRecoilState<Session | null>(sessionState);
//   const [isSessionChecked, setIsSessionChecked] = useState(false);

//   useEffect(() => {
//     // セッションを取得する関数
//     const fetchSession = async () => {
//       try {
//         const { data, error } = await supabase.auth.getSession();
//         if (error) console.error("セッション取得エラー:", error);
//         setSession(data?.session ?? null);
//       } catch (err) {
//         console.error("セッション確認中にエラー:", err);
//       } finally {
//         setIsSessionChecked(true); // セッション確認完了
//       }
//     };

//     fetchSession();

//     // セッション変更リスナー
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => {
//       subscription.unsubscribe(); // クリーンアップ
//     };
//   }, [setSession]);

//   useEffect(() => {
//     if (!isSessionChecked) return; // セッション確認が完了していない場合は何もしない

//     // セッションの有無に応じてリダイレクト
//     if (!session && pathname !== "/") {
//       router.replace("/");
//     } else if (session && pathname === "/") {
//       router.replace("/loading");
//     }
//   }, [isSessionChecked, session, pathname, router]);

//   return <>{children}</>;
// };




import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";
import { sessionState } from "@/libs/states";

type SessionProviderProps = {
  children: React.ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const router = useRouter();
  const pathname = router.pathname;
  const [session, setSession] = useRecoilState<Session | null>(sessionState);
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    // セッションを取得する関数
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("セッション取得エラー:", error);
        setSession(data?.session ?? null);
      } catch (err) {
        console.error("セッション確認中にエラー:", err);
      } finally {
        setIsSessionChecked(true); // セッション確認完了
      }
    };

    fetchSession();

    // セッション変更リスナー
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe(); // クリーンアップ
    };
  }, [setSession]);

  useEffect(() => {
    if (!isSessionChecked) return; // セッション確認が完了していない場合は何もしない

    // セッションの有無に応じてリダイレクト
    if (!session && pathname !== "/") {
      router.replace("/");
    } else if (session && pathname === "/") {
      router.replace("/book");
    }
  }, [isSessionChecked, session, pathname, router]);

  return <>{children}</>;
};
