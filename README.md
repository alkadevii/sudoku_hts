<img  width="380" height="850" alt="image" src="https://github.com/user-attachments/assets/e1074bfc-24ab-45ae-b99d-675fa6969c62" />


# 🧩 Sudoku Game Web App

A fully functional and interactive **Sudoku Game** built using **HTML, CSS, and JavaScript**.  
This project dynamically generates valid Sudoku puzzles, allows user interaction, tracks time, and verifies solutions in real-time.

---

## 🎮 How It Works

1. A complete valid Sudoku solution is generated.
2. Numbers are removed to create a playable puzzle.
3. Users fill in missing numbers using keyboard input.
4. The system checks validity in real-time.
5. Timer tracks how long it takes to solve.
6. Game detects completion and displays a success message.

---

## ✨ Features

- 🧠 Automatic Sudoku puzzle generation  
- 🔁 Backtracking algorithm for valid solutions  
- 🎲 Randomized puzzle creation  
- ⌨️ Keyboard number input (1–9)  
- 🛑 Prevention of editing given cells  
- ⏱️ Live timer  
- 🔄 Reset (same puzzle) option  
- 🆕 New Game (fresh puzzle) option  
- ❌ Error highlighting for invalid moves  
- 🎉 Completion detection with success message  

---

## 🧮 Core Logic

### ✔️ Sudoku Generation

- Diagonal 3×3 boxes are filled first  
- Remaining cells solved using **backtracking recursion**  
- Random numbers removed to create playable puzzle  

### ✔️ Validation Rules

Each move is validated against:

- Row constraints  
- Column constraints  
- 3×3 sub-grid constraints  

---

## 🛠️ Tech Stack

- **HTML** – Structure  
- **CSS** – Styling & Grid Layout  
- **JavaScript (OOP)** – Game logic, state management & algorithms  

---

## 📂 Project Structure

```
Sudoku-Game/
│── index.html
│── style.css
│── script.js
```

---

## 👩‍💻 Contributed by

**Anakha S**  
S6CS1  
LBSITW  
[GitHub](https://github.com/anakhavaishakham2005)

---

Made with ❤️  
Happy Coding 🚀
