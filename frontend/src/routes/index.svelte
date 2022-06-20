<script>
  import {Button, Input, Spinner} from "flowbite-svelte";
</script>

<div class="flex justify-center mt-10">
    <div class="w-2/3 flex justify-center flex-col">
        <div class="flex mb-6">
            <Input
                    class="grow mr-1"
                    size="sm:text-md"
                    placeholder="Your status"
            />
            <Button
                    size="sm:text-md"
                    color="primary"
                    variant="contained">Update</Button>
        </div>
        <div class="text-center mb-6">
            <Button
                    size="sm:text-md"
                    color="primary"
                    variant="contained">New Post</Button>
        </div>
        <div class="text-center">
            <Spinner />
        </div>
    </div>
</div>
