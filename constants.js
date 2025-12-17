export const versionData = [
  {
    title: 'Version 37(3.7.3)',
    releaseDate: '14/11/2025',
    details: [
      'Added label printing Api on dispatch complete.',],
  },
  {
    title: 'Version 36(3.7.2)',
    releaseDate: '07/11/2025',
    details: [
      'Fixed the label printing issue on main menu screen.',],
  },
  {
    title: 'Version 35(3.7.1)',
    releaseDate: '03/11/2025',
    details: [
      'Added Logging functionality and integrated it with the app.',],
  },
  {
    title: 'Version 34(3.7.0)',
    releaseDate: '17/10/2025',
    details: [
      'Added paperless dispatch screen and handled all of its use cases.',
    ],
  },
  {
    title: 'Version 33(3.6.4)',
    releaseDate: '10/10/2025',
    details: [
      'Added DispatchList Screen and handled all of its use cases.',
    ],
  },
  {
    title: 'Version 32(3.6.3)',
    releaseDate: '08/10/2025',
    details: [
      'Fixed the label printing issue on non-stock move screen.',
    ],
  },
  {
    title: 'Version 31(3.6.2)',
    releaseDate: '06/10/2025',
    details: [
      'Fixed the resolution and input modal issues on stock move.',
    ],
  },
  {
    title: 'Version 30(3.6.1)',
    releaseDate: '03/10/2025',
    details: [
      'Fixed non stock move comment issue.',
      'Added printing label functionality on non stock move screen.',
      'Handled the null issue on stock move screen.',
      'Brandhub logo margin fixed.',
    ],
  },
  {
    title: 'Version 29(3.6.0)',
    releaseDate: '29/09/2025',
    details: ['Added dispatch screen and handled all of its use cases.'],
  },
  {
    title: 'Version 28(3.5.0)',
    releaseDate: '16/09/2025',
    details: ['Added stock take  screen and handled all of its use cases.'],
  },
  {
    title: 'Version 27(3.4.0)',
    releaseDate: '27/08/2025',
    details: ['Added paperless pick screen and handled all of its use cases.'],
  },
  {
    title: 'Version 26(3.3.0)',
    releaseDate: '25/07/2025',
    details: [
      'Added stock move screen.',
      'Handled all of its usecases and features.',
    ],
  },
  {
    title: 'Version 25(3.2.0)',
    releaseDate: '18/07/2025',
    details: [
      'Added internet connectivity check on Azure login screen to prevent login attempts when offline.',
      'Gracefully handled Azure AD login errors with improved user feedback.',
      'Enhanced reliability and user experience during the authentication process.',
    ],
  },
  {
    title: 'Version 24(3.1.0)',
    releaseDate: '10/07/2025',
    details: ['Added Unserialized orders functionality in google goods in.'],
  },
  {
    title: 'Version 23(3.0.4)',
    releaseDate: '02/07/2025',
    details: [
      'Improved login experience by adding a secure credential check with loading indicator to prevent screen flickering.',
      'Enhanced user feedback and error handling during authentication for a smoother experience.',
    ],
  },
  {
    title: 'Version 22(3.0.3)',
    releaseDate: '30/06/2025',
    details: [
      'UI refinement and cleanup in the latest build.',
      'Removed unused or placeholder screen elements.',
      'Minor performance and experience enhancements.',
    ],
  },
  {
    title: 'Version 21(3.0.2)',
    releaseDate: '26/06/2025',
    details: [
      'Improved touch response on certain Android devices — buttons now respond correctly with a single tap.',
    ],
  },
  {
    title: 'Version 20(3.0.1)',
    releaseDate: '25/06/2025',
    details: [
      'Added fallback state for Location and Partner: shows "Not Set" when values are not available.',
      'Improved error handling for API failures: user is now clearly notified via toast and on-screen message when the server is unresponsive.',
      'Enhanced stability during initial setup by preventing crashes when values are missing.',
    ],
  },
  {
    title: 'Version 19(3.0)',
    releaseDate: '20/06/2025',
    details: [
      'Added support for multiple Android build flavors: development, staging, and production.',
      'Environment-specific configs like API URLs, app names, and certificates are now separated by flavor.',
    ],
  },
  {
    title: 'Version 18(2.14.0)',
    releaseDate: '17/06/2025',
    details: ['Handled recursive errors and API calls.'],
  },
  {
    title: 'Version 17(2.13.0)',
    releaseDate: '30/05/2025',
    details: ['Added error handling for API unavailability.'],
  },
  {
    title: 'Version 16(2.12.0)',
    releaseDate: '06/05/2025',
    details: [
      'Added Non-stock Location screens in Iteminformation.',
      'Added Non-stock Location screen access from barcode scan too.',
    ],
  },
  {
    title: 'Version 15(2.11.1)',
    releaseDate: '10/04/2025',
    details: [
      'Integrated Access Control functionality directly within the Security Check screen on the Main Menu for easier access.',
      'Enabled Access Control handling during Scan and Test flows for a seamless experience.',
    ],
  },
  {
    title: 'Version 14(2.11.0)',
    releaseDate: '07/04/2025',
    details: [
      'Introduced a new Access Control section within the app.',
      'Added dedicated pages for managing access control.',
      'Integrated backend rendering for access control pages.',
      'Implemented CMD + Back functionality for smooth navigation.',
    ],
  },
  {
    title: 'Version 13(2.10.0)',
    releaseDate: '20/03/2025',
    details: [
      'Added Escalation screens, integrated APIs, and tested the app.',
      'Handeled order history, print a new label and reprint label.',
      'Handeled CMD.BACK over escalation',
    ],
  },
  {
    title: 'Version 12(2.9.0)',
    releaseDate: '03/03/2025',
    details: [
      'Added Carton Builder screens, integrated APIs, and tested the app.',
      'Implemented a Cancel Button in the Carton Builder.',
      'Created RTS Screens (Unserialized & Sterilized Orders), tested them, and enabled order returns.',
      'Performed thorough app testing for stability and performance.',
    ],
  },
  {
    title: 'Version 11(2.8.0)',
    releaseDate: '11/02/2025',
    details: [
      'Added Pallet Builder screen for efficient pallet management.',
      'Covered all possible use cases for a seamless experience.',
      'Tested with multiple pallets and cartons for stability.',
      'Improved performance and reliability across the app.',
    ],
  },
  {
    title: 'Version 10(2.7.0)',
    releaseDate: '30/01/2025',
    details: [
      'Inventory control security check completed with screen, API integration, and testing.',
      'Improved location & partner modal by handling non-searchable items and clearing search on close.',
      'Various UI fixes for a smoother experience.',
      'Implemented global error processing in Saga for better stability.',
      'Added Azure login option to select a new or changed account.',
    ],
  },
  {
    title: 'Version 9(2.6.0)',
    releaseDate: '30/11/2024',
    details: [
      'Added logo to authorized screens for enhanced branding.',
      'Implemented global loader for consistent user feedback during loading.',
      'Fixed back action logic on the Scan screen to prevent app crashes.',
      'Added Replenishment screen with all buttons and tested functionality, including access from the Scan CMD section.',
      'Introduced Item Info screen with full testing of nested screens and added it to the Scan CMD section.',
    ],
  },
  {
    title: 'Version 8(2.5.0)',
    releaseDate: '15/11/2024',
    details: [
      'Implemented reusable button components for all button screens, improving code maintainability and consistency',
      'Enhanced the back action handling by updating it to work seamlessly on the root level',
      'Added back navigation functionality via barcode scanning, ensuring smooth user interactions',
      'Developed the Cross Dock Screen, incorporating all relevant use cases to streamline operations',
      'Introduced the Google Goods-In Screen with full functionality for optimized workflow management',
    ],
  },
  {
    title: 'Version 7(2.4.0)',
    releaseDate: '05/11/2024',
    details: [
      'Added a Versioning screen to track all app versions in one place.',
      'Developed new screens for Cross Dock and Google Goods-In, optimizing the goods-in process.',
      'Updated the scan API to support both new screens, ensuring seamless integration and functionality.',
      'Resolved issue with page name retrieval in barcode scans due to URL splitting.',
      'Fixed lifecycle and action-calling issues for seamless navigation, aligning it with custom back button behavior.',
      'Added functionality to log docks on the Dock-to-Stock screen with API integration.',
    ],
  },
  {
    title: 'Version 6(2.3.0)',
    releaseDate: '31/10/2024',
    details: [
      'Created a new screen with a searchable list and barcode-based search',
      "Customized mobile's default back button for consistent functionality",
      'Clears global states on session timeout and logout',
    ],
  },
  {
    title: 'Version 5(2.2.0)',
    releaseDate: '22/10/2024',
    details: [
      'Added support for nested screens for smoother navigation',
      'Improved error handling with detailed status information',
      'Displayed last logged-in user on the login screen with easy logout',
      'Integrated Welcome API and Azure login for a seamless start',
      'Enhanced barcode detail screen with improved routing',
    ],
  },
  {
    title: 'Version 4(2.1.0)',
    releaseDate: '14/10/2024',
    details: [
      'Enhanced security with Azure AD login timeout',
      'Barcode scanning functionality for quick information access',
      'Manual barcode entry option for retrieving item details',
    ],
  },
  {
    title: 'Version 3(2.0.1)',
    releaseDate: '04/10/2024',
    details: [
      'Fix the App Active/Non Active state',
      'Fix colors discrepancy while on Dark mode',
      'Fix login screen UI bug',
    ],
  },
  {
    title: 'Version 2(2.0)',
    releaseDate: '03/10/2024',
    details: ['Azure Authentication', 'Lock screen on Timeout'],
  },
  {
    title: 'Version 1(1.0)',
    releaseDate: '25/09/2024',
    details: [
      'User login screen with secure access',
      'PIN change feature for added security',
      'Home page for quick navigation',
      'Barcode input field with auto-focus for easy scanning',
      'Integrated APIs for smooth data flow',
      'Stable performance with global state management using Redux',
    ],
  },
];
