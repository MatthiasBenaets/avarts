<script>
  let fileUploaded = false;
  let fileContent = '';

  function handleFileChange(event) {
    const inputFile = event.target;

    if (inputFile.files.length > 0) {
      const reader = new FileReader();

      reader.onload = function (e) {
        // Update fileContent with the content of the uploaded file
        fileContent = e.target.result;
        fileUploaded = true;
      };

      // Read the content of the selected file
      reader.readAsText(inputFile.files[0]);
    } else {
      fileUploaded = false;
      fileContent = '';
    }
  }
</script>

<main>
  <input type="file" on:change={handleFileChange} />

  {#if fileUploaded}
    <div>
      <p>File uploaded! Content:</p>
      <pre>{fileContent}</pre>
    </div>
  {/if}
</main>

<style>
  /* Add your styles here */
</style>
