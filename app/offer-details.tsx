import { AuthContext } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, IconButton, Text, Title } from 'react-native-paper';

export default function OfferDetails() {
  const { offers, addReport, deleteOffer } = useData();
  const { user } = useContext(AuthContext);
  const { offerId } = useLocalSearchParams();
  const router = useRouter();

  const offer = offers.find(o => o.id === offerId);
  if (!offer) {
    return (
      <View style={styles.container}>
        <Text>Offer not found</Text>
      </View>
    );
  }

  const canDelete = user && (user.role === 'admin' || user.id === offer.tutorId);

  const handleReport = async () => {
    if (!user) return;
    await addReport({
      reporterId: user.id,
      targetId: offer.id,
      type: 'offer',
      reason: 'Inappropriate content',
      description: 'Reported by user via details screen',
      status: 'pending',
    });
    Alert.alert('Reported', 'Thank you for your report. Our team will review it.');
  };

  const handleDelete = async () => {
    Alert.alert('Delete Offer', 'Are you sure you want to delete this offer?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteOffer(offer.id);
        router.back();
      }}
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ position: 'absolute', right: 8, top: 8 }}>
            <IconButton icon="share-variant" onPress={() => {}} accessibilityLabel="Share" />
          </View>
          <Title style={styles.title}>{offer.title}</Title>
          <Text style={styles.tutor}>By {offer.tutorId}</Text>
          <Text style={styles.description}>{offer.description}</Text>
          <View style={styles.row}>
            <Chip style={styles.chip} mode="outlined">{offer.category}</Chip>
            <Chip style={styles.chip} mode="outlined">{offer.duration} min</Chip>
            <Chip style={styles.chip} mode="outlined">⭐ {offer.rating.toFixed(1)}</Chip>
          </View>
          <Text style={styles.sessions}>Available sessions: {offer.availableSessions}</Text>
        </Card.Content>
        <Card.Actions>
  <Button
    mode="contained"
    onPress={() =>
      router.push({
        pathname: '/book-session',
        params: {
          offerId: offer.id,
        },
      })
    }
  >
    Book Session
  </Button>

  <Button
    mode="outlined"
    onPress={() =>
      router.push({
        pathname: '/chat',
        params: {
          receiverId: offer.tutorId,
          receiverName: offer.title,
        },
      })
    }
  >
    Chat Tutor
  </Button>

  <Button
    mode="outlined"
    onPress={handleReport}
  >
    Report
  </Button>

  {canDelete && (
    <Button
      textColor="#d32f2f"
      onPress={handleDelete}
    >
      Delete
    </Button>
  )}
</Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { margin: 16, elevation: 2 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  tutor: { fontSize: 14, color: '#666', marginBottom: 12 },
  description: { fontSize: 14, color: '#333', marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 8 },
  chip: { marginRight: 8 },
  sessions: { fontSize: 12, color: '#666' },
});


