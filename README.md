# Hostmason

Hostmason is a powerful and flexible form builder application designed to help users create, manage, and analyze custom forms with ease. Built with Node.js, Express, and PostgreSQL, Hostmason offers a robust set of features for form creation, submission handling, and data management.

## Features

- Intuitive drag-and-drop form builder interface
- Wide variety of form field types (text, email, number, radio buttons, checkboxes, etc.)
- Multi-page form support
- Customizable themes and styling options
- Form embedding functionality
- Secure user authentication and authorization
- Submission tracking and management
- Data export capabilities
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hostmason.git
   cd hostmason
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your PostgreSQL credentials and other configuration options.

4. Set up the database:
   ```
   npm run db:setup
   ```

5. Start the application:
   ```
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Usage

1. Register for an account or log in if you already have one.
2. Navigate to the Form Builder page to create a new form.
3. Use the drag-and-drop interface to add and configure form fields.
4. Customize the form's appearance using the theme settings.
5. Save your form and use the provided embed code to add it to your website.
6. View and manage form submissions from the Submissions page.

## Development

To run the application in development mode with hot reloading:

```
npm run dev
```

## Testing

Run the test suite with:

```
npm test
```

## Contributing

We welcome contributions to Hostmason! Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository or contact our support team at support@hostmason.com.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/)
- All our contributors and users who have helped shape this project
