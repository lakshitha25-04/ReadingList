import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerNavigator } from './DrawerNavigator';
import { KidsTabNavigator } from './KidsTabNavigator';
import { LoginScreen, ModeSelectScreen, PolishedBookDetailsScreen, ReadingQueueScreen, ProfileScreen, SplashScreen } from '../screens/AppScreens';
import { RegistrationForm } from '../screens/FormsScreens';
import { UploadBookForm } from '../screens/UploadBookForm';
const Stack = createNativeStackNavigator();
export function RootNavigator() { return <NavigationContainer><Stack.Navigator screenOptions={{ headerShown: false }}><Stack.Screen name="Splash" component={SplashScreen} /><Stack.Screen name="Login" component={LoginScreen} /><Stack.Screen name="Register" component={RegistrationForm} /><Stack.Screen name="ModeSelect" component={ModeSelectScreen} /><Stack.Screen name="AdultArea" component={DrawerNavigator} /><Stack.Screen name="KidsTabs" component={KidsTabNavigator} /><Stack.Screen name="AddBook" component={UploadBookForm} /><Stack.Screen name="BookDetails" component={PolishedBookDetailsScreen} /><Stack.Screen name="ReadingQueue" component={ReadingQueueScreen} /><Stack.Screen name="Profile" component={ProfileScreen} /></Stack.Navigator></NavigationContainer>; }
