import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { API_URL } from "@/constants/api";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { useRouter } from "expo-router";

const categories = [
  {
    name: "Programming",
    icon: "code-tags",
    color: "#3b82f6",
  },
  {
    name: "Design",
    icon: "palette",
    color: "#22c55e",
  },
  {
    name: "Marketing",
    icon: "bullhorn",
    color: "#8b5cf6",
  },
  {
    name: "Business",
    icon: "chart-line",
    color: "#f59e0b",
  },
  {
    name: "Language",
    icon: "book-open-page-variant",
    color: "#ef4444",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const { user } = useContext(AuthContext);

const [offers, setOffers] = useState([]);
useEffect(() => {
  fetchSkills();
}, []);

const fetchSkills = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/skills`
    );

    const data = await response.json();

    setOffers(data);
  } catch (error) {
    console.log(error);
  }
};

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const filteredOffers = useMemo(() => {
    let data = offers;

    if (selectedCategory) {
      data = data.filter(
        (item) =>
          item.category === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      data = data.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          item.description
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )
      );
    }

    return data;
  }, [
    offers,
    searchQuery,
    selectedCategory,
  ]);
  

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 16 }}>
  <Text
    style={styles.welcome}
    numberOfLines={2}
  >
            Welcome Back,{" "}{"\n"}
            {user?.name || "Learner"}! 👋
          </Text>

          <Text style={styles.subtitle}>
            Let's continue your learning
            journey today.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push("/profile")
          }
        >
          <View style={styles.profileCircle}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color="#3b82f6"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}

      <Searchbar
        placeholder="Search for skills, courses or topics..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {/* HERO BANNER */}

    <View style={styles.bannerContainer}>
  <Image
    source={require("../../assets/images/home-banner.png")}
    style={styles.bannerImage}
    resizeMode="cover"
  />
</View>

      {/* CATEGORIES */}

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>
          Categories
        </Text>

        <Text style={styles.seeAll}>
          See all
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        
  contentContainerStyle={styles.categoriesContainer}>
  {categories.map((item) => (
    <TouchableOpacity
      key={item.name}
      style={styles.categoryWrapper}
    >
      <View style={styles.categoryCard}>
        <MaterialCommunityIcons
          name={item.icon as any}
          size={28}
          color={item.color}
        />
      </View>

      <Text
        numberOfLines={1}
        style={styles.categoryText}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
          
        ))}
      </ScrollView>

      {/* RECOMMENDED */}

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>
          Recommended for You
        </Text>

        <Text style={styles.seeAll}>
          See all
        </Text>
      </View>

      {filteredOffers.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text
            style={styles.emptyText}
          >
            No skill posts yet.
          </Text>

          <Text
            style={
              styles.emptySubText
            }
          >
            Create your first skill
            offer.
          </Text>
        </View>
      ) : (
        filteredOffers.map((item) => {
          const categoryInfo =
            categories.find(
              (c) =>
                c.name ===
                item.category
            );

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.courseCard}
              onPress={() =>
                router.push({
                  pathname:
                    "/offer-details",
                  params: {
                    offerId:
                      item._id,
                  },
                })
              }
            >
              <View
                style={
                  styles.courseIconBox
                }
              >
                <MaterialCommunityIcons
                  name={
                    (categoryInfo?.icon ||
                      "book-open-page-variant") as any
                  }
                  size={50}
                  color={
                    categoryInfo?.color ||
                    "#3b82f6"
                  }
                />
              </View>

              <View
                style={
                  styles.courseContent
                }
              >
          <Text style={styles.courseTitle}>
            {item.title}
          </Text>

          <Text style={styles.tutorName}>
            By {item.tutorName}
          </Text>

          <Text
            style={styles.courseDescription}
            numberOfLines={2}
          >
            {item.description}
          </Text>

                <Text
                  style={
                    styles.learners
                  }
                >
                  ⭐{" "}
                  {item.rating.toFixed(
                    1
                  )}{" "}
                  •{" "}
                  {
                    item.totalBookings
                  }{" "}
                  learners
                </Text>
              </View>

              <MaterialCommunityIcons
                name="bookmark-outline"
                size={28}
                color="#64748b"
              />
            </TouchableOpacity>
          );
        })
      )}

      <View
        style={{ height: 40 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    paddingBottom: 90,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 18,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  welcomeContainer: {
    flex: 1,
    marginRight: 10,
  },

  welcome: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    marginTop: 22,
    lineHeight: 32,
    maxWidth: "85%",
  },
  tutorName: {
  fontSize: 12,
  color: "#64748b",
  marginBottom: 4,
},

  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 4,
    lineHeight: 22,
  },

  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  searchBar: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#dbe4f0",

    marginTop: 6,
    marginBottom: 20,

    marginLeft: 10,
    marginRight: 10,

    shadowColor: "#2563eb",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  bannerContainer: {
    borderRadius: 22,
    overflow: "hidden",

    marginBottom: 24,

    marginLeft: 10,
    marginRight: 10,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  bannerImage: {
    width: "100%",
    height: 175,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 4,
    marginBottom: 14,

    marginLeft: 10,
    marginRight: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },

  seeAll: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563eb",
  },

  categoriesContainer: {
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  categoryWrapper: {
    width: 82,
    alignItems: "center",
    marginRight: 12,
  },

  categoryCard: {
    width: 72,
    height: 72,

    borderRadius: 18,
    backgroundColor: "#ffffff",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  categoryText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#1e293b",
  },

  courseCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#ffffff",
    borderRadius: 20,

    padding: 14,
    marginBottom: 14,

    marginLeft: 10,
    marginRight: 10,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  courseIconBox: {
    width: 65,
    height: 65,

    borderRadius: 16,
    backgroundColor: "#f8fafc",

    justifyContent: "center",
    alignItems: "center",
  },

  courseContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  courseTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },

  courseDescription: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 6,
  },

  learners: {
    fontSize: 12,
    color: "#64748b",
  },

  bookmarkButton: {
    padding: 4,
  },

  emptyBox: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 18,
    alignItems: "center",

    marginLeft: 10,
    marginRight: 10,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },

  emptySubText: {
    marginTop: 6,
    color: "#64748b",
    textAlign: "center",
  },
});