# Voice-Controlled Issue Tracker

A modern issue tracking application with voice control capabilities. Built with Hilla (Vaadin), Spring Boot, and OpenAI's real-time voice API.

## Features

- Voice-controlled interface for hands-free operation
- Real-time issue management
- Filter issues by assignee
- Create, delete, and select issues using voice commands
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
