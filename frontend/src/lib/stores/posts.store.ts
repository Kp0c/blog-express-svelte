import {writable} from "svelte/store";
import type { Post } from "../models/Post";

const initialState: Post[] = [];

export const posts = writable(initialState);

export function setPosts(newPosts: Post[]): void {
    posts.set(newPosts);
}

export function addPost(post: Post): void {
    posts.update(posts => [...posts, post]);
}

export function replacePost(updatedPost: Post): void {
    posts.update(posts => posts.map(post => post._id === updatedPost._id ? updatedPost : post));
}
