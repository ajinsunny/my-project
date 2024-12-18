# AIssets - Smart Savings Goals App

AIssets is a financial planning app that helps users manage their savings goals by providing AI-suggested savings plans based on monthly income and spending habits. The app allows users to set savings goals and receive tailored suggestions on how much they should save each month to achieve these goals.

## Features

- **Set Savings Goals**: Create multiple savings goals with a target amount (e.g., emergency fund, vacation, or a new laptop).
- **AI-Suggested Savings Plan**: Based on user-defined monthly income, the app provides a suggested savings amount for each goal using a mock AI logic (e.g., saving 20% of the monthly income).
- **Progress Tracking**: Track the progress of each goal in a visual format.
- **Income Management**: The user can enter and update their monthly income on the Explore tab, which is then used to calculate the suggested savings amount for each goal.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ajinsunny/AIssets.git
   cd AIssets
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Install necessary Expo packages:

   ```bash
   npx expo install
   ```

4. Start the Expo development server:

   ```bash
   npx expo start
   ```

5. You can open the app in Expo Go (Android) or the iOS simulator.

## How It Works

### Home Screen
- Displays a list of savings goals.
- For each goal, the app calculates and displays a suggested monthly savings amount, based on the user's income and the 20% rule.
- Users can add new goals, track progress, and view target amounts for each savings goal.

### Explore Screen
- This screen allows users to input or update their monthly income.
- The updated monthly income is stored and then used to adjust the suggested savings for each goal in the home screen.

### Modals
- Users can interact with modals to:
  - Track progress for each goal.
  - Add new savings goals with a target amount.

## Key Technologies

- **React Native**: For building the mobile app.
- **Expo**: For development and bundling the app.
- **AsyncStorage**: To store the user's monthly income persistently.
- **react-native-modalize**: To handle modals with smooth animations and snap points.
- **react-native-vector-icons**: For using icons in the app interface.

## Project Structure

```bash
📦AIssets
 ┣ 📂app
 ┃ ┣ 📂(tabs)
 ┃ ┃ ┣ 📜explore.tsx    # Explore tab to input and update monthly income
 ┃ ┃ ┣ 📜index.tsx      # Home tab to manage and view savings goals
 ┃ ┃ ┣ 📜_layout.tsx    # Tab navigator layout
 ┣ 📂components
 ┃ ┣ 📜TabBarIcon.tsx   # Component for tab bar icons
 ┣ 📂hooks
 ┃ ┣ 📜useColorScheme.ts # Hook for managing dark/light mode themes
 ┣ 📂constants
 ┃ ┣ 📜Colors.ts        # Color constants for the app
 ┣ 📜App.tsx            # Entry point for the app
 ┣ 📜package.json
 ┗ 📜README.md
```

## Future Improvements

- **AI Integration**: Replace the mock savings suggestion logic with a real AI model that can analyze spending habits and recommend personalized savings plans.
- **Notifications**: Add notifications to encourage users when they're close to achieving their savings goals.
- **Spending Tracker**: Integrate a feature to track and visualize spending habits, allowing better financial management.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or raise an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or issues, please contact:

- **Name**: Ajin Sunny
- **Email**: ajin.sunny@gmail.com
