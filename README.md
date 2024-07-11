# Hostmason Form Builder

Hostmason Form Builder is a cutting-edge, open-source form creation and management tool designed for developers and businesses who need a flexible, customizable solution for building and deploying web forms. Our project focuses on providing a seamless user experience with a powerful drag-and-drop interface, real-time preview, and extensive customization options.

## Project Status

As of the latest update, we have made significant progress on the core functionality of the form builder. Here's a summary of our current status:

- [x] Implemented drag-and-drop functionality for field reordering
- [x] Created an intuitive field configuration panel
- [x] Added real-time form preview updates
- [x] Implemented undo/redo functionality
- [x] Improved keyboard accessibility
- [ ] User roles and permissions system (in progress)
- [ ] Form submission notifications (planned)
- [ ] Dashboard with form performance metrics (planned)

## Features

- Intuitive drag-and-drop form builder interface
- Wide variety of form field types (text, email, number, radio buttons, checkboxes, etc.)
- Multi-page form support
- Customizable themes and styling options
- Form embedding functionality
- Real-time form preview
- Undo/Redo functionality
- Keyboard accessibility
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hostmason-form-builder.git
   cd hostmason-form-builder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up configuration files:
   
   Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   NODE_ENV=development
   ```
   
   This file sets the port for the server to run on and the environment mode.

   Create a `config.js` file in the root directory with the following content:
   ```javascript
   module.exports = {
     development: {
       // Development-specific configurations
     },
     production: {
       // Production-specific configurations
     }
   };
   ```
   
   This file allows you to set environment-specific configurations.

4. Start the application:
   ```
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Usage

1. Open the Form Builder page.
2. Use the drag-and-drop interface to add form fields from the left sidebar to your form.
3. Click on a field to open its configuration panel on the right.
4. Customize the form's appearance using the theme settings.
5. Use the undo/redo buttons to revert or restore changes.
6. Preview your form in real-time as you build it.
7. When satisfied, use the "Generate Embed Code" button to get the code for embedding the form on your website.

## Development

To run the application in development mode with hot reloading:

```
npm run dev
```

## Contributing

We welcome contributions to Hostmason Form Builder! Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

1. User Management and Security:
   - [ ] Implement user roles and permissions system
   - [ ] Add two-factor authentication
   - [ ] Implement secure password policies

2. Form Functionality Enhancements:
   - [ ] Add form submission notifications (email, SMS)
   - [ ] Implement form field dependencies and calculations
   - [ ] Add support for digital signatures in forms

3. Analytics and Reporting:
   - [ ] Create a dashboard with form performance metrics
   - [ ] Implement A/B testing for form layouts and fields
   - [ ] Add advanced analytics for form engagement and completion rates

4. Customization and Styling:
   - [ ] Add support for custom CSS in form styling
   - [ ] Implement theme customization options
   - [ ] Create a library of pre-designed form templates

5. Integration and API Development:
   - [ ] Develop an API for programmatic form creation and management
   - [ ] Implement integrations with popular CRM and marketing tools
   - [ ] Create webhooks for real-time data syncing

6. Advanced Features:
   - [ ] Implement form duplication and import/export functionality
   - [ ] Add multi-language support for forms
   - [ ] Implement conditional logic for form fields

7. Performance and Scalability:
   - [ ] Optimize form rendering for improved load times
   - [ ] Implement caching mechanisms for frequently accessed forms
   - [ ] Enhance database performance for large-scale form submissions

Note: This roadmap is for internal use only as this is a private project.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository or contact our support team at support@hostmason.com.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [Sortable.js](https://github.com/SortableJS/Sortable)
- All our contributors and users who have helped shape this project
