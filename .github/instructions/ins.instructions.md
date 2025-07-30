---
applyTo: '**'
---

Number one golden rule: Under ANY circumstances, ALWAYS study the existing codebase before making any SORT of changes. This is crucial to understand the current architecture, coding standards, and how different components interact with each other. Point out any inconsistencies or areas that need improvement, but do not suggest changes that contradict the current implementation unless absolutely necessary or else it would break the whole application.

When you are making changes, ensure that you are building upon the existing functionality rather than introducing unnecessary complexity or breaking existing features. Always check for the latest commits and pull requests to see if there are any ongoing changes that might affect your work.

Make your solution compatible with the latest changes in the codebase. Ensure that any new features or fixes are integrated without breaking existing functionality. Pay attention to authentication and authorization mechanisms, especially for admin and user roles.

If you are adding new features, ensure they are properly tested and documented. For example, if you are implementing a new API endpoint or modifying an existing one, make sure to update the relevant controllers and models accordingly.

When making changes to the frontend components, ensure that they align with the latest design and functionality requirements. This includes handling user interactions, displaying data correctly, and managing state effectively.

Apply fast and efficient coding practices, such as using appropriate hooks for state management in React components, ensuring that API calls are optimized, and handling errors gracefully.

Performance is number one priority, so ensure that your changes do not introduce unnecessary overhead. Use tools like React's `useMemo` and `useCallback` to optimize rendering and avoid unnecessary re-renders.

Finally, ensure that your code adheres to the project's coding standards and conventions. This includes proper naming conventions, code organization, and commenting where necessary to enhance readability and maintainability.

Don't reinvent the wheel; leverage existing utilities and components where applicable. For instance, if there are already established methods for handling API requests or user authentication, use those instead of creating new ones. Use libraries and frameworks that are already part of the project to maintain consistency and reduce complexity. 3rd party libraries should be used judiciously, ensuring they are necessary and do not bloat the project unnecessarily. Only when a feature cannot be implemented with existing code or libraries should new ones be introduced.

Do not suggest code that has been deleted or is no longer relevant. Focus on the current state of the codebase and build upon it effectively.

Don't overdo it with unnecessary complexity or optimizations. Aim for a balance between performance and maintainability.

Structure should be clear and logical. Group related functionalities together, and ensure that the code is easy to navigate. Use meaningful names for functions and variables to enhance clarity. Do not change existing structures unless absolutely necessary for the new functionality and the current structure is totally inefficient or fundamentally flawed.

Ensure that your changes are backward compatible where possible. If you are modifying existing APIs or data structures, consider how these changes will affect current users and systems that rely on them.

Avoid introducing breaking changes unless absolutely necessary, and if you do, document them clearly in the commit messages and any relevant documentation.

Finally, keep the user experience in mind. Any changes made should enhance the usability of the application, making it more intuitive and responsive to user actions.
