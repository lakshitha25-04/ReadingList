import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BadgesScreen, HomeScreen, ProfileScreen, ReadingQueueScreen } from '../screens/AppScreens';
const Tab = createBottomTabNavigator();
const icons: Record<string, any> = { Home: 'home', Reading: 'book', Badges: 'ribbon', Profile: 'happy' };
export function KidsTabNavigator() { return <Tab.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarStyle: { height: 72 }, tabBarLabelStyle: { fontSize: 12, fontWeight: '800' }, tabBarIcon: ({ color }) => <Ionicons name={icons[route.name]} size={29} color={color} /> })}><Tab.Screen name="Home" component={HomeScreen} options={({ navigation }: any) => ({ headerShown: true, title: 'ReadingList', headerRight: () => <Ionicons name="add-circle" size={32} color="#5B4CC4" onPress={() => navigation.getParent()?.navigate('AddBook')} /> })} /><Tab.Screen name="Reading" component={ReadingQueueScreen} /><Tab.Screen name="Badges" component={BadgesScreen} /><Tab.Screen name="Profile" component={ProfileScreen} /></Tab.Navigator>; }
