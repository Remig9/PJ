// import Colors from "../../constants/Colors";
// import { Image, StyleSheet, View } from "react-native";
// // import RNPickerSelect from "@react-native-picker/picker";
// import RNPickerSelect from "react-native-picker-select";
// import React from "react";
// import { Entypo } from "@expo/vector-icons";
// import { useRef } from "react";
// import { useState } from "react";
// // import { Picker } from "@react-native-picker/picker";

// export const Select = ({
//   placeholder,
//   onChange,
//   items,
//   style,
//   selectStyle = {},
// }) => {
//   const pickerRef = useRef();
//   const [selectedLanguage, setSelectedLanguage] = useState();

//   function open() {
//     pickerRef.current.focus();
//   }

//   function close() {
//     pickerRef.current.blur();
//   }
//   return (
//     <View style={{ ...style, width: "100%" }}>
//       <RNPickerSelect
//         useNativeAndroidPickerStyle={false}
//         placeholder={{
//           label: placeholder,
//           value: null,
//           color: Colors.primaryColor,
//           fontFamily: "GilroySemiBold",
//         }}
//         placeHolderTextColor={Colors.primaryColor}
//         onValueChange={onChange}
//         items={items}
//         style={{ ...pickerSelectStyles }}
//         Icon={() => (
//           <Entypo name='chevron-down' size={20} color={Colors.primaryColor} />
//         )}
//       />

//       {/* <Picker
//         ref={pickerRef}
//         selectedValue={selectedLanguage}
//         onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
//       >
//         <Picker.Item label='Java' value='java' />
//         <Picker.Item label='JavaScript' value='js' />
//       </Picker> */}
//     </View>
//   );
// };

// const inputStyles = {
//   backgroundColor: "white",
//   fontSize: 15,
//   paddingHorizontal: 30,
//   borderWidth: 0,
//   borderRadius: 4,
//   color: Colors.primaryColor,
//   textTransform: "uppercase",
//   fontFamily: "GilroyBold",
//   justifyContent: "flex-start",
//   textAlign: "center",
// };

// const pickerSelectStyles = StyleSheet.create({
//   inputAndroid: {
//     paddingVertical: 5,
//     ...inputStyles,
//   },
//   inputIOS: {
//     paddingVertical: 10,
//     ...inputStyles,
//   },
//   iconContainer: {
//     top: 14,
//     right: 19,
//   },
//   placeholder: {
//     color: Colors.primaryColor,
//     fontFamily: "GilroyBold",
//     textAlign: "center",
//     fontSize: 15,
//   },
// });
