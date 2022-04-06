import { useEffect, useState } from "react";
import { getRandomDog } from "./api";
export default function FetchOnRender() {
  const [isLoading, setLoading] = useState(true);
  const [src, setSrc] = useState("");
  useEffect(() => {
    (async () => {
      let res = await getRandomDog();
      setLoading(false);
      setSrc(res);
    })();
  }, []);

  return isLoading ? (
    "This is FetchOnRenderLoading"
  ) : (
    <img style={{ width: 100, height: 100 }} src={src}></img>
  );
}
