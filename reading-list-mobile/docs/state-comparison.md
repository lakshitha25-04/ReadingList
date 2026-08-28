# State management choices

- **useState/useEffect:** Screen-local input, selected genre, the one-time Home welcome message, and Splash's 1.5-second transition are local UI concerns. Effects also watch Redux queue entries and log status changes.
- **Context API:** `UserContext` shares the signed-in profile and current Adult/Kids mode. `ReadingListContext` shares sample books, search/filter values, and book update actions without prop drilling.
- **Redux Toolkit:** `librarySlice` owns durable library state (statuses, current pages, favourites). `gamificationSlice` owns cross-screen streak and badge rewards. Queue, Profile, and Badges use selectors/dispatch-backed context actions.
