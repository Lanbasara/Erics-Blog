import  depedenceManager from './dependenceManager'

export default function autorun(handler){
  depedenceManager.beginCollect(handler)
  handler()
  depedenceManager.endCollect()
}