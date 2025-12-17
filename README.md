This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

## Deployments

### BETA

- 25/09/2024: Version 1(1.0)
- 03/10/2024: Version 2(2.0)
- 04/10/2024: Version 3(2.0.1)
- 14/10/2024: Version 4(2.1.0)
- 22/10/2024: Version 5(2.2.0)
- 31/10/2024: Version 6(2.3.0)
- 05/11/2024: Version 7(2.4.0)
- 15/11/2024: Version 8(2.5.0)
- 30/11/2024: Version 9(2.6.0)
- 30/01/2025: Version 10(2.7.0)
- 11/02/2025: Version 11(2.8.0)
- 03/03/2025: Version 12(2.9.0)
- 20/03/2025: Version 13(2.10.0)
- 07/04/2025: Version 14(2.11.0)
- 10/04/2025: Version 15(2.11.1)
- 06/05/2025: Version 16(2.12.0)
- 30/05/2025: Version 17(2.13.0)
- 17/06/2025: Version 18(2.14.0)
- 20/06/2025: Version 19(3.0)
- 25/06/2025: Version 20(3.0.1)
- 26/06/2025: Version 21(3.0.2)
- 30/06/2025: Version 22(3.0.3)
- 02/07/2025: Version 23(3.0.4)
- 10/07/2025: Version 24(3.1.0)
- 18/07/2025: Version 25(3.2.0)
- 25/07/2025: Version 26(3.3.0)
- 27/08/2025: Version 27(3.4.0)
- 11/03/2025: Version 35(3.7.1)
- 11/07/2025: Version 36(3.7.2)
- 14/11/2025: Version 37(3.7.3)

## Releases

### Version 1(1.0)

- User login screen with secure access
- PIN change feature for added security
- Home page for quick navigation
- Barcode input field with auto-focus for easy scanning
- Integrated APIs for smooth data flow
- Stable performance with global state management using Redux

### Version 2(2.0)

- Azure Authentication
- Lock screen on Timeout

### Version 3(2.0.1)

- Fix the App Active/Non Active state
- Fix colors discrepancy while on Dark mode
- Fix login screen UI bug

### Version 4(2.1.0)

- Enhanced security with Azure AD login timeout
- Barcode scanning functionality for quick information access
- Manual barcode entry option for retrieving item details

### Version 5(2.2.0)

- Added support for nested screens for smoother navigation.
- Improved error handling with detailed status information.
- Displayed last logged-in user on the login screen with easy logout.
- Integrated Welcome API and Azure login for a seamless start.
- Enhanced barcode detail screen with improved routing.

### Version 6(2.3.0)

- Created a new screen with a searchable list and barcode-based search.
- Customized mobile's default back button for consistent functionality.
- Clears global states on session timeout and logout.

### Version 7(2.4.0)

- Added a Versioning screen to track all app versions in one place.
- Developed new screens for Cross Dock and Google Goods-In, optimizing the goods-in process.
- Updated the scan API to support both new screens, ensuring seamless integration and functionality.
- Resolved issue with page name retrieval in barcode scans due to URL splitting.
- Fixed lifecycle and action-calling issues for seamless navigation, aligning it with custom back button behavior.
- Added functionality to log docks on the Dock-to-Stock screen with API integration.

### Version 8(2.5.0)

- Implemented reusable button components for all button screens, improving code maintainability and consistency.
- Enhanced the back action handling by updating it to work seamlessly on the root level.
- Added back navigation functionality via barcode scanning, ensuring smooth user interactions.
- Developed the Cross Dock Screen, incorporating all relevant use cases to streamline operations.
- Introduced the Google Goods-In Screen with full functionality for optimized workflow management.

### Version 9(2.6.0)

- Added logo to authorized screens for enhanced branding.
- Implemented global loader for consistent user feedback during loading.
- Fixed back action logic on the Scan screen to prevent app crashes.
- Added Replenishment screen with all buttons and tested functionality, including access from the - Scan CMD section.
- Introduced Item Info screen with full testing of nested screens and added it to the Scan CMD section.

### Version 10(2.7.0)

- Inventory control security check completed with screen, API integration, and testing.
- Improved location & partner modal by handling non-searchable items and clearing search on close.
- Various UI fixes for a smoother experience.
- Implemented global error processing in Saga for better stability.
- Added Azure login option to select a new or changed account.

### Version 11(2.8.0)

- Added Pallet Builder screen for efficient pallet management.
- Covered all possible use cases for a seamless experience.
- Tested with multiple pallets and cartons for stability.
- Improved performance and reliability across the app.

### Version 12(2.9.0)

- Added Carton Builder screens, integrated APIs, and tested the app.
- Implemented a Cancel Button in the Carton Builder.
- Created RTS Screens (Unserialized & Sterilized Orders), tested them, and enabled order returns.
- Performed thorough app testing for stability and performance.

### Version 13(2.10.0)

- Added Escalation screens, integrated APIs, and tested the app.
- Handeled order history, print a new label and reprint label.
- Handeled CMD.BACK over escalation

### Version 14(2.11.0)

- Introduced a new Access Control section within the app.
- Added dedicated pages for managing access control.
- Integrated backend rendering for access control pages.
- Implemented CMD + Back functionality for smooth navigation.

### Version 15(2.11.1)

- Integrated Access Control functionality directly within the Security Check screen on the Main Menu for easier access.
- Enabled Access Control handling during Scan and Test flows for a seamless experience.

### Version 16(2.12.0)

- Added Non-stock Location screens in Iteminformation.
- Added Non-stock Location screen access from barcode scan too.

### Version 17(2.13.0)

- Added error handling for API unavailability.

### Version 18(2.14.0)

- Handled recursive errors and API calls.

### Version 19(3.0)

- Added support for multiple Android build flavors: development, staging, and production.
- Environment-specific configs like API URLs, app names, and certificates are now separated by flavor.

### Version 20(3.0.1)

- Added fallback state for Location and Partner: shows "Not Set" when values are not available.
- Improved error handling for API failures: user is now clearly notified via toast and on-screen message when the server is unresponsive.
- Enhanced stability during initial setup by preventing crashes when values are missing.

### Version 21(3.0.2)

- Improved touch response on certain Android devices — buttons now respond correctly with a single tap.

### Version 22(3.0.3)

- UI refinement and cleanup in the latest build.
- Removed unused or placeholder screen elements.
- Minor performance and experience enhancements.

### Version 23(3.0.4)

- Improved login experience by adding a secure credential check with loading indicator to prevent screen flickering.
- Enhanced user feedback and error handling during authentication for a smoother experience.

### Version 24(3.1.0)

- Added Unserialized orders functionality in google goods in

### Version 25(3.2.0)

- Added internet connectivity check on Azure login screen to prevent login attempts when offline.
- Gracefully handled Azure AD login errors with improved user feedback.
- Enhanced reliability and user experience during the authentication process.

### Version 26(3.3.0)

- Added stock move screen.
- Handled all of its usecases and features.

### Version 27(3.4.0)

- Added paperless pick screen and handled all of its use cases.

### Version 35(3.7.1)

- Added Logging functionality and integrated it with the app.

### Version 36(3.7.2)

- Fixed the label printing issue on main menu screen.

### Version 37(3.7.3)

- Added label printing Api on dispatch complete.