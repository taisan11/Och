import * as v from 'valibot'

export const newThreadBody = v.object({
  ThTitle: v.pipe(v.string(), v.maxLength(48)),
  name: v.optional(v.pipe(v.string(), v.maxLength(30))),
  mail: v.optional(v.pipe(v.string(), v.maxLength(70))),
  MESSAGE: v.pipe(v.string(), v.maxLength(300)),
})

export const newThread = v.object({
  ...newThreadBody.entries,
  BBSKEY: v.string(),
})

export const newPostBody = v.object({
  name: v.optional(v.pipe(v.string(), v.maxLength(30))),
  mail: v.optional(v.pipe(v.string(), v.maxLength(70))),
  MESSAGE: v.pipe(v.string(), v.maxLength(300)),
})

export const newPost = v.object({
  ...newPostBody.entries,
  BBSKEY: v.string(),
  THID: v.string(),
})