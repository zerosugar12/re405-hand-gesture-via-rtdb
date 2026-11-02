import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "../../services/firebase.js";
import Spinner from "../common/Spinner.jsx";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let called = false;
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setLoading(false);
      } else if (!called) {
        called = true;
        signInAnonymously(auth).catch(() => setLoading(false));
      }
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-paper)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return <p className="text-center text-[var(--color-ink-muted)] p-8">Unable to sign in</p>;
  return children;
}
