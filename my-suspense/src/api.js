export function getRandomDog() {
  return fetch("https://dog.ceo/api/breeds/image/random")
    .then((res) => res.json())
    .then((res) => res.message);
}

export function getData(apiFn) {
  let value = suspenseWrapper(apiFn);
  return value;
}

function suspenseWrapper(apiFn) {
  let status = "pending";
  let res;
  let suspender = apiFn()
    .then((r) => {
      status = "success";
      res = r;
    })
    .catch((e) => {
      status = "error";
      res = e;
    });
  return {
    read() {
      if (status === "pending") {
        throw { value: suspender };
      } else if (status === "error") {
        throw res;
      } else if (status === "success") {
        return res;
      }
    },
  };
}
