// =============================
// Main Entry File
// Application Controller
// =============================

// -----------------------------
// Import Modules
// -----------------------------
import {
  openDB,
  addData,
  getDataByIndexAndCursor,
  getDataByCursor,
  getDataByIndex,
  deleteData
} from "./db.js"

import {
  render,
  toggleCard,
  clearSearch
} from "./ui.js"

import AudioManager from "./audio.js"

// -----------------------------
// Global State
// -----------------------------
let db = null
let dataArr = []
let tempArr = []
let timerID = 0
let rnum = 0

// -----------------------------
// Initialize Application
// -----------------------------
async function init() {
  db = await openDB("test", 1)
  dataArr = await getDataByCursor(db, "info")
  tempArr = dataArr.slice()
  render(tempArr)
}

await init()

// -----------------------------
// Register Service Worker
// -----------------------------
if ("serviceWorker" in navigator) {
  try {
    const registration = await navigator.serviceWorker.register("./sw.js")
    console.log("ServiceWorker registered:", registration)
  } catch (err) {
    console.log("ServiceWorker registration failed:", err)
  }
}

// -----------------------------
// Add Card Logic
// -----------------------------
async function addCardToDB(card) {
  try {
    await addData(db, "info", card)
    alert("Added successfully!")
    dataArr = await getDataByCursor(db, "info")
    tempArr = dataArr.slice()
    render(tempArr)
  } catch (error) {
    console.log("Add failed:", error)
  }
}

// -----------------------------
// DOM Elements
// -----------------------------
const start = document.querySelector(".start")
const stop = document.querySelector(".stop")
const reset = document.querySelector(".reset")
const img = document.querySelector(".cardBox img")
const cardName = document.querySelector("#cardName")
const upload = document.querySelector("#upload")
const addCard = document.querySelector("#addCard")
const switchCard = document.querySelector(".cardFront .setUp")
const cardFront = document.querySelector(".cardFront")
const cardBack = document.querySelector(".cardBack")
const switchCardB = document.querySelector(".cardBack .setUp")
const cardManagerUl = document.querySelector(".cardManager ul")
const searchInput = document.querySelector(".search")
const searchBtn = document.querySelector(".searchBtn")
const backBtn = document.querySelector(".backBtn")

// -----------------------------
// Event Bindings
// -----------------------------

// Random Card
start.addEventListener("click", function () {
  AudioManager.playStartSound()
  AudioManager.playScrollSound()
  if (tempArr.length === 0) {
    AudioManager.playPromptSound()
    alert("No cards left, please reset!")
    return
  }

  start.disabled = true
  stop.disabled = false

  timerID = setInterval(() => {
    rnum = Math.floor(Math.random() * tempArr.length)
    img.src = tempArr[rnum].url
  }, 50)
})

stop.addEventListener("click", function () {
  AudioManager.playStopSound()
  AudioManager.stopScrollSound()
  stop.disabled = true
  start.disabled = false
  clearInterval(timerID)
  tempArr.splice(rnum, 1)

  if (tempArr.length === 0) {
    start.disabled = true
    stop.disabled = true
    AudioManager.playPromptSound()
    alert("All cards finished! Please reset.")
  }
})

// Reset Page
reset.addEventListener("click", function () {
  location.reload()
})

// Toggle Card Front/Back
switchCard.addEventListener("click", () => {
  toggleCard(cardFront, cardBack)
})

switchCardB.addEventListener("click", () => {
  toggleCard(cardFront, cardBack)
})

// Search Cards
searchBtn?.addEventListener("click", async function () {
  const keyword = searchInput.value.trim()

  if (!keyword) {
    alert("Please enter keyword!")
    return
  }

  const result = await getDataByIndexAndCursor(
    db,
    "info",
    "index2",
    keyword
  )

  if (result.length === 0) {
    alert("No results found!")
    clearSearch(searchInput)
    return
  }

  render(result)
})

// Back to All Cards
backBtn?.addEventListener("click", async function () {
  clearSearch(searchInput)
  dataArr = await getDataByCursor(db, "info")
  render(dataArr)
})

// Delete Card
cardManagerUl.addEventListener("click", async function (e) {
  if (e.target.closest("button")) {
    if (!confirm("Confirm delete?")) return

    const id = +e.target.closest("button").dataset.id

    await deleteData(db, "info", id)
    dataArr = await getDataByCursor(db, "info")
    tempArr = dataArr.slice()
    render(tempArr)

    clearSearch(searchInput)
  }
})

// Add Card
addCard.addEventListener("click", function () {
  const imgFile = upload.files[0]

  if (!imgFile) {
    alert("Please select an image!")
    return
  }

  const reader = new FileReader()

  reader.onload = async function (e) {
    const newCard = {
      time: Date.now(),
      name: cardName.value || "unknown",
      url: e.target.result
    }

    await addCardToDB(newCard)

    upload.value = ""
    cardName.value = ""
  }

  reader.readAsDataURL(imgFile)
})