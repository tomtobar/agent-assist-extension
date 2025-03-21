console.log("running popup.js")

const appData = {
    apiUrl: "http://127.0.0.1:5000",
    user: {}
}

const idEl = (id) => document.getElementById(id)

const toggleElDisplay = (el) => {
    const element = document.querySelector(el);
    element.classList.toggle("hidden");
}

const displayCurrentUser = ({ user }) => {
    const currentUserLi = document.querySelector(".current-user")
    currentUserLi.textContent = user.email
}

const handleLoginSubmit = async ({ email }) => {

    try {
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email: email
            })
        }
        const response = await fetch(`${appData.apiUrl}/login`, config)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const user = await response.json();
        document.body.style.alignItems = "stretch"
        toggleElDisplay(".logout-btn")
        toggleElDisplay(".login-section")
        toggleElDisplay(".agent-assist-section")
        displayCurrentUser(user)
    } catch (error) {
        console.error(error.message)
    }
}

const form = document.querySelector(".login-form")
form.addEventListener("submit", (e) => {
    e.preventDefault()
    const emailInput = idEl("email")
    handleLoginSubmit({ email: emailInput.value })
    form.reset()

})

const getCurrentUser = async () => {
    try {
        const response = await fetch(`${appData.apiUrl}/me`, { credentials: "include" })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json();
        if (json.email) {
            displayCurrentUser(json)
        }
    } catch (error) {
        document.body.style.alignItems = "center"
        console.error(error.message)
    }
}

const logout = async () => {
    const response = await fetch(`${appData.apiUrl}/logout`, { method: "DELETE", credentials: "include" })
}

const handleLogoutClick = (e) => {
    const currentUserLi = document.querySelector(".current-user")
    currentUserLi.textContent = ""
    toggleElDisplay(".logout-btn")
    toggleElDisplay(".login-section")
    toggleElDisplay(".agent-assist-section")
    const responseDiv = idEl("ai-response")
    responseDiv.textContent = ""
    document.body.style.alignItems = "center"
    logout()
}

// const checkCurrentUser = () => {
//     const user = getCurrentUser()
//     if (user) {
//         toggleElDisplay(".login-section")
//         toggleElDisplay(".agent-assist-section")
//     }
// }

const handlePromptSubmit = async (e) => {
    e.preventDefault()
    const userPrompt = idEl("agent-assist")
    const responseDiv = idEl("ai-response")
    const questionP = document.createElement("p")
    questionP.textContent = userPrompt.value
    questionP.classList.add("user-prompt", "chat-responses")

    responseDiv.appendChild(questionP)
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            content: userPrompt.value
        })
    }
    e.target.reset()
    try {
        const response = await fetch(`${appData.apiUrl}/query`, config)
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json();
        const responseP = document.createElement("p")
        responseP.classList.add("ai-response", "chat-responses")
        responseP.textContent = data.message || "No response provided."
        responseDiv.appendChild(responseP)
    } catch (error) {
        console.error(error)
    }
}

const addListeners = () => {
    const logoutBtn = document.querySelector(".logout-btn")
    logoutBtn.addEventListener("click", handleLogoutClick)
    const promptForm = document.querySelector(".prompt-form")
    promptForm.addEventListener("submit", handlePromptSubmit)
}

document.addEventListener("DOMContentLoaded", () => {
    getCurrentUser()
    addListeners()
})