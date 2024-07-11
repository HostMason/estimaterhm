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

## Future Implementations

- Implement form analytics and reporting
- Add support for form templates
- Implement form versioning and change history
- Add conditional logic for form fields
- Implement file upload functionality
- Add support for multiple languages and localization
- Implement a plugin system for extending functionality
- Add integration with popular CRM and marketing tools
- Implement advanced form validation rules
- Add support for recurring forms and scheduling

## TODO List

1. [ ] Refactor the form builder interface for better usability
   - Implement drag-and-drop functionality for field reordering
   - Create a more intuitive field configuration panel
   - Add real-time form preview updates
   - Implement undo/redo functionality
   - Improve keyboard accessibility

2. [ ] Implement user roles and permissions system
   - Define user roles (e.g., admin, editor, viewer)
   - Create a role management interface
   - Implement role-based access control for forms and submissions
   - Add user invitation and role assignment functionality

3. [ ] Add form submission notifications (email, SMS)
   - Implement email notification system using a service like SendGrid or Nodemailer
   - Add SMS notification capability using a service like Twilio
   - Create a notification settings interface for users to configure their preferences
   - Implement templating for notification messages

4. [ ] Create a dashboard with form performance metrics
   - Design and implement a dashboard layout
   - Add charts and graphs for submission statistics
   - Implement real-time updates for dashboard data
   - Create filters for viewing data by date range, form type, etc.

5. [ ] Implement form field dependencies and calculations
   - Add conditional logic for showing/hiding fields based on user input
   - Implement field value calculations based on other field inputs
   - Create a visual interface for setting up field dependencies and calculations
   - Add support for complex formulas and functions

6. [ ] Add support for custom CSS in form styling
   - Create a CSS editor interface within the form builder
   - Implement a live preview of CSS changes
   - Add pre-defined CSS templates for quick styling
   - Implement CSS validation to prevent broken styles

7. [ ] Develop an API for programmatic form creation and management
   - Design and document RESTful API endpoints
   - Implement authentication and rate limiting for API access
   - Create SDK or code samples for common programming languages
   - Add webhook support for real-time form events

8. [ ] Implement form duplication and import/export functionality
   - Add a "Duplicate Form" feature with options to copy submissions and settings
   - Implement form export to JSON or XML format
   - Create an import feature that can parse exported form structures
   - Add version control for imported forms

9. [ ] Add support for digital signatures in forms
   - Integrate a digital signature library (e.g., DocuSign API or open-source alternative)
   - Create a signature field type in the form builder
   - Implement signature verification and storage
   - Add support for multiple signatories and signature order

10. [ ] Implement A/B testing for form layouts and fields
    - Design an A/B test creation interface
    - Implement traffic splitting for different form versions
    - Create analytics and reporting for A/B test results
    - Add statistical significance calculations for test outcomes

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository or contact our support team at support@hostmason.com.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [express-session](https://github.com/expressjs/session)
- All our contributors and users who have helped shape this project
