import "./styles.css";
import Faker from "faker";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
const itemHeight = 100;
const visibleCount = Math.ceil(500 / itemHeight);
function VritualList() {
  const ref = useRef();
  const [listData, setListData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const endIndex = startIndex + visibleCount;
  const [offset, setOffset] = useState(0);
  const visiableList = useMemo(() => {
    return listData.slice(startIndex, endIndex + 1);
  }, [listData, startIndex, endIndex]);

  const getDtata = useCallback(() => {
    return new Array(10).fill({}).map((item) => ({
      id: Faker.datatype.uuid(),
      title: Faker.name.firstName(),
      content: Faker.company.companyName()
    }));
  }, [listData]);

  const handleScroll = useCallback(
    (e) => {
      console.count("handleScroll");
      const scrollTop = ref.current.scrollTop;
      const start = Math.floor(scrollTop / itemHeight);
      const end = start + visibleCount;
      setStartIndex(start);
      if (end >= listData.length) {
        const data = listData.concat(getDtata());
        setListData(data);
      }
      const offset = scrollTop - (scrollTop % itemHeight);
      setOffset(offset);
    },
    [listData, getDtata, visibleCount]
  );

  const listHeight = useMemo(() => {
    return listData.length * itemHeight;
  }, [listData]);

  useEffect(() => {
    let data = getDtata();
    setListData(data);
  }, []);

  useEffect(() => {
    console.count("handleScroll effect");
    let dom = ref.current;
    handleScroll();
    if (dom) {
      dom.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (dom) {
        dom.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // console.log("visiableList is", visiableList.length);
  return (
    <div className="view-port" id="view-port" ref={ref}>
      <div
        className="virtual-list-container"
        style={{
          height: listHeight
        }}
      >
        <div
          className="virtual-list-content"
          style={{
            transform: `translate3d(0,${offset}px,0)`
          }}
        >
          {visiableList.map((item) => {
            return (
              <div id={item.id} className="item">
                <div>{item.name}</div>
                <div>{item.content}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>This is a virtual-list example</h1>
      <VritualList />
    </div>
  );
}
