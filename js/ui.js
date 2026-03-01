// =============================
// UI Module
// Handle DOM Rendering
// =============================

// Render card list
function render(dataArr) {
  const dataWrite = dataArr.map((ele) => {
    return `
      <li>
        <a href="#"><img src="${ele.url}" alt=""></a>
        <p>${ele.name}</p>
        <button class="delete" data-id="${ele.id}">
          <i class="iconfont icon-ashbin"></i>
        </button>
      </li>
    `
  })

  document.querySelector(".cardManager ul").innerHTML =
    dataWrite.join("")
}

// Toggle card front/back
function toggleCard(cardFront, cardBack) {
  cardFront.classList.toggle("active")
  cardBack.classList.toggle("active")
}

// Clear search input
function clearSearch(input) {
  input.value = ""
}

export {
  render,
  toggleCard,
  clearSearch
}
