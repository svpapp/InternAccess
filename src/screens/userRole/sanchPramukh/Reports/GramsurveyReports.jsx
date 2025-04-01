// import { View, Text } from 'react-native'
// import React from 'react'

// const GramsurveyReports = () => {
//   return (
//     <View>
//       <Text>GramsurveyReports</Text>
//     </View>
//   )
// }

// export default GramsurveyReports


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import axios from 'axios';


const GramsurveyReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [villageStats, setVillageStats] = useState([]);
  const [activeChart, setActiveChart] = useState('bar'); // 'bar' or 'pie'
  
  useEffect(() => {
    fetchVillageStats();
  }, []);
  
  const fetchVillageStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://192.168.1.27:5001/api/v1/gram-survey/stats');
  
      console.log("Full API Response:", response.data);
  
      // Ensure correct extraction of villageStats
      if (response.data && response.data.data && Array.isArray(response.data.data.villageStats)) {
        // setVillageStats(response.data.data.villageStats);
            setVillageStats(Array.isArray(response.data.data.villageStats) ? response.data.data.villageStats : []);
            console.log("Village response",response.data.data.villageStats);
            
      } else {
        console.error("Invalid villageStats format:", response.data);
        setVillageStats([]); // Prevent errors if data is missing
      }
  
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch village statistics');
      setLoading(false);
      console.error('Error fetching village stats:', err);
    }
  };
  
  
  // Prepare data for bar chart
  const getBarChartData = () => {
    if (!Array.isArray(villageStats)) return [];
    return villageStats.slice(0, 7).map(stat => ({
      value: stat.totalPopulation,
      label: stat._id,
      frontColor: '#4CAF50'
    }));
  };
  
  // Prepare data for pie chart
  const getPieChartData = () => {
    if (!Array.isArray(villageStats)) return [];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    return villageStats.slice(0, 5).map((stat, index) => ({
      value: stat.totalPopulation,
      label: stat._id,
      color: colors[index % colors.length]
    }));
  };
  
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Loading village statistics...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchVillageStats}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Village Statistics</Text>
      
      {/* Chart Switch Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.chartButton} onPress={() => setActiveChart('bar')}>
          <Text style={styles.buttonText}>Bar Chart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.chartButton} onPress={() => setActiveChart('pie')}>
          <Text style={styles.buttonText}>Pie Chart</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        {activeChart === 'bar' && (
          <View>
            <Text style={styles.chartTitle}>Population by Village (Top 7)</Text>
            <BarChart
              data={getBarChartData()}
              barWidth={30}
              spacing={20}
              roundedTop
              showValuesAsTopLabel
              xAxisLabelTextStyle={{ color: 'black', fontSize: 14 }}
            />
          </View>
        )}
        
        {activeChart === 'pie' && (
          <View>
            <Text style={styles.chartTitle}>Population Distribution (Top 5 Villages)</Text>
            <PieChart
              data={getPieChartData()}
              donut
              showText
              textColor="white"
              radius={120}
              strokeWidth={5}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  },
  chartButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#555'
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 15
  },
  button: {
    backgroundColor: '#4e7bec',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default GramsurveyReports;



