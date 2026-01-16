  // import React, { useState, useEffect } from 'react';
  // import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
  // import { CandlestickChart } from 'react-native-wagmi-charts';
  // import { Table, Row } from 'react-native-table-component';
  // import RNPickerSelect from 'react-native-picker-select';
  // import cryptoData from './crypto-data.json';

  // import 'react-native-reanimated';

  // import { Dimensions } from 'react-native';
  // import { MaterialIcons } from '@expo/vector-icons'; // Importation de MaterialIcons

  // const CryptoChart = ({ navigation }) => {
  //   const [selectedPair, setSelectedPair] = useState(cryptoData[0]?.nom || null);
  //   const [currentPrices, setCurrentPrices] = useState([]);
  //   const [currentTime, setCurrentTime] = useState(Date.now());

  //   const formatChartData = (data) => {
  //     const midnight = new Date(currentTime);
  //     midnight.setHours(0, 0, 0, 0);

  //     return data?.map((d, i) => ({
  //       timestamp: midnight.getTime() + (i * 10000),
  //       open: d.open,
  //       high: d.high,
  //       low: d.low,
  //       close: d.close
  //     })) || [];
  //   };

  //   const getVisibleData = () => {
  //     const midnight = new Date(currentTime);
  //     midnight.setHours(0, 0, 0, 0);
  //     const currentIndex = Math.floor((currentTime - midnight.getTime()) / 10000);

  //     const pairData = cryptoData.find(p => p.nom === selectedPair)?.data || [];
  //     const safeIndex = Math.min(currentIndex, pairData.length - 1);

  //     return pairData.slice(safeIndex - 55, safeIndex + 1);
  //   };

  //   useEffect(() => {
  //     const updatePrices = () => {
  //       const midnight = new Date().setHours(0, 0, 0, 0);
  //       const currentIndex = Math.floor((Date.now() - midnight) / 10000);

  //       setCurrentPrices(cryptoData.map(pair => ({
  //         name: pair.nom,
  //         price: pair.data[currentIndex % pair.data.length].close
  //       })));
  //     };

  //     const interval = setInterval(updatePrices, 10000);
  //     return () => clearInterval(interval);
  //   }, []);

  //   useEffect(() => {
  //     const timeInterval = setInterval(() => {
  //       setCurrentTime(Date.now());
  //     }, 10000);

  //     return () => {
  //       clearInterval(timeInterval);
  //     };
  //   }, []);

  //   return (
  //     <SafeAreaView style={styles.container}>
  //       {/* Bouton retour */}
  //       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  //         <MaterialIcons name="arrow-back" size={28} color="#F7931A" />
  //       </TouchableOpacity>

  //       <ScrollView>
  //         <View style={styles.pickerContainer}>
  //           <RNPickerSelect
  //             onValueChange={setSelectedPair}
  //             items={cryptoData.map(p => ({ label: p.nom, value: p.nom }))} 
  //             value={selectedPair}
  //             placeholder={{}}
  //             style={pickerSelectStyles} // Ajout d'un style personnalisé pour le picker
  //           />
  //         </View>

  //         <View style={styles.chartContainer}>
  //           <CandlestickChart.Provider data={formatChartData(getVisibleData())}>
  //             <CandlestickChart
  //               width={Dimensions.get('window').width - 40}
  //               height={300}
  //             >
  //               <CandlestickChart.Candles />
  //             </CandlestickChart>
  //           </CandlestickChart.Provider>
  //         </View>

  //         <View style={styles.tableContainer}>
  //           <Table borderStyle={styles.tableBorder}>
  //             <Row
  //               data={['Crypto', 'Prix Actuel']}
  //               style={styles.headerRow}
  //               textStyle={styles.headerText}
  //             />
  //             {currentPrices.map((crypto, index) => (
  //               <Row
  //                 key={index}
  //                 data={[crypto.name, crypto.price.toFixed(2)]}
  //                 style={styles.dataRow}
  //                 textStyle={styles.dataText}
  //               />
  //             ))}
  //           </Table>
  //         </View>
  //       </ScrollView>
  //     </SafeAreaView>
  //   );
  // };

  // const pickerSelectStyles = {
  //   inputIOS: {
  //     color: '#fff',
  //     fontSize: 16,
  //     padding: 10,
  //     backgroundColor: '#333',
  //     borderRadius: 8,
  //     marginBottom: 16,
  //     marginTop: 16,
  //   },
  //   inputAndroid: {
  //     color: '#fff',
  //     fontSize: 16,
  //     padding: 10,
  //     backgroundColor: '#333',
  //     borderRadius: 8,
  //     marginBottom: 16,
  //     marginTop: 16,
  //   },
  // };

  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: '#121212',  // Fond sombre
  //     padding: 16,
  //   },
  //   backButton: {
  //     position: 'absolute',
  //     top: 40, // Positionné en haut de l'écran
  //     left: 16, // Décalé sur la gauche
  //     zIndex: 1, // Pour s'assurer qu'il est visible au-dessus des autres éléments
  //   },
  //   pickerContainer: {
  //     backgroundColor: '#333',
  //     borderRadius: 8,
  //     padding: 10,
  //   },
  //   chartContainer: {
  //     height: 300,
  //     marginVertical: 20,
  //     padding: 10,
  //     backgroundColor: '#1F1F1F',
  //     borderRadius: 10,
  //     shadowColor: '#000',
  //     shadowOffset: { width: 0, height: 2 },
  //     shadowOpacity: 0.1,
  //     shadowRadius: 4,
  //     elevation: 3,
  //   },
  //   tableContainer: {
  //     padding: 20,
  //   },
  //   tableBorder: {
  //     borderWidth: 1,
  //     borderColor: '#444',
  //   },
  //   headerRow: {
  //     height: 40,
  //     backgroundColor: '#444',
  //   },
  //   headerText: {
  //     color: '#F7931A',  // Jaune/orange pour la lisibilité
  //     fontWeight: 'bold',
  //     textAlign: 'center',
  //   },
  //   dataRow: {
  //     height: 35,
  //     backgroundColor: '#333',
  //   },
  //   dataText: {
  //     color: '#fff',
  //     textAlign: 'center',
  //   },
  // });

  // export default CryptoChart;

  // import React, { useState, useEffect } from 'react';
  // import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
  // import { CandlestickChart } from 'react-native-wagmi-charts';
  // import { Table, Row } from 'react-native-table-component';
  // import RNPickerSelect from 'react-native-picker-select';
  // import cryptoData from './crypto-data.json';  // Votre fichier JSON contenant les données des crypto-monnaies
  // import cryptoIcons from './cryptoIcons';  // Importation du fichier de mappage
  // import { Dimensions } from 'react-native';
  // import { MaterialIcons } from '@expo/vector-icons';
  
  // const CryptoChart = ({ navigation }) => {
  //   const [selectedPair, setSelectedPair] = useState(cryptoData[0]?.nom || null);
  //   const [currentPrices, setCurrentPrices] = useState([]);
  //   const [currentTime, setCurrentTime] = useState(Date.now());
  
  //   const formatChartData = (data) => {
  //     const midnight = new Date(currentTime);
  //     midnight.setHours(0, 0, 0, 0);
  
  //     return data?.map((d, i) => ({
  //       timestamp: midnight.getTime() + (i * 10000),
  //       open: d.open,
  //       high: d.high,
  //       low: d.low,
  //       close: d.close
  //     })) || [];
  //   };
  
  //   const getVisibleData = () => {
  //     const midnight = new Date(currentTime);
  //     midnight.setHours(0, 0, 0, 0);
  //     const currentIndex = Math.floor((currentTime - midnight.getTime()) / 10000);
  
  //     const pairData = cryptoData.find(p => p.nom === selectedPair)?.data || [];
  //     const safeIndex = Math.min(currentIndex, pairData.length - 1);
  
  //     return pairData.slice(safeIndex - 55, safeIndex + 1);
  //   };
  
  //   useEffect(() => {
  //     const updatePrices = () => {
  //       const midnight = new Date().setHours(0, 0, 0, 0);
  //       const currentIndex = Math.floor((Date.now() - midnight) / 10000);
  
  //       setCurrentPrices(cryptoData.map(pair => ({
  //         name: pair.nom,
  //         price: pair.data[currentIndex % pair.data.length].close
  //       })));
  //     };
  
  //     const interval = setInterval(updatePrices, 10000);
  //     return () => clearInterval(interval);
  //   }, []);
  
  //   useEffect(() => {
  //     const timeInterval = setInterval(() => {
  //       setCurrentTime(Date.now());
  //     }, 10000);
  
  //     return () => {
  //       clearInterval(timeInterval);
  //     };
  //   }, []);
  
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  //         <MaterialIcons name="arrow-back" size={28} color="#F7931A" />
  //       </TouchableOpacity>
  
  //       <ScrollView>
  //         {/* Section pour le Picker */}
  //         <View style={styles.pickerContainer}>
  //           <RNPickerSelect
  //             onValueChange={setSelectedPair}
  //             items={cryptoData.map(p => ({ label: `${p.nom}`, value: p.nom }))}
  //             value={selectedPair}
  //             placeholder={{ label: 'Sélectionner une crypto', value: null }}
  //             style={pickerSelectStyles}
  //           />
  //         </View>
  
  //         {/* Section du graphique */}
  //         <View style={styles.chartContainer}>
  //           <CandlestickChart.Provider data={formatChartData(getVisibleData())}>
  //             <CandlestickChart width={Dimensions.get('window').width - 40} height={300}>
  //               <CandlestickChart.Candles />
  //             </CandlestickChart>
  //           </CandlestickChart.Provider>
  //         </View>
  
  //         {/* Section du tableau */}
  //         <View style={styles.tableContainer}>
  //           <Table borderStyle={styles.tableBorder}>
  //             <Row
  //               data={['Crypto', 'Prix Actuel']}
  //               style={styles.headerRow}
  //               textStyle={styles.headerText}
  //             />
  //             {currentPrices.map((crypto, index) => (
  //               <Row
  //                 key={index}
  //                 data={[
  //                   <View style={styles.iconContainer}>{cryptoIcons[crypto.name]}</View>, // Centrer l'icône
  //                   crypto.price.toFixed(2),
  //                 ]}
  //                 style={styles.dataRow}
  //                 textStyle={styles.dataText}
  //               />
  //             ))}
  //           </Table>
  //         </View>
  //       </ScrollView>
  //     </SafeAreaView>
  //   );
  // };
  
  // const pickerSelectStyles = {
  //   inputIOS: {
  //     color: '#fff',
  //     fontSize: 18,
  //     padding: 10,
  //     backgroundColor: '#333',
  //     borderRadius: 8,
  //     marginBottom: 16,
  //     marginTop: 16,
  //     textAlign: 'center',
  //   },
  //   inputAndroid: {
  //     color: '#fff',
  //     fontSize: 18,
  //     padding: 10,
  //     backgroundColor: '#333',
  //     borderRadius: 8,
  //     marginBottom: 16,
  //     marginTop: 16,
  //     textAlign: 'center',
  //   },
  // };
  
  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: '#121212',
  //     padding: 16,
  //     marginTop: 79
  //   },
  //   backButton: {
  //     position: 'absolute',
  //     top: 40,
  //     left: 16,
  //     zIndex: 1,
  //   },
  //   pickerContainer: {
  //     backgroundColor: '#333',
  //     borderRadius: 8,
  //     padding: 10,
  //     marginTop: 20,
  //   },
  //   chartContainer: {
  //     height: 300,
  //     marginVertical: 20,
  //     padding: 10,
  //     backgroundColor: '#1F1F1F',
  //     borderRadius: 10,
  //   },
  //   tableContainer: {
  //     padding: 20,
  //   },
  //   tableBorder: {
  //     borderWidth: 1,
  //     borderColor: '#444',
  //   },
  //   headerRow: {
  //     height: 40,
  //     backgroundColor: '#444',
  //   },
  //   headerText: {
  //     color: '#F7931A',
  //     fontWeight: 'bold',
  //     textAlign: 'center',
  //   },
  //   dataRow: {
  //     height: 35,
  //     backgroundColor: '#333',
  //   },
  //   dataText: {
  //     color: '#fff',
  //     textAlign: 'center',
  //   },
  //   iconContainer: {
  //     justifyContent: 'center', // Centrer l'icône horizontalement
  //     alignItems: 'center', // Centrer l'icône verticalement
  //   },
  // });
  
  // export default CryptoChart;
  

  import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CandlestickChart } from 'react-native-wagmi-charts';
import { Table, Row } from 'react-native-table-component';
import RNPickerSelect from 'react-native-picker-select';
import cryptoData from './crypto-data.json';  // Votre fichier JSON contenant les données des crypto-monnaies
import cryptoIcons from './cryptoIcons';  // Importation du fichier de mappage
import { Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CryptoChart = ({ navigation }) => {
  const [selectedPair, setSelectedPair] = useState(cryptoData[0]?.nom || null);
  const [currentPrices, setCurrentPrices] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const formatChartData = (data) => {
    const midnight = new Date(currentTime);
    midnight.setHours(0, 0, 0, 0);

    return data?.map((d, i) => ({
      timestamp: midnight.getTime() + (i * 10000),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close
    })) || [];
  };

  const getVisibleData = () => {
    const midnight = new Date(currentTime);
    midnight.setHours(0, 0, 0, 0);
    const currentIndex = Math.floor((currentTime - midnight.getTime()) / 10000);

    const pairData = cryptoData.find(p => p.nom === selectedPair)?.data || [];
    const safeIndex = Math.min(currentIndex, pairData.length - 1);

    return pairData.slice(safeIndex - 55, safeIndex + 1);
  };

  useEffect(() => {
    const updatePrices = () => {
      const midnight = new Date().setHours(0, 0, 0, 0);
      const currentIndex = Math.floor((Date.now() - midnight) / 10000);

      setCurrentPrices(cryptoData.map(pair => ({
        name: pair.nom,
        price: pair.data[currentIndex % pair.data.length].close
      })));
    };

    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#F7931A" />
      </TouchableOpacity>

      <ScrollView>
        {/* Section pour le Picker */}
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={setSelectedPair}
            items={cryptoData.map(p => ({ label: `${p.nom}`, value: p.nom }))}
            value={selectedPair}
            placeholder={{ label: 'Sélectionner une crypto', value: null }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false} // Pour personnaliser la flèche Android
            Icon={() => (
              <MaterialIcons
                name="arrow-drop-down"
                size={59}
                color="#F7931A"
              />
            )}
          />
        </View>

        {/* Section du graphique */}
        <View style={styles.chartContainer}>
          <CandlestickChart.Provider data={formatChartData(getVisibleData())}>
            <CandlestickChart width={Dimensions.get('window').width - 40} height={300}>
              <CandlestickChart.Candles />
            </CandlestickChart>
          </CandlestickChart.Provider>
        </View>

        {/* Section du tableau */}
        {/* <View style={styles.tableContainer}>
          <Table borderStyle={styles.tableBorder}>
            <Row
              data={['Crypto', 'Prix Actuel']}
              style={styles.headerRow}
              textStyle={styles.headerText}
            />
            {currentPrices.map((crypto, index) => (
              <Row
                key={index}
                data={[
                  <View style={styles.iconContainer}>{cryptoIcons[crypto.name]}</View>, // Centrer l'icône
                  crypto.price.toFixed(2),
                ]}
                style={styles.dataRow}
                textStyle={styles.dataText}
              />
            ))}
          </Table>
        </View> */
        
        <View style={styles.tableContainer}>
  <Table borderStyle={styles.tableBorder}>
    <Row
      data={['Crypto', 'Prix Actuel']}
      style={styles.headerRow}
      textStyle={styles.headerText}
    />
    {currentPrices.map((crypto, index) => (
      <Row
        key={index}
        data={[
          <View style={styles.rowContent}>
            <View style={styles.iconContainer}>
              {cryptoIcons[crypto.name]}  {/* L'icône de la crypto */}
            </View>
            <Text style={styles.cryptoName}>{crypto.name}</Text>  {/* Le nom de la crypto */}
          </View>,
          crypto.price.toFixed(2),  // Le prix
        ]}
        style={styles.dataRow}
        textStyle={styles.dataText}
      />
    ))}
  </Table>
</View>

        
        }
      </ScrollView>
    </SafeAreaView>
  );
};
const pickerSelectStyles = {
  inputIOS: {
    color: '#fff',
    fontSize: 18,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  inputAndroid: {
    color: '#fff',
    fontSize: 18,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
    marginTop: 79,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
  },
  pickerContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8, 
    marginTop: 16,
    marginBottom: 16,
    borderColor: '#444', 
    borderWidth: 1, 
    position: 'relative',
    width: '80%',
    alignSelf: 'center',
  },
  chartContainer: {
    height: 300,
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
  },
  tableContainer: {
    padding: 20,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#444',
  },
  headerRow: {
    height: 40,
    backgroundColor: '#444',
  },
  headerText: {
    color: '#F7931A',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataRow: {
    height: 35,
    backgroundColor: '#333',
  },
  dataText: {
    color: '#fff',
    textAlign: 'center',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  cryptoName: {
    fontSize: 16,
    color: 'white',
  },
});


export default CryptoChart;
