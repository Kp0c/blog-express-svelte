import Feed from "./lib/pages/Feed.svelte";
import PostPage from "./lib/pages/PostPage.svelte";

export const routes = {
    '/': Feed,
    '/feed': Feed,
    '/feed/posts/:postId': PostPage,
}
