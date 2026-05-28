import { AuthContext } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Chip, Text, TextInput, Title } from 'react-native-paper';

export default function Profile() {
  const { user, signOut, updateProfile } = useContext(AuthContext);
  const { getUserOffers, getUserSessions, getUserReviews } = useData();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editSkills, setEditSkills] = useState(user?.skills.join(', ') || '');

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your profile</Text>
      </View>
    );
  }

  const userOffers = getUserOffers(user.id);
  const userSessions = getUserSessions(user.id);
  const userReviews = getUserReviews(user.id);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        bio: editBio,
        skills: editSkills.split(',').map(s => s.trim()).filter(s => s),
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: async () => {
          await signOut();
          router.replace('/login');
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={user.name.charAt(0).toUpperCase()} 
            style={styles.avatar}
          />
          <Title style={styles.name}>{user.name}</Title>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userOffers.length}</Text>
              <Text style={styles.statLabel}>Offers</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>About</Title>
            <Button 
              mode="text" 
              onPress={() => setIsEditing(!isEditing)}
              compact
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </View>
          
          {isEditing ? (
            <View>
              <TextInput
                label="Bio"
                value={editBio}
                onChangeText={setEditBio}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
              />
              <TextInput
                label="Skills (comma separated)"
                value={editSkills}
                onChangeText={setEditSkills}
                style={styles.input}
                mode="outlined"
                placeholder="React Native, Guitar, Photography"
              />
              <Button 
                mode="contained" 
                onPress={handleSaveProfile}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
            </View>
          ) : (
            <View>
              <Text style={styles.bio}>{user.bio || 'No bio yet'}</Text>
              <View style={styles.skillsContainer}>
                {user.skills.map((skill, index) => (
                  <Chip key={index} style={styles.skillChip} mode="outlined">
                    {skill}
                  </Chip>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Incoming Video Calls</Title>
          <Button
            mode="contained"
            onPress={() => router.push('/incoming-calls')}
            style={styles.incomingCallsButton}
            icon="phone-incoming"
          >
            View Incoming Calls ({userSessions.filter(s => s.status === 'requested' && s.tutorId === user.id).length})
          </Button>
          <Text style={styles.callHelpText}>
            Accept video call requests from learners who have booked your sessions.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>My Offers</Title>
          {userOffers.length > 0 ? (
            userOffers.map((offer) => (
              <View key={offer.id} style={styles.offerItem}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerCategory}>{offer.category}</Text>
                <Text style={styles.offerDescription}>{offer.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No offers created yet</Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>My Sessions</Title>
          {userSessions.length > 0 ? (
            userSessions.map((session) => (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionStatus}>{session.status.toUpperCase()}</Text>
                  <Text style={styles.sessionDate}>
                    {new Date(session.scheduledAt).toLocaleDateString()}
                  </Text>
                </View>
                <Button
                  mode="contained"
                  compact
                  onPress={() => router.push({
                    pathname: '/session-details',
                    params: { sessionId: session.id }
                  })}
                  style={styles.sessionButton}
                >
                  Video Call
                </Button>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No sessions yet</Text>
          )}
        </Card.Content>
      </Card>

      <Button 
        mode="outlined" 
        onPress={handleSignOut}
        style={styles.signOutButton}
        textColor="#d32f2f"
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  profileCard: { margin: 16, elevation: 4 },
  profileContent: { alignItems: 'center', padding: 20 },
  avatar: { marginBottom: 16, backgroundColor: '#2563eb' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 16, color: '#666', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#2563eb' },
  statLabel: { fontSize: 12, color: '#666' },
  sectionCard: { margin: 16, marginTop: 0, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  bio: { fontSize: 14, color: '#333', marginBottom: 16, lineHeight: 20 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  skillChip: { marginRight: 8, marginBottom: 8 },
  input: { marginBottom: 16 },
  saveButton: { marginTop: 8 },
  offerItem: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  offerTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  offerCategory: { fontSize: 12, color: '#666', marginBottom: 4 },
  offerDescription: { fontSize: 14, color: '#333' },
  sessionItem: { marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, backgroundColor: '#fff', borderRadius: 8 },
  sessionInfo: { flex: 1 },
  sessionStatus: { fontSize: 14, fontWeight: 'bold', color: '#2563eb', marginBottom: 4 },
  sessionDate: { fontSize: 13, color: '#666' },
  sessionButton: { marginLeft: 12 },
  incomingCallsButton: { marginBottom: 12, paddingVertical: 8 },
  callHelpText: { fontSize: 12, color: '#666', marginTop: 8 },
  emptyText: { fontSize: 14, color: '#666', fontStyle: 'italic', textAlign: 'center', padding: 20 },
  signOutButton: { margin: 16, marginTop: 0 },
});
