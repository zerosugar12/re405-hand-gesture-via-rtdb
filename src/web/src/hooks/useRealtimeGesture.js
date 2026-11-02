import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebase.js";
import { DB_PATHS } from "../utils/constants.js";

export default function useRealtimeGesture() {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const currentRef = ref(database, DB_PATHS.CURRENT);

    const unsubCurrent = onValue(
      currentRef,
      (snapshot) => {
        setCurrent(snapshot.val());
      },
      () => {}
    );

    return () => {
      unsubCurrent();
    };
  }, []);

  return { current };
}
