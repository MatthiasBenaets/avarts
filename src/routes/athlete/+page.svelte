<script lang="ts">
  export let data;

  let edit = false;
  let remove = false;
  let update = false;
  let name = false;
  let weight = false;
  let formData;

  const showAvatar = (event) => {
    const target = event.target
    const files = target.files

    if (files.length > 0) {
      const src = URL.createObjectURL(files[0])
      const preview = document.getElementById('avatarImg')
      preview.src = src;
    }

    edit = true;
    update = true;
  }

  function removeAvatar() {
    const preview = document.getElementById('avatarImg')
    preview.src= "/avatar.svg";
    remove = true;
    edit = true;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    const formElement = event.target as HTMLFormElement;
    formData = new FormData(formElement);


    if (remove == true) {
      formData.append('avatar', '')
    } else if (update != true) {
      formData.delete('avatar')
    }
    formData.append('id', data.user.id)

    console.log(formData)

    let response
    try {
      response = await fetch('?/update', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      return console.error(error);
    };

    if (response.ok) {
      window.location.href = `/athlete`
    }
  }
</script>

<div class="w-1/2 mx-auto">
  <div class="flex flex-col">
    <div class="flex flex-row justify-between py-5 mt-5 border-b border-neutral-400">
      <h1 class="text-3xl text-white font-semibold">
        My Profile
      </h1>
      {#if edit == true && data.user.name && data.user.weight >= 0}
        <button form="update" class="p-2 px-5 bg-orange-600 text-white rounded-full">
          Save
        </button>
      {/if}
    </div>
    <div class="flex flex-row border-b border-neutral-400 py-4 cursor-auto hover:bg-neutral-600 group">
      <div class="w-1/4 text-right text-neutral-400">
        <span>
          Current Photo
        </span>
      </div>
      <div class="w-3/4 pl-4 text-neutral-100 flex flex-col">
        <label for="avatar" class="w-32">
          <div class="relative" title="Max 5MB">
            {#if data.user.avatar}
              <img src="http://127.0.0.1:8090/api/files/{data.user.collectionId}/{data.user.id}/{data.user.avatar}" alt="avatar" id="avatarImg" class="h-32 w-32 object-cover rounded-full hover:cursor-pointer">
            {:else}
              <img src="/avatar.svg" alt="avatar" id="avatarImg" class="h-32 w-32 object-cover rounded-full hover:cursor-pointer" />
            {/if}
            <div class="absolute -bottom-1 right-1 w-8 h-8 rounded-full bg-orange-600 hover:cursor-pointer">
              <svg class="mt-2 ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </div>
          </div>
          <div class="flex justify-center w-full mt-3 font-semibold">
            <button class="text-orange-600" on:click={removeAvatar}>
              remove
            </button>
          </div>
        </label>
        <div class="w-full">
        </div>
        <input id="avatar" name="avatar" type="file" accept="image/*" value='' form="update" hidden on:change={showAvatar}/>
      </div>
    </div>

    <form id="update" method="POST" on:submit={handleSubmit}>
      <div class="flex flex-row border-b border-neutral-400 py-4 cursor-pointer hover:bg-neutral-600 group" on:click={() => {edit=true; name=true}} role="button" tabindex="0" aria-hidden="true">
        <div class="w-1/4 text-right text-neutral-400">
          <span>
            Name
          </span>
        </div>
        <div class="w-3/4 pl-4 text-neutral-100 flex flex-row">
          {#if edit == true && name == true}
            <input type="text" name="name" class="bg-neutral-600 border border-neutral-400 rounded-md" bind:value={data.user.name}/>
          {:else}
            <span class="pr-2">{data.user.name}</span>
            <svg class="hidden group-hover:block mt-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          {/if}
        </div>
      </div>
      <div class="flex flex-row border-b border-neutral-400 py-4 cursor-pointer hover:bg-neutral-600 group">
        <div class="w-1/4 text-right text-neutral-400">
          <span>
            Weight
          </span>
        </div>
        <div class="w-3/4 pl-4 text-neutral-100 flex flex-row" on:click={() => {edit=true; weight=true}} role="button" tabindex="0" aria-hidden="true">
          <span>
            {#if edit == true && weight == true}
              <input type="number" step="0.1" min="0" name="weight" class="bg-neutral-600 border border-neutral-400 rounded-md w-16" bind:value={data.user.weight}/>
            {:else}
              {data.user.weight}
            {/if}
          </span>
          <span class="pl-1 pr-2">
            kg
          </span>
          <svg class="hidden group-hover:block mt-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </div>
      </div>
    </form>
  </div>
</div>
