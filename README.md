# Wego Booking Application

A web application built to offer a seamless booking experience similar to Wego.
Our app allows users to book flights and rooms, with rooms managed by an admin and later extendable to a "host" role for additional listings.
This project was collaboratively developed by a team of six ASP.Net developers.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

---

### Installation

To set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/PassantHI/Wego--ITI-final-project
   cd Wego-ITI-final-project
   ```

2. **Backend Setup**:

   - Navigate to the backend folder and open the ASP.NET solution.
   - Update the necessary configurations (see [Configuration](#configuration) below).
   - Restore dependencies:

     ```bash
     cd backend
     dotnet restore
     ```

   - Create the first migration after setting up your DbContext and models:

     ```bash
     Add-Migration InitialCreate
     ```

   - Update the database with the new migration:

     ```bash
     Update-Database
     ```

   - Run the API project.

     ```bash
     dotnet run --project api
     ```

3. **Frontend Setup**:

   - Go to the frontend folder, install dependencies, and start the Angular development server.

     ```bash
     cd frontend
     npm install
     ng serve
     ```

---

### Project Structure

The project is organized into two main folders: `backend` and `frontend`.

#### Backend (ASP.NET Solution with 3 Projects)

1. **API Project**:

   - Contains controllers, mappers, DTOs, and required API folders and files.
   - Configured with JWT for authentication and Stripe for payment processing.

2. **Data Layer**:

   - Includes Unit of Work, repositories, context, and entities for data handling.

3. **Business Layer**:
   - Services and helper classes for image uploads , Payment service and email notifications.
   - **ImageHelper** handles server-side image storage.
   - **PaymentService** For Payment Session Creation.
   - **EmailService** sends emails; credentials must be configured (see [Configuration](#configuration)).

#### Frontend (Angular 18)

1. **App Structure**:

   - `core`: Contains reusable components like `header`, `nav`, and `footer`.
   - `dashboard`: Admin dashboard with controls for managing listings.
   - `main`: Pages for booking flights, room listings, and user account management (login, bookings, etc.).

2. **Folder Organization**:
   - `_models`, `_services`, `_guards`, and `__interceptors` are structured to maintain code modularity and separation of concerns.

---

### Configuration

Update the following configurations in the backend project:

- **JWT Authentication**: Set the JWT secret key.
- **Stripe**: Add your Stripe `secret` and `publishable` keys for payment integration and update `endpointSecret` in PaymentController with your Weebhook secret .
- **Stripe Webhook**: Set up a webhook in Stripe for the checkout.session.completed event to process completed payment sessions.
- **Stripe Webhook**: Set up a webhook in Stripe for the checkout.session.completed event to process completed payment sessions.
- **Email Credentials**: Configure the email and password in the `EmailService` class for sending notifications.
- **Database Connection**: Update the connection string in `appsettings.json` to connect to your database.

---

### Features

- **Room and Flight Bookings**: Allows users to book flights and rooms listed by the admin.
- **Admin Dashboard**: Enables admin users to manage listings and bookings.
- **User Management**: Includes JWT-based authentication and user profile handling.
- **Payment Integration**: Secure payments processed through Stripe.
- **Image Uploads**: Supports image uploads using `ImageHelper`.
- **Email Notifications**: Sends booking confirmations via email.
- **Pagination and Validation**: Ensures efficient data loading and validation.
- **Lazy Loading**: Uses proxies for efficient data loading.
- **CORS Enabled**: Supports secure cross-origin requests.
- **Dependency Injection**: Follows the Dependency Inversion Principle for modularity.

---

### Technologies Used

- **Backend**: ASP.NET Core, Identity, AutoMapper, JWT, Stripe API, Entity Framework Core, CORS, Dependency Injection
- **Frontend**: Angular 18, RxJS, Angular Material, Bootstrap
- **Database**: SQL Server

---

### Contributing

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request for review.

---

### Team

Meet the developers behind the project:

- **[Yasser Gafar](https://github.com/yassergaafartaha)**
- **[Passant Hatem](https://github.com/PassantHI)**
- **[Muhammed Osama](https://github.com/Muhammed-Osamaa)**
- **[Amr Amin](https://github.com/AmrKholy0)**
- **[Ismaeil Mohamed](https://github.com/Esmaeil-Mohmed)**
- **[Abdulrahman Nabil](https://github.com/abdulrahman-nabil99)**

---

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
