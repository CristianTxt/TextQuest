
const apiUrl = "https://textquest-hiyn.onrender.com";





            let gameState = {
                currentScenario: 'intro',
                choices: {
                    intro: {
                        LookAround: 'lookAround',
                        OpenDoor: 'openDoor'
                    },
                    lookAround: {
                        InvestigateRoom: 'investigateRoom',
                        OpenDoor: 'openDoor'
                    },
                    investigateRoom: {
                        Desk: 'desk',
                        Window: 'window'
                    },
                    desk: {
                        LeaveRoom: 'leaveRoom'
                    },
                    window: {
                        JumpOut: 'jumpOut'
                    },
                    openDoor: {
                        Hallway: 'hallway'
                    },
                    hallway: {
                        Left: 'left',
                        Right: 'right'
                    },
                    left: {
                        Stairs: 'stairs'
                    },
                    right: {
                        TrapDoor: 'trapDoor'
                    },
                    stairs: {
                        TowerTop: 'towerTop'
                    },
                    trapDoor: {
                        Tunnel: 'tunnel'
                    },
                    towerTop: {
                        CrossBridge: 'crossBridge'
                    },
                    // Add more choices and scenarios here...
                },
                scenarioText: {
                    intro: 'You wake up in a mysterious room. It\'s dark but you can barely see that there is a door in front of you. What do you do?',
                    lookAround: 'You look around the room. There seems to be some interesting objects scattered around. What do you do next?',
                    investigateRoom: 'You decide to investigate further. Do you want to check the desk or look out the window?',
                    desk: 'You find some papers on the desk. What do you do?',
                    window: 'You approach the window. It seems to be stuck. Do you try to open it?',
                    openDoor: 'You open the door and find yourself in a dimly lit hallway. Which way do you go?',
                    hallway: 'You enter a dimly lit hallway. Which way do you go?',
                    left: 'You choose to go left and find a stairway leading upwards. Where does it lead?',
                    right: 'You choose to go right and discover a trap door on the floor. What lies beneath?',
                    stairs: 'You climb the stairs and emerge at the top of a tower. What do you see?',
                    trapDoor: 'You open the trap door and descend into a dark tunnel. What awaits you in the depths?',
                    towerTop: 'You reach the top of the tower and find a narrow bridge stretching across an abyss. Will you dare to cross it?',
                    // Add more scenario texts here...
                },
                playerChoices: []
            };

            currentGameState = { currentScenario: "" }



            document.addEventListener('DOMContentLoaded', () => {
                const registerUserForm = document.getElementById('register-user-form');
                const loginUserForm = document.getElementById('login-user-form');
                const gameContainer = document.getElementById('game-container');
                const formSelection = document.getElementById('form-selection');
                const loginButton = document.getElementById('login-btn');
                const registerButton = document.getElementById('register-btn');

                loginButton.addEventListener('click', () => {
                    registerUserForm.classList.add('hidden');
                    loginUserForm.classList.remove('hidden');
                    gameContainer.classList.add('hidden');
                });

                registerButton.addEventListener('click', () => {
                    registerUserForm.classList.remove('hidden');
                    loginUserForm.classList.add('hidden');
                    gameContainer.classList.add('hidden');
                });

                registerUserForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    const response = await fetch(`${apiUrl}/user/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, email, password }),
                    });
                    const data = await response.json();
                    console.log(data);
                    registerUserForm.reset();
                });

                loginUserForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const email = document.getElementById('login-email').value;
                    const password = document.getElementById('login-password').value;
                    const response = await fetch(`${apiUrl}/user/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    const data = await response.json();
                    loginUserForm.reset();
                    if (response.ok) {
                        localStorage.setItem('token', data.authToken);
                        localStorage.setItem("userId", data.existingUser.id);
                        const usernameDisplay = document.getElementById('username-display');
                        usernameDisplay.textContent = `Welcome, ${data.existingUser.name}!`; // Display the username
                        gameContainer.classList.remove('hidden');
                        loginUserForm.classList.add('hidden'); // Hide the login form
                    } else {
                        alert('Login failed. Please check your credentials.');
                    }
                });
                const signOutButton = document.getElementById('sign-out-button');
                signOutButton.addEventListener('click', () => {
                    localStorage.removeItem('token');
                    gameContainer.classList.add('hidden');
                    localStorage.removeItem('userId');
                    location.reload();
                });

                function makeChoice(choice) {
                    const nextScenario = gameState.choices[gameState.currentScenario][choice];
                    if (nextScenario) {
                        gameState.playerChoices.push({
                            scenarioText: gameState.scenarioText[gameState.currentScenario],
                            choice: choice
                        });
                        gameState.currentScenario = nextScenario;
                        updateGame();
                    }
                }

                function updateGame() {
                    const outputElement = document.getElementById('output');
                    const choicesElement = document.getElementById('choices');
                    const choicesTextElement = document.getElementById('choices-text');
                    const userInput = document.getElementById('choices-text').value;

                    outputElement.textContent = gameState.scenarioText[gameState.currentScenario];

                    currentGameState.currentScenario = userInput;

                    choicesTextElement.value = '';
                    gameState.playerChoices.forEach((choice, index) => {
                        choicesTextElement.value += `${index + 1}. Scenario: ${choice.scenarioText}, Choice: ${choice.choice}\n`;
                    });

                    choicesElement.innerHTML = '';
                    Object.keys(gameState.choices[gameState.currentScenario]).forEach(choice => {
                        const button = document.createElement('button');
                        button.textContent = choice;
                        button.onclick = () => makeChoice(choice);
                        choicesElement.appendChild(button);
                    });
                }

                updateGame(); // Initial game update


                async function loadGameState() {
                    const userId = localStorage.getItem("userId");
                    const token = localStorage.getItem('token');

                    const response = await fetch(`${apiUrl}/user/get-game-state/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'

                        }
                    });

                    if (response.ok) {
                        const gameState = await response.json(); // Parse JSON response
                        console.log(gameState);
                        return gameState;
                    } else {
                        throw new Error('Failed to load game state');
                    }
                }

                const loadButton = document.getElementById('load-button');
                loadButton.addEventListener('click', async () => {
                    try {
                        const loadedGameState = await loadGameState();
                        document.getElementById('choices-text').value = loadedGameState.currentScenario;

                    } catch (error) {
                        console.error('Error loading game state:', error);
                        // Handle the error as needed
                    }
                });



                async function saveGameState(currentGameState) {
                    const userId = localStorage.getItem("userId");
                    const token = localStorage.getItem('token');

                    const response = await fetch(`${apiUrl}/user/save-game-state/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ userId, currentGameState })
                    });

                    if (response.ok) {
                        return 'Game state saved successfully';
                    } else {
                        throw new Error('Failed to save game state');
                    }
                }

                const saveButton = document.getElementById('save-button');
                saveButton.addEventListener('click', () => {
                    saveGameState(currentGameState);
                });



            });

     