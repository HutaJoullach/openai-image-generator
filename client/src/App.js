import { useRef, useState } from "react";
import "./App.css";
import "./spinner.css";
import Header from "./Header";

export default function App() {
  const promptRef = useRef(null);
  const sizeRef = useRef(null);

  const [imageUrl, setImageUrl] = useState();
  const [errorMsg, setErrorMsg] = useState();

  function handleSubmit(e) {
    e.preventDefault();

    setImageUrl("");
    setErrorMsg("");

    if (promptRef === "" || promptRef === null) {
      alert("Please add some text");
      return;
    }

    generateImageRequest(promptRef.current.value, sizeRef.current.value);
  }

  async function generateImageRequest(prompt, size) {
    try {
      showSpinner();

      const response = await fetch(
        "http://localhost:5000/openai/generateimage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            size,
          }),
        }
      );

      if (!response.ok) {
        removeSpinner();
        throw new Error("That image could not be generated");
      }

      const data = await response.json();
      setImageUrl(data.data);

      removeSpinner();
    } catch (error) {
      setErrorMsg(error);
    }
  }

  function showSpinner() {
    document.querySelector(".spinner").classList.add("show");
  }

  function removeSpinner() {
    document.querySelector(".spinner").classList.remove("show");
  }

  return (
    <div className="app">
      <Header />
      <main>
        <section class="showcase">
          <form onSubmit={handleSubmit} id="image-form">
            <h1>Enter prompt for an image</h1>
            <div class="form-control">
              <input
                ref={promptRef}
                type="text"
                id="prompt"
                placeholder="Enter Text"
              />
            </div>

            <div class="form-control">
              <select ref={sizeRef} name="size" id="size">
                <option value="small">Small</option>
                <option value="medium" selected>
                  Medium
                </option>
                <option value="large">Large</option>
              </select>
            </div>
            <button type="submit" class="btn">
              Generate
            </button>
          </form>
        </section>

        <section class="image">
          <div class="image-container">
            {errorMsg ? <h2 class="msg">{errorMsg}</h2> : <div></div>}
            {imageUrl ? <img src={imageUrl} alt="" id="image" /> : <div></div>}
          </div>
        </section>
      </main>

      <div class="spinner"></div>
    </div>
  );
}
