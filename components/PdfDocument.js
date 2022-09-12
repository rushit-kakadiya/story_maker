import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

export default function PdfDocument(props) {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 15,
      margin: 15,
    },
    subHeader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 12,
      margin: "7 15",
    },

    image: {
      height: 50,
      width: 50,
    },
  });

  return (
    <Document>
      <Page style={styles.page} size="A4">
        <View style={styles.header}>
          <View>
            <Text>Id</Text>
          </View>
          <View>
            <Text>Name</Text>
          </View>
          <View>
            <Text>Email</Text>
          </View>
          <View>
            <Text> Upload Time</Text>
          </View>
          <View>
            <Text>Upload Date</Text>
          </View>
          <View>
            <Text>Image</Text>
          </View>
        </View>
        {props.data
          ? props.data.map((el, i) => {
              return (
                <View key={i} style={styles.subHeader}>
                  <View>
                    <Text>{el.id}</Text>
                  </View>
                  <View>
                    <Text>{el.name}</Text>
                  </View>
                  <View>
                    <Text>{el.email}</Text>
                  </View>
                  <View>
                    <Text>{el.upload_time}</Text>
                  </View>
                  <View>
                    <Text>{el.upload_date}</Text>
                  </View>
                  <Image
                    style={styles.image}
                    source={`${el.image}`}
                    alt=""
                  />
                </View>
              );
            })
          : ""}
      </Page>
    </Document>
  );
}
