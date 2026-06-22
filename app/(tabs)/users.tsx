import { API_URL } from "@/constants/api";
import { AuthContext } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Text, Title } from "react-native-paper";

export default function Users() {
  const { user } = useContext(AuthContext);
  const { sessions } = useData();
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/users`
      );

      const data = await response.json();

      setAllUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const acceptedSessions = sessions.filter(
    (s) =>
      s.status === "confirmed" &&
      (s.tutorId === user?.id ||
        s.learnerId === user?.id)
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (acceptedSessions.length === 0) {
    return (
      <View style={styles.center}>
        <Title>No Accepted Sessions</Title>
        <Text>
          Once a session is accepted,
          chat will become available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>
        Your Chats
      </Title>

      <FlatList
        data={acceptedSessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const receiverId =
            item.tutorId === user?.id
              ? item.learnerId
              : item.tutorId;

          const receiver =
            allUsers.find(
              (u) => u._id === receiverId
            );

          const receiverName =
            receiver?.name || "Chat User";

          return (
            <TouchableOpacity
              onPress={() =>
                router.push({
  pathname: "/chat-room",
  params: {
    receiverId,
    receiverName,
    sessionId: item.id,
  },
})
              }
            >
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium">
                    {receiverName}
                  </Text>

                  <Text>
                    Status: {item.status}
                  </Text>

                  <Text>
                    {new Date(
                      item.scheduledAt
                    ).toLocaleDateString()}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    marginBottom: 10,
  },
});