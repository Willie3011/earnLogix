# earnLogix
 EarnLogix is a web application designed to revolutionize salary tracking for individuals.

- Website Link : https://willie3011.github.io/earnLogix/
 
### Mission Statement
At EarnLogix, our mission is to empower individuals with a seamless and intelligent salary tracking experience. We strive to simplify the complexities of wage management by providing a user-friendly platform that not only accurately records  hours worked but also smartly calculates deductions, ensuring transparency and financial clarity. Our commitment is to enhance the way individuals navigate their earnings, fostering financial well-being and peace of mind in their professional journey.

### Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MongoDb

## System Development Lifecycle Phases for EarnLogix

### Requirements Gathering

#### Project Overview
- **Purpose:** Develop a web application to help workers accurately calculate their monthly salary, track expenses, and manage their finances effectively.
- **Problem to Solve:** Provide a tool for workers, especially those with standard and changing hours, to calculate the their monthly salary based on hours worked, hourly rates, and deductibles. Additionally, allow users to track their expenses, manage budgets, and make informed financial decisions.

#### Target Audience
- **User Profile:** Primarily targeting retail workers or workers with standard and changing working hours.
- **Needs Addressed:** Workers who receive hourly rates and need to calculate their monthly salary accurately. Users who also want to track their expenses and manage their finances effectively.

#### Functional Requirements
##### User Authentication
- Allow users to create an account securely or log in with existing credentials.
- Provide a mechanism for users to reset their passwords if forgotten, ensuring access to their accounts.

##### Profile Settings and Account Management
- Enable users to manage their account information and settings, including:
	- **Personal Information:** Allow users to view and update their personal details, such as name, email address, and contact information.
	- **Password Management:** Provide options for users to change their passwords securely, ensuring account security.
	- **Hourly Rates Adjustment:** Allow users to modify their hourly rates as needed, reflecting changes implemented by their employers.
	- **Notification Preferences:** Enable users to set their notification preferences, such as email notifications for salary calculations or updates.

##### Input Hours Worked and Manage Day Offs
- Provide a calendar view on the dashboard page where users can see their scheduled work days, hours worked, and days off.
- Allow users to input their hours worked directly from the calendar view by clicking a specific day. This opens a modal or form where users can enter the hours worked for that day.
- Display an indication on the calendar for days where the user had a scheduled day off, distinguishing them from work days.
- Provide an option for users to add a day off directly from the calendar view.

##### Total Hours Worked and Current Total Salary
- Display the total hours worked by the user on the dashboard page, providing a summary of their work activity.
- Show the current total salary earned by the user, which updates dynamically whenever the user adds more hours or makes changes to their hourly rates or deductibles.

##### Expense Tracker
- Integrate an expense tracker feature into the application, allowing the users to track their expenses and manage their finances.
- Use the current total salary as the primary income source for the expense tracker. Additional income sources can be added if the user has any.
- Allow the user to log their expenses, categorize them, and add additional details such as the date, amount, and description.
- Provide predefined expense categories and allow users to create custom categories.
- Enable users to set budgets for different expense categories and receive notifications or alerts when they exceed their budget limits.
- Generate reports and visualizations to help users analyze their spending patterns and make informed decisions.

##### Dynamic Updates and Sorting/Filtering
- Ensure that the total hours worked, current total salary and expense tracking data update in real-time as the user inputs new information or makes changes.
- Allow users to sort and filter the hour history table and expense records based on criteria such as date, hours worked, salary earned, or expense category.

#### Non-Functional Requirements

##### Security
- Implement measures to protect users' personal and financial information.
- Ensure password encryption and secure data transmission.
##### Accuracy
- Guarantee accurate calculation of monthly salaries based on user inputs.
##### Usability
- Design an intuitive and user-friendly interface for easy navigation, data input, and financial management.

##### Performance
- Ensure efficient performance, even for users with large amounts of data. 
