const crazybowlingLocaldev = true;

// Handle authentication
export const handleAuth = () => {
  if (crazybowlingLocaldev) {
    return true
  } else {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    const userEmail = sessionStorage.getItem("userEmail")
    if (isAuthenticated === "false" || isAuthenticated === null || !userEmail) {
      window.location.href = "/login"
      return false
    }
    console.log("UTILISATEUR AUTHENTIFIÉ : ", userEmail)
    //localStorage.removeItem("sessionScore")
    return true
  }
}

// Get current email player
export const getCurrentEmailPlayer = () => {
  const userEmail = sessionStorage.getItem("scoreKey")
  if (userEmail) {
    return userEmail
  } else {
    return "No email Found"
  }
}

// Create the return button
export const createReturnButton = () => {
  const returnButton = document.createElement("button")
  returnButton.innerText = "Retour au menu principal"

  returnButton.style.position = "absolute"
  returnButton.style.top = "10px"
  returnButton.style.left = "10px"
  returnButton.style.padding = "10px 20px"
  returnButton.style.fontSize = "1.2em"
  returnButton.style.cursor = "pointer"
  returnButton.style.color = "black"
  returnButton.style.border = "none"
  returnButton.style.borderRadius = "5px"

  document.body.appendChild(returnButton)

  returnButton.addEventListener("click", () => {
    window.location.href = "/"
  })
}
