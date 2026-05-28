import { AuthContext } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import { useRouter } from 'expo-router';
import React, { useContext, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';
import { Badge, Button, Card, Chip, FAB, IconButton, Searchbar, Text, Title } from 'react-native-paper';

const CATEGORIES = ['All', 'Programming', 'Music', 'Art', 'Fitness', 'Language', 'Business'];

export default function HomeScreen() {
  const { offers, searchOffers, sessions } = useData();
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const router = useRouter();

  const notificationCount = useMemo(() => {
    if (!user) return 0;
    return sessions.filter(session =>
      (session.learnerId === user.id || session.tutorId === user.id) &&
      session.status !== 'completed' &&
      session.status !== 'cancelled'
    ).length;
  }, [sessions, user]);

  const handleNotificationsPress = async () => {
    setNotificationsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 900));
    setNotificationsLoading(false);
    Alert.alert('Notifications', 'You have ' + notificationCount + ' booked session(s).');
  };

  const filteredOffers = useMemo(() => {
    let filtered = offers;
    
    if (searchQuery.trim()) {
      filtered = searchOffers(searchQuery, selectedCategory === 'All' ? undefined : selectedCategory);
    } else if (selectedCategory !== 'All') {
      filtered = offers.filter(offer => offer.category === selectedCategory);
    }
    
    return filtered;
  }, [offers, searchQuery, selectedCategory, searchOffers]);

  const renderOffer = ({ item }: { item: any }) => (
    <Card style={styles.offerCard} mode="elevated">
      <Card.Content>
        <Title style={styles.offerTitle}>{item.title}</Title>
        <Text style={styles.tutorName}>By {item.tutorId}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.offerFooter}>
          <Chip mode="outlined" style={styles.categoryChip}>
            {item.category}
          </Chip>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
            <Text style={styles.sessions}>{item.availableSessions} sessions left</Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" compact onPress={() => router.push({ pathname: '/offer-details', params: { offerId: item.id } })}>
          View Details
        </Button>
        <Button mode="contained" compact onPress={() => router.push({ pathname: '/book-session', params: { offerId: item.id } })}>
          Book Session
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Title style={styles.headerTitle}>Discover Skills</Title>
          <View style={styles.notificationContainer}>
            <IconButton
              icon={notificationsLoading ? () => <ActivityIndicator animating color="#2563eb" size="small" /> : 'bell-outline'}
              onPress={handleNotificationsPress}
              disabled={notificationsLoading}
              accessibilityLabel="Notifications"
            />
            {notificationCount > 0 && (
              <Badge style={styles.notificationBadge} size={18}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </Badge>
            )}
          </View>
        </View>
        <Searchbar
          placeholder="Search skills..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              mode={selectedCategory === item ? 'flat' : 'outlined'}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={styles.categoryChip}
            >
              {item}
            </Chip>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      <FlatList
        data={filteredOffers}
        keyExtractor={(item) => item.id}
        renderItem={renderOffer}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/create-post')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 16, elevation: 2 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#2563eb' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  searchbar: { marginBottom: 16 },
  categoriesContainer: { paddingVertical: 8 },
  categoryChip: { marginRight: 8 },
  listContainer: { padding: 16 },
  offerCard: { marginBottom: 16, elevation: 2 },
  offerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  tutorName: { fontSize: 14, color: '#666', marginBottom: 8 },
  description: { fontSize: 14, color: '#333', marginBottom: 12 },
  offerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingContainer: { alignItems: 'flex-end' },
  rating: { fontSize: 14, fontWeight: 'bold', color: '#ff9800' },
  sessions: { fontSize: 12, color: '#666' },
  notificationContainer: { position: 'relative' },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#d32f2f',
    color: '#fff',
    fontSize: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});
