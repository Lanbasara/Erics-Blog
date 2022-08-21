import dependenceManager from "./dependenceManager";

export default function autorun(handler) {
  dependenceManager.beginCollect(handler);
  handler();
  dependenceManager.endCollect();
}
