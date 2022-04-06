import MySuspense from "./suspense";
import { getData, getRandomDog } from "./api";
import { Suspense, lazy, useState } from "react";
import FetchOnRender from "./fetch";
const resource = getData(getRandomDog);

const AsyncChunk = lazy(() => import("./async-chunk"));
function RenderDogImg() {
  const data = resource.read();
  return (
    <div>
      <img style={{ width: 100, height: 100 }} src={data} alt="DogImg"></img>
    </div>
  );
}

const LazyInitRecord = {
  AsyncChunk: false,
};
export default function App() {
  const [hasLoad, setHasLoad] = useState(false);
  const handleLoadAsync = () => {
    if (!LazyInitRecord.AsyncChunk) {
      LazyInitRecord.AsyncChunk = true;
      setHasLoad(true);
    }
  };
  return (
    <div className="App">
      <h1>Hello My-suspense</h1>
      <MySuspense fallback={"img is loading"}>
        <RenderDogImg />
      </MySuspense>
      <FetchOnRender />
      <div>
        <button onClick={handleLoadAsync}>Click to load async chunk</button>
        {hasLoad ? (
          <Suspense fallback={"async loading"}>
            <AsyncChunk />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
