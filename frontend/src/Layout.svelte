<script>
  import './app.css';
  import {Navbar, NavBrand, NavHamburger, NavLi, NavUl} from "flowbite-svelte";
</script>

<Navbar let:hidden let:toggle class="bg-green-200">
    <NavBrand href="/">
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Express + Svelte blog
		</span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        <NavLi href="/" active={true}>Feed</NavLi>
        <NavLi href="/about">Logout</NavLi>
    </NavUl>
</Navbar>

<slot />
