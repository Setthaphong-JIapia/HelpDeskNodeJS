# 🛠️ HelpDesk Node.js Application

A Node.js-based Help Desk and Knowledge Base web application designed to support ticket management and a searchable knowledge base for user issues.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Use Case Diagram](#use-case-diagram)
- [License](#license)
- [Contributing](#contributing)

---

## Features

- **Knowledge Base**: Allows users to search, view, and create knowledge base articles that provide solutions for common issues.
- **Ticket Management**: Users can create, view, and update support tickets to address specific problems.
- **User Authentication**: Provides a basic user management system for logging in and managing access.
- **Responsive Design**: Built with EJS templates for a responsive, accessible user interface across devices.

---

## Installation

To set up this application locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/HelpDeskNodeJS.git
    cd HelpDeskNodeJS
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure the Database**:
   - Open the `config/config.json` file and edit it with your database credentials:
     ```json
     {
       "development": {
         "username": "your_username",
         "password": "your_password",
         "database": "helpdesk_db",
         "host": "127.0.0.1",
         "dialect": "mysql"
       }
     }
     ```

4. **Run Database Migrations**:
    ```bash
    npx sequelize-cli db:migrate
    ```

5. **Start the Server**:
    ```bash
    npm start
    ```

6. **Access the Application**:
    - Open your browser and go to: `http://localhost:3000`

---

## Usage

Users can:
- **Browse the Knowledge Base**
- **Create and manage support tickets**
- **Track ticket status**
- **Communicate via chat**
- **Manage user accounts** (Admin)

---

## Project Structure

