import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen, ProfileScreen, ReadingQueueScreen, SearchScreen, StatsScreen } from '../screens/AppScreens';
const Tab = createBottomTabNavigator();
const icons: Record<string, any> = { Home: 'home', Search: 'search', Reading: 'book', Stats: 'stats-chart', Profile: 'person' };
export function AdultTabNavigator() { return <Tab.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} size={size} color={color} /> })}><Tab.Screen name="Home" component={HomeScreen} options={({ navigation }: any) => ({ headerShown: true, title: 'ReadingList', headerRight: () => <Ionicons name="add-circle" size={28} color="#314B64" onPress={() => navigation.getParent()?.getParent()?.navigate('AddBook')} /> })} /><Tab.Screen name="Search" component={SearchScreen} /><Tab.Screen name="Reading" component={ReadingQueueScreen} /><Tab.Screen name="Stats" component={StatsScreen} /><Tab.Screen name="Profile" component={ProfileScreen} /></Tab.Navigator>; }
