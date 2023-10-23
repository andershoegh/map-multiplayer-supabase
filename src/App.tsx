import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";

const ROOM_NAME = "roomOne";
const ROOM_EVENT = "messagePass";

function App() {
  const [sharedText, setSharedText] = useState("");

  useEffect(() => {
    const textChannel = supabase.channel(ROOM_NAME);

    textChannel.on("broadcast", { event: ROOM_EVENT }, ({ payload }) => {
      console.log(payload.message);
      setSharedText(payload.message);
    });

    textChannel.subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        console.log({ status });
        return null;
      }

      textChannel.send({
        event: ROOM_EVENT,
        type: "broadcast",
        payload: {
          message: sharedText,
        },
      });
    });
  }, [sharedText]);

  return (
    <>
      <div>Testing input: {sharedText}</div>

      <input
        value={sharedText}
        onChange={(e) => setSharedText(e.target.value)}
      />
    </>
  );
}

export default App;
