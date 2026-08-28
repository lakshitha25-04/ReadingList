import { createDrawerNavigator } from '@react-navigation/drawer';
import { AdultTabNavigator } from './AdultTabNavigator';
import { LogoutScreen, PlaceholderScreen } from '../screens/AppScreens';
import { ProfileEditForm, ReadingPreferencesForm } from '../screens/FormsScreens';
const Drawer = createDrawerNavigator();
export function DrawerNavigator() { return <Drawer.Navigator screenOptions={{ headerShown: false }}><Drawer.Screen name="AdultTabs" component={AdultTabNavigator} options={{ title: 'Home' }} /><Drawer.Screen name="Finished Books" component={PlaceholderScreen} /><Drawer.Screen name="Favourite Genres" component={PlaceholderScreen} /><Drawer.Screen name="Reading Goals" component={ReadingPreferencesForm} /><Drawer.Screen name="Parent Dashboard" component={PlaceholderScreen} /><Drawer.Screen name="Settings" component={ProfileEditForm} /><Drawer.Screen name="Help & Support" component={PlaceholderScreen} /><Drawer.Screen name="Logout" component={LogoutScreen} /></Drawer.Navigator>; }
