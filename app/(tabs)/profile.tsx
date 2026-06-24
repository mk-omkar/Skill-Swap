import { API_URL } from "@/constants/api";
import { AuthContext } from "@/contexts/auth-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Modal, Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Text,
  TextInput,
  Title,
} from "react-native-paper";

export default function Profile() {
  const { user, signOut, updateProfile } = useContext(AuthContext);
  const router = useRouter();
  const [
  postsModalVisible,
  setPostsModalVisible,
] = useState(false);

const [
  bookingsModalVisible,
  setBookingsModalVisible,
] = useState(false);

  const [myBookings, setMyBookings] = useState<any[]>([]);

  const [requests, setRequests] = useState<any[]>([]);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  useEffect(() => {
    if (user) {
      fetchMyPosts();
      fetchRequests();
      fetchBookings();
    }
  }, [user]);

  const fetchMyPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/skills/tutor/${user?.id}`);

      const skills = await response.json();

      setMyPosts(skills);
    } catch (error) {
      console.log(error);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [editSkills, setEditSkills] = useState(user?.skills?.join(", ") || "");

    const fetchBookings = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/bookings/learner/${user?.id}`,
      );

      const data = await response.json();

      setMyBookings(data);
    } catch (error) {
      console.log(error);
    }
  };
useEffect(() => {
  if (user) {
    setEditName(user.name || "");
    setEditBio(user.bio || "");
    setEditSkills(user.skills?.join(", ") || "");
  }
}, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your profile</Text>
      </View>
    );
  }

const latestBooking =
  myBookings.length > 0
    ? myBookings[0]
    : null;

const latestOffer =
  myPosts.length > 0
    ? myPosts[0]
    : null;

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/tutor/${user?.id}`);

      const data = await response.json();

      setRequests(data.filter((b: any) => b.status === "requested"));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: editName,
        bio: editBio,
       skillsOffered: editSkills
  .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      });

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const rejectSession = async (
  bookingId: string
) => {
  try {
    await fetch(
      `${API_URL}/api/bookings/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
        }),
      }
    );

    fetchRequests();
  } catch (error) {
    console.log(error);
  }
};

  const acceptSession = async (bookingId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
        }),
      });

      if (!response.ok) {
        Alert.alert("Error", "Failed to accept request");
        return;
      }

      Alert.alert("Success", "Request accepted");

      fetchRequests();
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* HEADER */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={70}
            label={user.name ? user.name.charAt(0) : "U"}
            labelStyle={{ color: "#2563eb", fontWeight: "700" }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.profileName} numberOfLines={1}>
            {user.name}
          </Text>

          {/* Correctly reading user.email natively */}
          <Text style={styles.emailText} numberOfLines={1}>
            {user.email || "no-email@domain.com"}
          </Text>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={22}
            color="#2563eb"
          />
          <Text style={styles.statValue}>{myPosts.length}</Text>
          <Text style={styles.statLabel}>Skills Offered</Text>
        </View>

        <View style={styles.statBox}>
          <MaterialCommunityIcons
            name="calendar-check"
            size={22}
            color="#2563eb"
          />
          <Text style={styles.statValue}>{user.totalSessions || 0}</Text>
          <Text style={styles.statLabel}>Sessions Done</Text>
        </View>

        <View style={styles.statBox}>
          <MaterialCommunityIcons
            name="star-outline"
            size={22}
            color="#8b5cf6"
          />
          <Text style={styles.statValue}>{requests.length}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
      </View>

      {/* ABOUT ME */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>About Me</Title>

            <Button compact onPress={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </View>

          {!isEditing ? (
            <>
              <Text style={styles.bio}>{user.bio || "No bio added yet"}</Text>

              <View style={styles.skillsContainer}>
                {user.skills &&
                  user.skills.map((skill, index) => (
                    <Chip key={index} style={styles.skillChip}>
                      {skill}
                    </Chip>
                  ))}
              </View>
            </>
          ) : (
            <>
              <TextInput
                label="Full Name"
                value={editName}
                onChangeText={setEditName}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Bio"
                value={editBio}
                onChangeText={setEditBio}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Skills"
                value={editSkills}
                onChangeText={setEditSkills}
                mode="outlined"
                style={styles.input}
              />

              <Button
                mode="contained"
                onPress={handleSaveProfile}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
            </>
          )}
        </Card.Content>
      </Card>

      {/* REQUESTS */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Requests</Title>

          {requests.length === 0 ? (
            <Text style={styles.emptyText}>No pending requests</Text>
          ) : (
            requests.map((session) => (
  <View
    key={session._id}
    style={styles.postCard}
  >
    <Text style={styles.offerTitle}>
      {session.learnerName}
    </Text>

    <Text>
      Wants: {session.offerTitle}
    </Text>

    <Text>
      Offers: {session.offeredSkill}
    </Text>

    <Text>
      Message:
      {" "}
      {session.notes ||
        "No message"}
    </Text>

   <View style={styles.requestButtonRow}>
  <Button
    mode="contained"
    style={styles.acceptButton}
    onPress={() =>
      acceptSession(session._id)
    }
  >
    Accept
  </Button>

  <Button
    mode="outlined"
    textColor="#ef4444"
    style={styles.rejectButton}
    onPress={() =>
      rejectSession(session._id)
    }
  >
    Reject
  </Button>
</View>
  </View>
))
          )}
        </Card.Content>
      </Card>

      {/* MY POSTS */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
  <Title style={styles.sectionTitle}>
    My Posts
  </Title>

  <Button
    compact
    onPress={() =>
      setPostsModalVisible(true)
    }
  >
    See All
  </Button>
</View>

          {!latestOffer ? (
            <Text style={styles.emptyText}>No posts yet</Text>
          ) : (
           <View style={styles.postCard}>
  <Text style={styles.offerTitle}>
    {latestOffer.title}
  </Text>

  <Text
    style={{
      color: "#64748b",
      marginBottom: 10,
    }}
  >
    {latestOffer.description}
  </Text>

  <Text>
    Category:
    {" "}
    {latestOffer.category}
  </Text>

  <Text>
    Level:
    {" "}
    {latestOffer.level}
  </Text>

  <Text>
    Duration:
    {" "}
    {latestOffer.durationType}
  </Text>

  <Text>
    Time:
    {" "}
    {latestOffer.startTime}
    {" - "}
    {latestOffer.endTime}
  </Text>
</View>
          )}
        </Card.Content>
      </Card>

      {/* MY BOOKINGS */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
  <Title style={styles.sectionTitle}>
    My Bookings
  </Title>

  <Button
    compact
    onPress={() =>
      setBookingsModalVisible(true)
    }
  >
    See All
  </Button>
</View>

          {myBookings.length > 0 ? (
            latestBooking && (
              <View style={styles.postCard}>
  <Text style={styles.offerTitle}>
    {latestBooking.offerTitle}
  </Text>

  <Text>
    Tutor:
    {" "}
    {latestBooking.tutorName}
  </Text>

  <Text>
    Skill Offered:
    {" "}
    {latestBooking.offeredSkill}
  </Text>

  <Text>
    Status:
    {" "}
    {latestBooking.status}
  </Text>
</View>
            )
          ) : (
            <Text>No bookings yet</Text>
          )}
        </Card.Content>
      </Card>

      {/* SIGN OUT */}
      <Button
        mode="contained"
        buttonColor="#ef4444"
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        Sign Out
      </Button>
      <Modal
  visible={postsModalVisible}
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>

      <Text style={styles.modalTitle}>
        My Posts
      </Text>

      <ScrollView>
        {myPosts.map((post) => (
  <View
    key={post._id}
    style={styles.modalPostCard}
  >
    <Text style={styles.offerTitle}>
      {post.title}
    </Text>

    <Text
      style={{
        color: "#64748b",
        marginBottom: 10,
      }}
    >
      {post.description}
    </Text>

    <Text>
      Category: {post.category}
    </Text>

    <Text>
      Level: {post.level}
    </Text>

    <Text>
      Duration: {post.durationType}
    </Text>

    <Text>
      Time:
      {" "}
      {post.startTime}
      {" - "}
      {post.endTime}
    </Text>

    <Text
      style={{
        marginTop: 10,
        fontWeight: "700",
      }}
    >
      Available Days
    </Text>

    <View style={styles.chipContainer}>
      {post.availableSlots?.map(
        (day: string, index: number) => (
          <Chip
            key={index}
            compact
            style={styles.dayChip}
          >
            {day}
          </Chip>
        )
      )}
    </View>

    <Text
      style={{
        marginTop: 10,
        fontWeight: "700",
      }}
    >
      Skills Wanted
    </Text>

    <View style={styles.chipContainer}>
      {post.skillsWanted?.map(
        (skill: string, index: number) => (
          <Chip
            key={index}
            compact
            style={styles.skillChip}
          >
            {skill}
          </Chip>
        )
      )}
    </View>
  </View>
))}
      </ScrollView>

      <Button
        onPress={() =>
          setPostsModalVisible(false)
        }
      >
        Close
      </Button>

    </View>
  </View>
</Modal>
<Modal
  visible={bookingsModalVisible}
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>

      <Text style={styles.modalTitle}>
        My Bookings
      </Text>

      <ScrollView>
        {myBookings.map((booking) => (
  <View
    key={booking._id}
    style={styles.modalPostCard}
  >
    <Text style={styles.offerTitle}>
      {booking.offerTitle}
    </Text>

    <Text>
      Tutor: {booking.tutorName}
    </Text>

    <Text>
      Your Offered Skill:
      {" "}
      {booking.offeredSkill}
    </Text>

    <Text>
      Your Message:
      {" "}
      {booking.notes || "No message"}
    </Text>

    <Text
      style={{
        color:
          booking.status === "accepted"
            ? "green"
            : booking.status === "rejected"
            ? "red"
            : "#f59e0b",
        fontWeight: "700",
        marginTop: 8,
      }}
    >
      Status:
      {" "}
      {booking.status.toUpperCase()}
    </Text>
  </View>
))}
      </ScrollView>

      <Button
        onPress={() =>
          setBookingsModalVisible(false)
        }
      >
        Close
      </Button>

    </View>
  </View>
</Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerCard: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarContainer: {
    marginRight: 16,
  },
  modalPostCard: {
  backgroundColor: "#f8fafc",
  borderRadius: 16,
  padding: 15,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: "#e2e8f0",
},
  avatar: {
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  emailText: {
    color: "#bfdbfe",
    fontSize: 14,
    marginTop: 2,
  },
  headerBio: {
    color: "#ffffff",
    fontSize: 13,
    marginTop: 6,
    opacity: 0.9,
  },
  statsCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: -25,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
    textAlign: "center",
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  bio: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  skillChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f1f5f9",
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
  postCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  offerRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  offerImage: {
    width: 80,
    height: 80,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    marginRight: 12,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
    paddingVertical: 8,
  },
  signOutButton: {
    margin: 16,
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 4,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  padding: 20,
},

modalContent: {
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 20,
  maxHeight: "80%",
},

modalTitle: {
  fontSize: 22,
  fontWeight: "700",
  marginBottom: 15,
},
requestButtonRow: {
  flexDirection: "row",
  gap: 10,
  marginTop: 12,
},

acceptButton: {
  flex: 1,
  borderRadius: 12,
},

rejectButton: {
  flex: 1,
  borderRadius: 12,
  borderColor: "#ef4444",
},
});
