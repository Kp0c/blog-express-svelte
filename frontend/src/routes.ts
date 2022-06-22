import Feed from "./lib/pages/Feed.svelte";
import PostPage from "./lib/pages/PostPage.svelte";
import Signup from "./lib/pages/Signup.svelte";
import Login from "./lib/pages/Login.svelte";

export const routes = {
  '/': Feed,
  '/feed': Feed,
  '/feed/posts/:postId': PostPage,
  '/signup': Signup,
  '/login': Login
}
