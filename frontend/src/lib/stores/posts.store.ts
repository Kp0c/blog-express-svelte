import { writable } from "svelte/store";
import type { Post } from "../models/Post";

const initialState: Post[] = [];

export const posts = writable(initialState);

export function setPosts(newPosts: Post[]): void {
  posts.set(newPosts);
}

export function addPost(post: Post): void {
  posts.update(posts => [post, ...posts]);
}

export function replacePost(updatedPost: Post): void {
  posts.update(posts => posts.map(post => post._id === updatedPost._id ? updatedPost : post));
}

export function deletePost(postId: string): void {
  posts.update(posts => posts.filter(post => post._id !== postId));
}

export function clearPosts(): void {
  posts.set([]);
}
