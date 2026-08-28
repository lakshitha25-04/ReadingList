import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { ReadingListProvider } from './context/ReadingListContext';
import { UserProvider } from './context/UserContext';
import { RootNavigator } from './navigation/RootNavigator';
import { store } from './store';

export default function App() {
  return <GestureHandlerRootView style={{ flex: 1 }}><Provider store={store}><UserProvider><ReadingListProvider><RootNavigator /></ReadingListProvider></UserProvider></Provider></GestureHandlerRootView>;
}
