import { API_URL } from "@/constants/api";
import { useData } from '@/contexts/data-context';
import { AuthContext } from "@/contexts/auth-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Linking,
} from "react-native";
import {
  Button,
  Card,
  Text,
  TextInput,
  Title,
  Portal,
  Dialog,
} from "react-native-paper";

export default function ChatRoom() {
  const { user } = useContext(AuthContext);
  const { sessions, updateSession } = useData();
  const router = useRouter();

  const { receiverId, receiverName, sessionId } =
  useLocalSearchParams();
  console.log("SESSION ID:", sessionId);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [meetVisible, setMeetVisible] = useState(false);
const [meetLink, setMeetLink] = useState("");

  const senderId = user?.id;

  const loadMessages = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/chat/${senderId}/${receiverId}`,
      );

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setLoading(true);

      await fetch(`${API_URL}/api/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          message: newMessage,
        }),
      });

      setNewMessage("");

      loadMessages();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
const shareMeetLink = async () => {
  if (!meetLink.trim()) {
    Alert.alert("Enter a Google Meet link");
    return;
  }

  try {
    await fetch(`${API_URL}/api/chat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId,
        receiverId,
        message: `MEET_LINK:${meetLink}`,
      }),
    });

    setMeetLink("");
    setMeetVisible(false);

    loadMessages();
  } catch (error) {
    console.log(error);
  }
};
const endSession = async () => {
  console.log("sessionId =", sessionId);

  if (!sessionId) {
    Alert.alert("Error", "Session ID missing");
    return;
  }

  try {
    await updateSession(String(sessionId), {
      status: "completed",
    });

    Alert.alert("Success", "Session completed");

    router.replace("/chat");
  } catch (err) {
    console.log(err);
    Alert.alert("Error", "Could not complete session");
  }
};
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.headerRow}>
        <Title style={styles.header}>{receiverName}</Title>
        <Button
  mode="outlined"
  onPress={() => setMeetVisible(true)}
>
  Share Meet Link
</Button>

        <Button
  mode="text"
  textColor="red"
  onPress={endSession}
>
  End
</Button>

      </View>
<View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
  <Button
    mode="contained-tonal"
    onPress={async () => {
      try {
        await fetch(`${API_URL}/api/chat/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId,
            receiverId,
            message:
              "📧 For a better experience, please share your email and continue the session on Google Meet.",
          }),
        });

        loadMessages();
      } catch (error) {
        console.log(error);
      }
    }}
  >
    Share Google Meet Request
  </Button>
</View>
<Portal>
  <Dialog
    visible={meetVisible}
    onDismiss={() => setMeetVisible(false)}
  >
    <Dialog.Title>Share Google Meet Link</Dialog.Title>

    <Dialog.Content>
      <TextInput
        mode="outlined"
        placeholder="https://meet.google.com/..."
        value={meetLink}
        onChangeText={setMeetLink}
      />
    </Dialog.Content>

    <Dialog.Actions>
      <Button onPress={() => setMeetVisible(false)}>
        Cancel
      </Button>

      <Button onPress={shareMeetLink}>
        Send
      </Button>
    </Dialog.Actions>
  </Dialog>
</Portal>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          padding: 10,
        }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.senderId === senderId
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            {item.message?.startsWith("MEET_LINK:") ? (
  <View>
  <Text
    style={{
      fontSize: 12,
      marginBottom: 5,
      color: "#000000",
    }}
  >
    Google Meet Invitation
  </Text>

  <Text
    style={{
      color: "#000000",
      textDecorationLine: "underline",
      fontWeight: "bold",
    }}
    onPress={() =>
      Linking.openURL(
        item.message.replace("MEET_LINK:", "")
      )
    }
  >
    🎥 Click Here To Join Meeting
  </Text>
</View>
) : (
  <Text
    style={
      item.senderId === senderId
        ? styles.myText
        : styles.otherText
    }
  >
    {item.message}
  </Text>
)}
          </View>
        )}
      />

      <Card style={styles.inputCard}>
        <Card.Content>
          <TextInput
            mode="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            style={{
              marginBottom: 10,
            }}
          />

          <Button mode="contained" onPress={sendMessage} loading={loading}>
            Send
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },

  header: {
    marginVertical: 15,
  },

  message: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "80%",
  },

  myMessage: {
    backgroundColor: "#2563eb",
    alignSelf: "flex-end",
  },

  otherMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },

  myText: {
    color: "#fff",
  },

  otherText: {
    color: "#000",
  },

  inputCard: {
    margin: 10,
  },
});
