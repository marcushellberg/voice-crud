# Voice-Controlled Issue Tracker

A modern issue tracking application with voice control capabilities. Built with Hilla (Vaadin), Spring Boot, and OpenAI's real-time voice API.

## Features

- Voice-controlled interface for hands-free operation
- Real-time issue management
- Filter issues by assignee
- Create, delete, and select issues using voice commands
- Update issue properties (title, description, status, assignee) with voice
- Responsive web interface

## Technologies

- **Frontend**:
  - React + TypeScript
  - Hilla framework
  - WebRTC for real-time voice communication
  - OpenAI's real-time API for voice processing
  
- **Backend**:
  - Spring Boot
  - Java

## Prerequisites

- Java 17 or newer
- Node.js 18 or newer
- OpenAI API key with access to real-time voice models

## Setup

1. Clone the repository
2. Set your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

## Running the application

The project is a standard Maven project. To run it from the command line:

- Windows: `mvnw`
- Mac & Linux: `./mvnw`

Then open http://localhost:8080 in your browser.

You can also import the project to your IDE of choice as you would with any Maven project.

## Voice Control Usage

1. Click the "Enable Voice Control" button in the application
2. Once activated, you can use voice commands such as:
   - "Filter issues assigned to [name]"
   - "Show all issues"
   - "Create a new issue"
   - "Delete current issue"
   - "Select issue number [id]"
   - "Update the current issue's title to [title]"
   - "Change the status to in progress"
   - "Assign this issue to [name]"
   - "Update the description to [description]"

## Project structure

<table style="width:100%; text-align: left;">
  <tr><th>Directory</th><th>Description</th></tr>
  <tr><td><code>src/main/frontend/</code></td><td>Client-side source directory</td></tr>
  <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;<code>components/</code></td><td>React components including voice control</td></tr>
  <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;<code>views/</code></td><td>UI view components</td></tr>
  <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;<code>themes/</code></td><td>Custom CSS styles</td></tr>
  <tr><td><code>src/main/java/</code></td><td>Server-side source directory</td></tr>
  <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;<code>application/</code></td><td>Java services and models</td></tr>
</table>

## VoiceControl Component

The `VoiceControl` component is a React component that enables real-time voice control in the application using WebRTC and OpenAI's real-time voice API. It handles the audio streaming, WebRTC connection management, and function execution based on voice commands.

### Usage Example

```tsx
import { VoiceControl } from './components/VoiceControl';

// Define functions that can be called via voice commands
const functions = [
  {
    name: 'filterIssues',
    description: 'Filter issues by assignee',
    parameters: {
      type: 'object',
      properties: {
        assignee: {
          type: 'string',
          description: 'Name of the person to filter by'
        }
      }
    },
    execute: async (args) => {
      // Implementation of the filter function
    }
  }
];

function App() {
  return (
    <div>
      <VoiceControl functions={functions} />
      {/* Rest of your application */}
    </div>
  );
}
```

### Key Features

- Real-time voice processing using WebRTC
- Automatic audio streaming setup and management
- Bidirectional communication channel for voice commands and responses
- Function registration system for voice-controlled actions
- Built-in UI for enabling/disabling voice control

### Props

- `functions`: An array of function definitions that can be triggered by voice commands. Each function should have:
  - `name`: Function identifier
  - `description`: Description of what the function does (used by the AI)
  - `parameters`: JSON Schema of the function parameters
  - `execute`: The actual function implementation

## Building for Production

To create a production build:

- Windows: `mvnw clean package -Pproduction`
- Mac & Linux: `./mvnw clean package -Pproduction`

This will build a JAR file with all the dependencies and front-end resources, ready to be deployed. The file can be found in the `target` folder after the build completes.

To run the production build:
```bash
java -jar target/voice-crud-1.0-SNAPSHOT.jar
```

## Useful links

- [Hilla Documentation](https://vaadin.com/docs/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
