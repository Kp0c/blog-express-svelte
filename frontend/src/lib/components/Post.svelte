<script lang="ts">
    import type { Post } from "../models/Post";
    import Button from "./form/Button.svelte";
    import { push } from "svelte-spa-router";

    export let post: Post;

    $: formattedDate = post ? new Date(post.createdAt).toLocaleDateString() : 'Unknown';

    function viewPost(): void {
        push('/feed/posts/' + post._id);
    }
</script>

<div
    class="p-3 border-b border-gray-100 border-solid border-2 shadow-lg rounded-lg m-2"
>
    <span
        class="text-gray-300 font-bold text-xs"
    >
        Posted by {post.creator.name} on {formattedDate}
    </span>
    <h2
        class="text-gray-700 font-bold text-xl"
    >
        {post.title}
    </h2>
    <div
        class="flex justify-end gap-2"
    >
        <Button on:click={viewPost}>View</Button>
        <Button>Edit</Button>
        <Button type="outline" color="danger">Delete</Button>
    </div>

</div>
