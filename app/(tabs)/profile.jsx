import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { User, Gear, Bell, CreditCard, Question, SignOut, CaretDoubleRight, Shield, Heart } from "phosphor-react-native"
import { useRouter } from "expo-router"
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useContext(UserDetailContext);
  //console.log(userDetail);
  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageButton}>
              <User size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <View style={styles.tierBadge}>
            <Heart size={14} color="#FF6B6B" />
            {user.member ? <Text style={styles.tierText}>Premium Member</Text> : <Text style={styles.tierText}>Regular Member</Text>}
            
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <User size={20} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Personal Information</Text>
                <Text style={styles.settingDescription}>Update your personal details</Text>
              </View>
              <CaretDoubleRight size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Bell size={20} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>Manage notification preferences</Text>
              </View>
              <CaretDoubleRight size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <CreditCard size={20} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Subscription</Text>
                <Text style={styles.settingDescription}>Manage your subscription plan</Text>
              </View>
              <CaretDoubleRight size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Gear size={20} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Toggle dark theme</Text>
              </View>
              <Switch trackColor={{ false: "#E0E0E0", true: "#FFB6B6" }} thumbColor={"#FF6B6B"} value={false} />
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Gear size={20} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Dietary Preferences</Text>
                <Text style={styles.settingDescription}>Set your dietary restrictions</Text>
              </View>
              <CaretDoubleRight size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Question size={20} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>Get help with the app</Text>
              </View>
              <CaretDoubleRight size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Shield size={20} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Terms & Conditions</Text>
                <Text style={styles.settingDescription}>Read our terms of service</Text>
              </View>
              <CaretDoubleRight size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Shield size={20} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
                <Text style={styles.settingDescription}>Read our privacy policy</Text>
              </View>
              <CaretDoubleRight size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => {router.push("/")}}>
          <SignOut size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F8F9FA",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6B6B",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9f0",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  tierText: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "600",
    marginLeft: 4,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 8,
  },
  editProfileText: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  settingsContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  settingDescription: {
    fontSize: 13,
    color: "#888",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#FF6B6B",
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  versionText: {
    fontSize: 12,
    color: "#999",
  },
})
