// import { Button } from "@chakra-ui/react";
// import { useRouter } from "next/router";
// import supabase from "@/libs/supabase";

// export function LogoutButton() {
//   const router = useRouter();
//   return (
//     <Button
//       onClick={() => {
//         supabase.auth.signOut();
//         router.push("/");
//       }}
//     >
//       ログアウト
//     </Button>
//   );
// }


import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        try {
          await supabase.auth.signOut();
          router.replace("/");
        } catch (err) {
          console.error("ログアウトエラー:", err);
          router.replace("/");
        }
      }}
    >
      ログアウト
    </Button>
  );
}

