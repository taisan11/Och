import {object,string,number} from 'valibot'

const v = {object,string,number}

export const newThread = v.object({
  ThTitle: v.string(),
  name: v.string(),
  mail: v.string(),
  MESSAGE: v.string(),
  BBSKEY: v.string(),
})
export const newPost = v.object({
  name: v.string(),
  mail: v.string(),
  MESSAGE: v.string(),
  BBSKEY: v.string(),
  THID: v.string(),
})