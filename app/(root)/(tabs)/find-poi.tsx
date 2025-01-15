import { icons } from "@/constants";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

interface POIItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const POIData: POIItem[] = [
  {
    id: "1",
    title: "MT.EVEREST",
    description:
      "Mount Everest, known locally as Sagarmatha or Qomolangma, is Earth's highest mountain above sea level, located in the Mahalangur Himal sub-range ... ",
    image:
      "https://lh5.googleusercontent.com/p/AF1QipPnej2Th4kzPYITDTooM-8cJxAr29j_9e-eFO84=w675-h390-n-k-no", // Replace with actual image URLs
    link: "https://g.co/kgs/hCpN6s8",
  },
  {
    id: "2",
    title: "ILLAM",
    description:
      "Ilam is one of four urban municipalities of Ilam District, which lies in the Mahabharata hilly range of Koshi Province, eastern Nepal. Ilam also... ", //{acts as the headquarters of Ilam District. Being the largest producer region for Nepali tea, its tea farms are a major tourist attraction in Koshi Province.},
    image:
      "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQtWUsg9C5ltKfHmg18fXBPGTlymq20zpRL2JgZI5F3yXHVrRZhsu3fwMcflPdJmV3FthGE0Zmy0BZz8RKGOwhLiyG0VYYl5SfIKi_hEQ",
    link: "https://g.co/kgs/d7oNq2E",
  },
  {
    id: "3",
    title: "SHREE ANTU",
    description:
      "Shree Antu is a Village / Valley within Suryodaya Municipality in Ilam District in the Province No. 1 of eastern Nepal. At the time of the 2011 ... ",
    image:
      "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQQFG4NDk4c4ywOk3hzcNSho6Y0ST0p2XD5MNsM-fv6sCytUmza4MD8l2XUs6eZ8KkDCtTwinD9j93Ga5xeN5NH53VC-s5j060Foa_m3A",
    link: "https://g.co/kgs/q52xKT9",
  },
  {
    id: "4",
    title: "KOSHI TAPPU",
    description:
      "The Kosi or Koshi is a transboundary river which flows through China, Nepal and India. It drains the northern slopes of the Himalayas in Tibet and ...",
    image:
      "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQ_PWlCGcMcNbkk_K30IKuKOu4bwYasHpOb0X91JfCzlpAUh8q8qzeq11WM1DF3WSp34Wy0k2ZXVP19bbLYgfH_qpm2VR7AcsR2Arvsgg",
    link: "https://g.co/kgs/E5tQHED",
  },
  {
    id: "5",
    title: "KANCHENJUNGGA",
    description:
      "Kangchenjunga, also spelled Kanchenjunga, Kanchanjanghā and Khangchendzonga, is the third-highest mountain in the world. ",
    image:
      "https://lh5.googleusercontent.com/p/AF1QipMB2dJkShSROHbr7J5rBAiQm4rVFOWQe-d-DsiZ=w675-h390-n-k-no",
    link: "https://g.co/kgs/BJ3t4eq",
  },
  {
    id: "6",
    title: "BARAKSHETRA",
    description:
      "Barahachhetra is a Hindu and Kirat piligram site[1] which remains between the confluence of Koka and Koshi rivers in Barahakshetra, Sunsari of Koshi ...",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Barahakshetra_Temple_Main_Gate.jpg/1280px-Barahakshetra_Temple_Main_Gate.jpg",
    link: "https://g.co/kgs/jz141gF",
  },
  {
    id: "7",
    title: "AARJUNDHARA",
    description:
      "Arjuna is the name of a Mahabharata character, while 'dhara' refers to a source of water. In the epic, after the Pandavas completed their 12 years of ... ",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Arjundhara_jhapa.JPG/1280px-Arjundhara_jhapa.JPG",
    link: "https://www.google.com/search?kgmid=%2Fg%2F11bc5xzzqr&hl=en-NP&q=Arjundhara&shndl=17&source=sh%2Fx%2Fkp%2Fosrp%2Fm5%2F1&kgs=34d7abf4207a3fc8",
  },
  {
    id: "8",
    title: "BUDHA SUBBA",
    description:
      "Budha Subba Temple is a well known religious temple of the Nepali people. It is situated in Bijayapur of Dharan, Nepal. It is believed to fulfill the wishes ...",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-dFojWGvIknNXdNRsQnkSV28ZiHLviS84kjE7t9FZLDlS0xWo9q4LgGeZOA&s",
    link: "https://en.wikipedia.org/wiki/Budha_Subba_Temple",
  },
  {
    id: "9",
    title: "PATHIVHARA",
    description:
      "One of the most significant temples in Nepal, located on the hill of Taplejung. It is also considered one of the holy places for the Nepalese people...",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/4b/95/76/a-view-from-the-top-of.jpg?w=1000&h=-1&s=1",
    link: "https://en.wikipedia.org/wiki/Pathibhara_Devi_Temple",
  },
  {
    id: "10",
    title: "OSSHO",
    description:
      "Located approximately 8 kilometres from Dharan, Bhanu Chowk, the park has been developed to attract internal and external tourists...",
    image:
      "https://english.makalukhabar.com/wp-content/uploads/2024/04/BP-KOIRALA-OSHO-MK.jpg",
    link: "https://g.co/kgs/GoN7irq",
  },
];

const POIScreen = () => {
  const renderItem = ({ item }: { item: POIItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(item.link).catch((err) =>
              console.error("Failed to open URL:", err)
            )
          }
        >
          <Text style={styles.link}>Visit webpage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const gohome = async () => {
    router.push("/(root)/(tabs)/home");
  };

  return (
    <View style={styles.container} className="">
      <View className="pt-5 bg-[#E9C05E] h-32 px-5">
             <View className="flex flex-row absolute z-10 top-12 items-center justify-start px-5">
               <TouchableOpacity onPress={gohome}>
                 <View className="w-7 h-7 bg-white rounded-full items-center justify-center">
                   <Image
                     source={icons.backArrow}
                     resizeMode="contain"
                     className="w-6 h-6"
                   />
                 </View>
               </TouchableOpacity>
               <Text className="text-xl font-JakartaSemiBold ml-5 text-white ">
                Poin Of Interest
               </Text>
             </View>
           </View>
      <FlatList
        data={POIData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3, // Shadow for Android
    margin:11,
    padding:10
  },
  image: {
    width: 100,
    height: 100,
    justifyContent: "center",
    padding: 10,
    resizeMode: "cover",
    alignItems:"center"
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  link: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});

export default POIScreen;
