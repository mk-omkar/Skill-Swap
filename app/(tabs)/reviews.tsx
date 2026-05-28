import { AuthContext } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import React, { useContext, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Button, Card, Text, TextInput, Title } from 'react-native-paper';

export default function Reviews() {
  const { reviews, addReview } = useData();
  const { user } = useContext(AuthContext);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const getReviewerName = (item: any) => {
    if (item.reviewerName) return item.reviewerName;
    if (user && item.reviewerId === user.id) return user.name;
    if (item.reviewerId) return item.reviewerId;
    return 'Guest Reviewer';
  };

  const handleSubmitReview = async () => {
    if (!newComment.trim()) {
      return;
    }

    setLoading(true);
    try {
      await addReview({
        sessionId: 'session_1', // This would come from a completed session
        reviewerId: user?.id || 'u1',
        reviewerName: user?.name || 'Guest Reviewer',
        revieweeId: 'u2', // This would be the tutor being reviewed
        rating: newRating,
        comment: newComment.trim(),
      });
      
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderReview = ({ item }: { item: any }) => (
    <Card style={styles.reviewCard}>
      <Card.Content>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>{getReviewerName(item)}</Text>
          <Text>{'⭐'.repeat(Math.round(item.rating))}</Text>
        </View>
        <Text style={styles.reviewComment}>{item.comment}</Text>
        <Text style={styles.reviewDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Reviews & Ratings</Title>
        
        <Card style={styles.newReviewCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Write a Review</Title>
            <Text style={styles.ratingLabel}>Rating: {newRating} ⭐</Text>
            <View style={{ flexDirection: 'row' }}>
              {[1,2,3,4,5].map(v => (
                <Button key={v} onPress={() => setNewRating(v)} compact>
                  {v}
                </Button>
              ))}
            </View>
            <TextInput
              label="Your Review"
              value={newComment}
              onChangeText={setNewComment}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Share your experience..."
            />
            <Button
              mode="contained"
              onPress={handleSubmitReview}
              loading={loading}
              disabled={loading || !newComment.trim()}
              style={styles.submitButton}
            >
              Submit Review
            </Button>
          </Card.Content>
        </Card>

        <Title style={styles.sectionTitle}>Recent Reviews</Title>
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          scrollEnabled={false}
          contentContainerStyle={styles.reviewsList}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#2563eb' },
  newReviewCard: { marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  ratingLabel: { fontSize: 14, marginBottom: 8, color: '#666' },
  input: { marginTop: 16, marginBottom: 16 },
  submitButton: { marginTop: 8 },
  reviewsList: { paddingBottom: 16 },
  reviewCard: { marginBottom: 12, elevation: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewerName: { fontSize: 14, fontWeight: 'bold' },
  reviewComment: { fontSize: 14, color: '#333', marginBottom: 8, lineHeight: 20 },
  reviewDate: { fontSize: 12, color: '#666' },
});
