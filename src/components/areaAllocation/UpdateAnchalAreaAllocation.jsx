// import {View, Text, Alert, StyleSheet, ScrollView} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import MultiSelect from 'react-native-multiple-select';
// import {
//   useGetAnchalAreaAllocationById,
//   useUpdateAnchalAreaAllocation,
//   useGetNewAnchalAreaAllocation,
// } from '../../hooks/newAreaAllocation/anchalArea/useAnchalArea';
// import GradientButton from '../common/button/GradientButton';
// import useZoneData from '../../hooks/zoneData/useZoneData';
// import Input from '../common/Input/Input';
// import CustomDropdown from '../common/dropdown/CustomDropdown';

// const UpdateAnchalAreaAllocation = ({navigation, route}) => {
//   const {updateAnchalArea, loading} = useUpdateAnchalAreaAllocation();
//   const {zones, loading: zoneLoading, error: zoneError} = useZoneData();
//   const {data: anchalData} = useGetNewAnchalAreaAllocation();
//   const {getAnchalAreaById} = useGetAnchalAreaAllocationById();
// const {anchalAreaId} = route.params;

//   // Form state
//   const [anchalName, setAnchalName] = useState('');
//   const [selectedZone, setSelectedZone] = useState([]);
//   const [selectedStates, setSelectedStates] = useState([]);
//   const [selectedDistricts, setSelectedDistricts] = useState([]);
//   const [selectedSubDistricts, setSelectedSubDistricts] = useState([]);
//   const [selectedVillages, setSelectedVillages] = useState([]);

//   // Available options
//   const [stateOptions, setStateOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [subDistrictOptions, setSubDistrictOptions] = useState([]);
//   const [villageOptions, setVillageOptions] = useState([]);

//   useEffect(() => {
//     const fetchAnchalArea = async () => {
//       if (!anchalAreaId || !zones?.length) return;

//       try {
//         const data = await getAnchalAreaById(anchalAreaId);
//         if (!data) return;

//         setAnchalName(data.anchalName);

//         if (data.zoneName) {
//           setSelectedZone([data.zoneName]);
//           handleZoneChange([data.zoneName]);

//           if (data.states?.length) {
//             const stateNames = data.states.map(s => s.stateName);
//             setSelectedStates(stateNames);
//             handleStatesChange(stateNames);

//             // Set districts
//             const districts = data.states.flatMap(state =>
//               state.districts.map(district => district.districtName),
//             );
//             setSelectedDistricts(districts);
//             handleDistrictsChange(districts);

//             // Set subdistricts
//             const subdistricts = data.states.flatMap(state =>
//               state.districts.flatMap(district =>
//                 district.subdistricts.map(sd => sd.subDistrictName),
//               ),
//             );
//             setSelectedSubDistricts(subdistricts);
//             handleSubDistrictsChange(subdistricts);

//             // Set villages
//             const villages = data.states.flatMap(state =>
//               state.districts.flatMap(district =>
//                 district.subdistricts.flatMap(subdistrict =>
//                   subdistrict.villages.map(village => village.villageName),
//                 ),
//               ),
//             );
//             setSelectedVillages(villages);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching anchal area:', error);
//         Alert.alert('Error', 'Failed to fetch anchal area details');
//       }
//     };

//     fetchAnchalArea();
//   }, [anchalAreaId, zones, getAnchalAreaById]);

//   const handleZoneChange = selectedItems => {
//     const zoneValue = selectedItems[0]; // Since Zone is single-select
//     setSelectedZone([zoneValue]);

//     const zone = zones.find(z => z.zoneName === zoneValue);
//     if (zone) {
//       const states = zone.states.map(state => ({
//         label: state.StateName,
//         value: state.StateName,
//       }));
//       setStateOptions(states);
//     } else {
//       setStateOptions([]);
//     }

//     // Reset dependent fields
//     setSelectedStates([]);
//     setSelectedDistricts([]);
//     setSelectedSubDistricts([]);
//     setSelectedVillages([]);
//     setDistrictOptions([]);
//     setSubDistrictOptions([]);
//     setVillageOptions([]);
//   };

//   const handleStatesChange = selectedItems => {
//     setSelectedStates(selectedItems);
//     const zone = zones.find(z => z.zoneName === selectedZone[0]);

//     if (zone) {
//       const districts = selectedItems.flatMap(stateValue => {
//         const state = zone.states.find(s => s.StateName === stateValue);
//         return (
//           state?.districts.map(district => ({
//             label: district.Districtname,
//             value: district.Districtname,
//           })) || []
//         );
//       });
//       setDistrictOptions(districts);
//     }

//     // Reset dependent fields
//     setSelectedDistricts([]);
//     setSelectedSubDistricts([]);
//     setSelectedVillages([]);
//     setSubDistrictOptions([]);
//     setVillageOptions([]);
//   };

//   const handleDistrictsChange = selectedItems => {
//     setSelectedDistricts(selectedItems);
//     const zone = zones.find(z => z.zoneName === selectedZone[0]);

//     if (zone) {
//       const subdistricts = selectedItems.flatMap(districtValue => {
//         const districts = zone.states.flatMap(s => s.districts);
//         const district = districts.find(d => d.Districtname === districtValue);
//         return (
//           district?.subdistricts.map(sd => ({
//             label: sd['Sub-distname'],
//             value: sd['Sub-distname'],
//           })) || []
//         );
//       });
//       setSubDistrictOptions(subdistricts);
//     }

//     // Reset dependent fields
//     setSelectedSubDistricts([]);
//     setSelectedVillages([]);
//     setVillageOptions([]);
//   };

//   const handleSubDistrictsChange = selectedItems => {
//     setSelectedSubDistricts(selectedItems);
//     const zone = zones.find(z => z.zoneName === selectedZone[0]);

//     if (zone) {
//       const villages = selectedItems.flatMap(subDistrictValue => {
//         const subdistricts = zone.states.flatMap(s =>
//           s.districts.flatMap(d => d.subdistricts),
//         );
//         const subdistrict = subdistricts.find(
//           sd => sd['Sub-distname'] === subDistrictValue,
//         );
//         return (
//           subdistrict?.details.map(village => ({
//             label: village.VillageName,
//             value: village.VillageName,
//           })) || []
//         );
//       });
//       setVillageOptions(villages);
//     }

//     setSelectedVillages([]);
//   };

//   const handleUpdateArea = async () => {
//     if (!selectedZone.length || !anchalName || !selectedStates.length) {
//       Alert.alert('Validation Error', 'Please fill all required fields');
//       return;
//     }

//     try {
//       const formattedData = {
//         zoneName: selectedZone[0],
//         anchalName,
//         states: selectedStates.map(stateName => ({
//           stateName,
//           districts: selectedDistricts
//             .filter(districtName => {
//               const district = districtOptions.find(
//                 d => d.value === districtName,
//               );
//               return (
//                 district &&
//                 zones
//                   .find(z => z.zoneName === selectedZone[0])
//                   ?.states.find(s => s.StateName === stateName)
//                   ?.districts.some(d => d.Districtname === districtName)
//               );
//             })
//             .map(districtName => ({
//               districtName,
//               subdistricts: selectedSubDistricts
//                 .filter(subDistrictName => {
//                   const subdistrict = subDistrictOptions.find(
//                     sd => sd.value === subDistrictName,
//                   );
//                   return (
//                     subdistrict &&
//                     zones
//                       .find(z => z.zoneName === selectedZone[0])
//                       ?.states.find(s => s.StateName === stateName)
//                       ?.districts.find(d => d.Districtname === districtName)
//                       ?.subdistricts.some(
//                         sd => sd['Sub-distname'] === subDistrictName,
//                       )
//                   );
//                 })
//                 .map(subDistrictName => ({
//                   subDistrictName,
//                   villages: selectedVillages
//                     .filter(villageName => {
//                       const village = villageOptions.find(
//                         v => v.value === villageName,
//                       );
//                       return (
//                         village &&
//                         zones
//                           .find(z => z.zoneName === selectedZone[0])
//                           ?.states.find(s => s.StateName === stateName)
//                           ?.districts.find(d => d.Districtname === districtName)
//                           ?.subdistricts.find(
//                             sd => sd['Sub-distname'] === subDistrictName,
//                           )
//                           ?.details.some(v => v.VillageName === villageName)
//                       );
//                     })
//                     .map(villageName => ({
//                       villageName,
//                     })),
//                 })),
//             })),
//         })),
//       };

//       const response = await updateAnchalArea(anchalAreaId, formattedData);
//       if (response.result) {
//         Alert.alert('Success', 'Anchal Area Allocation Updated Successfully!');
//         navigation.navigate('GetAnchalAreaAllocation');
//       }
//     } catch (error) {
//       Alert.alert(
//         'Error',
//         error.message || 'Failed to Update Anchal Area Allocation',
//       );
//     }
//   };

//   if (zoneLoading)
//     return <Text style={styles.loadingText}>Loading zones...</Text>;
//   if (zoneError)
//     return (
//       <Text style={styles.errorText}>
//         Error loading zones: {zoneError.message}
//       </Text>
//     );

//   return (
//     <ScrollView style={styles.container}>
// <Text style={styles.headerText}>Update Anchal Area Allocation</Text>

// <View style={styles.formContainer}>
//   <View style={styles.inputContainer}>
//     <Text style={styles.label}>Anchal Name</Text>
{
  /* <Input
  autoCapitalize="words"
  placeholder="Enter Anchal Name"
  value={anchalName}
  onChangeText={setAnchalName}
  maxLength={50}
  style={styles.input}
/> */
}
//   </View>

//         <CustomDropdown
//           label="Zone"
//           items={
//             zones?.map(zone => ({
//               label: zone.zoneName,
//               value: zone.zoneName,
//             })) || []
//           }
//           selectedItems={selectedZone}
//           onSelectedItemsChange={handleZoneChange}
//           placeholder="Select Zone"
//         />

//         <CustomDropdown
//           label="States"
//           items={stateOptions}
//           selectedItems={selectedStates}
//           onSelectedItemsChange={handleStatesChange}
//           disabled={!selectedZone.length}
//           placeholder="Select States"
//         />

//         <CustomDropdown
//           label="Districts"
//           items={districtOptions}
//           selectedItems={selectedDistricts}
//           onSelectedItemsChange={handleDistrictsChange}
//           disabled={!selectedStates.length}
//           placeholder="Select Districts"
//         />

//         <CustomDropdown
//           label="Sub-Districts"
//           items={subDistrictOptions}
//           selectedItems={selectedSubDistricts}
//           onSelectedItemsChange={handleSubDistrictsChange}
//           disabled={!selectedDistricts.length}
//           placeholder="Select Sub-Districts"
//         />

//         <CustomDropdown
//           label="Villages"
//           items={villageOptions}
//           selectedItems={selectedVillages}
//           onSelectedItemsChange={setSelectedVillages}
//           disabled={!selectedSubDistricts.length}
//           placeholder="Select Villages"
//         />

// <GradientButton
//   disabled={
//     loading ||
//     !selectedZone.length ||
//     !anchalName ||
//     !selectedStates.length
//   }
//   title={loading ? 'Updating...' : 'Update'}
//   onPress={handleUpdateArea}
//   style={styles.buttonContainer}
// />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   formContainer: {
//     paddingBottom: 100,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },

//   input: {
//     backgroundColor: '#fff',
//     borderColor: '#D1D5DB',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#111827',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#374151',
//     textAlign: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#EF4444',
//     textAlign: 'center',
//     padding: 20,
//   },
//   buttonContainer: {
//     marginTop: 24,
//     marginBottom: 40,
//   },
//   selectedItemsContainer: {
//     marginTop: 10,
//     padding: 12,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//   },
//   selectedItemsHeader: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   selectedItem: {
//     marginBottom: 8,
//   },
//   selectedItemText: {
//     fontSize: 14,
//     color: '#4B5563',
//     fontWeight: '500',
//   },
//   selectedItemSubtext: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginLeft: 16,
//   },
// });

// export default UpdateAnchalAreaAllocation;

//!
import {View, Text, Alert, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  useGetAnchalAreaAllocationById,
  useUpdateAnchalAreaAllocation,
} from '../../hooks/newAreaAllocation/anchalArea/useAnchalArea';
import GradientButton from '../common/button/GradientButton';
import useZoneData from '../../hooks/zoneData/useZoneData';
import Input from '../common/Input/Input';
import MultiSelect from 'react-native-multiple-select';
import FormField from '../common/formData/FormField';
import {anchalAreaAllocationSchema} from '../../utils/ValidationSchema';
import {Formik} from 'formik';

const UpdateAnchalAreaAllocation = ({navigation, route}) => {
  const {zones, loading: zoneLoading, error: zoneError} = useZoneData();
  const {updateAnchalArea, error, loading, responseData} =
    useUpdateAnchalAreaAllocation();
  const {
    error: getByIdAnchalError,
    getAnchalAreaById,
    loading: getByIdAnchalLoading,
  } = useGetAnchalAreaAllocationById();
  const {anchalAreaId} = route.params;
  const formikRef = useRef();

  const initialValues = {
    anchalName: '',
    selectedZone: null,
    selectedStates: [],
    selectedDistricts: [],
    selectedSubDistricts: [],
    selectedVillages: [],
  };

  const SelectField = ({
    name,
    label,
    options,
    value,
    onChange,
    onBlur,
    isMulti,
    isDisabled,
  }) => (
    <View style={styles.selectFieldContainer}>
      <Text style={styles.labelText}>{label}</Text>
      <MultiSelect
        items={options}
        uniqueKey="value"
        displayKey="label"
        onSelectedItemsChange={onChange}
        selectedItems={
          isMulti ? value.map(item => item.value) : value ? [value.value] : []
        }
        selectText={`Select ${label}`}
        searchInputPlaceholderText={`Search ${label}...`}
        onChangeInput={() => {}}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#000"
        selectedItemTextColor="#000"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        searchInputStyle={styles.searchInput}
        styleMainWrapper={styles.multiSelectWrapper}
        styleDropdownMenuSubsection={styles.dropdownSubsection}
        hideSubmitButton
        hideDropdown={isDisabled}
        single={!isMulti}
      />
    </View>
  );

  const handleUpdateArea = async values => {
    try {
      const dataOfAnchalArea = {
        zoneName: values.selectedZone.value,
        anchalName: values.anchalName,
        states: values.selectedStates.map(state => ({
          stateName: state.value,
          districts: values.selectedDistricts
            .filter(district => district.stateValue === state.value)
            .map(district => ({
              districtName: district.value,
              subdistricts: values.selectedSubDistricts
                .filter(
                  subDistrict =>
                    subDistrict.districtValue === district.value &&
                    subDistrict.stateValue === state.value,
                )
                .map(subDistrict => ({
                  subDistrictName: subDistrict.value,
                  villages: values.selectedVillages
                    .filter(
                      village =>
                        village.subDistrictValue === subDistrict.value &&
                        village.districtValue === district.value &&
                        village.stateValue === state.value,
                    )
                    .map(village => ({
                      villageName: village.value,
                    })),
                })),
            })),
        })),
      };

      const response = await updateAnchalArea(anchalAreaId, dataOfAnchalArea);
      if (response.result === true) {
        Alert.alert('Success', 'Anchal Area Allocation Updated Successfully!');
        navigation.navigate('GetAnchalAreaAllocation');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit Anchal Area Allocation',
      );
    }
  };

  useEffect(() => {
    const fetchAnchalArea = async () => {
      if (anchalAreaId && zones?.length > 0) {
        try {
          const data = await getAnchalAreaById(anchalAreaId);

          if (data) {
            const zoneOption = zones.find(
              zone => zone.zoneName === data.zoneName,
            );

            if (!zoneOption) return;

            const formattedZoneOption = {
              label: zoneOption.zoneName,
              value: zoneOption.zoneName,
              states: zoneOption.states,
            };

            const formattedStates = data.states.map(state => {
              const zoneState = zoneOption.states.find(
                s => s.StateName === state.stateName,
              );

              return {
                label: state.stateName,
                value: state.stateName,
                districts: zoneState?.districts || [],
              };
            });

            const formattedDistricts = data.states.flatMap(state =>
              state.districts.map(district => {
                const zoneState = zoneOption.states.find(
                  s => s.StateName === state.stateName,
                );
                const zoneDistrict = zoneState?.districts.find(
                  d => d.Districtname === district.districtName,
                );

                return {
                  label: district.districtName,
                  value: district.districtName,
                  stateValue: state.stateName,
                  subdistricts: zoneDistrict?.subdistricts || [],
                };
              }),
            );

            const formattedSubDistricts = data.states.flatMap(state =>
              state.districts.flatMap(district =>
                district.subdistricts.map(subdistrict => {
                  const zoneState = zoneOption.states.find(
                    s => s.StateName === state.stateName,
                  );
                  const zoneDistrict = zoneState?.districts.find(
                    d => d.Districtname === district.districtName,
                  );
                  const zoneSubDistrict = zoneDistrict?.subdistricts.find(
                    sd => sd['Sub-distname'] === subdistrict.subDistrictName,
                  );

                  return {
                    label: subdistrict.subDistrictName,
                    value: subdistrict.subDistrictName,
                    districtValue: district.districtName,
                    stateValue: state.stateName,
                    details: zoneSubDistrict?.details || [],
                  };
                }),
              ),
            );

            const formattedVillages = data.states.flatMap(state =>
              state.districts.flatMap(district =>
                district.subdistricts.flatMap(subdistrict =>
                  subdistrict.villages.map(village => ({
                    label: village.villageName,
                    value: village.villageName,
                    subDistrictValue: subdistrict.subDistrictName,
                    districtValue: district.districtName,
                    stateValue: state.stateName,
                  })),
                ),
              ),
            );

            if (formikRef.current) {
              formikRef.current.setValues({
                anchalName: data.anchalName,
                selectedZone: formattedZoneOption,
                selectedStates: formattedStates,
                selectedDistricts: formattedDistricts,
                selectedSubDistricts: formattedSubDistricts,
                selectedVillages: formattedVillages,
              });
            }
          }
        } catch (error) {
          console.error('Error fetching anchal area:', error);

          Alert.alert('Failed to fetch anchal area details');
        }
      }
    };

    fetchAnchalArea();
  }, [anchalAreaId, zones]);

  if (zoneLoading)
    return <Text style={styles.loadingText}>Loading zones...</Text>;
  if (zoneError)
    return (
      <Text style={styles.errorText}>
        Error loading zones: {zoneError.message}
      </Text>
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Update Anchal Area Allocation</Text>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={anchalAreaAllocationSchema}
        onSubmit={handleUpdateArea}
        enableReinitialize>
        {({values, setFieldValue, setFieldTouched, isValid, handleSubmit}) => {
          const zoneOptions =
            zones?.map(zone => ({
              label: zone.zoneName,
              value: zone.zoneName,
              states: zone.states,
            })) || [];

          const stateOptions =
            values.selectedZone?.states?.map(state => ({
              label: state.StateName,
              value: state.StateName,
              districts: state.districts,
            })) || [];

          const districtOptions = values.selectedStates.flatMap(
            state =>
              state.districts?.map(district => ({
                label: district.Districtname,
                value: district.Districtname,
                stateValue: state.value,
                subdistricts: district.subdistricts,
              })) || [],
          );

          const subDistrictOptions = values.selectedDistricts.flatMap(
            district =>
              district.subdistricts?.map(subdistrict => ({
                label: subdistrict['Sub-distname'],
                value: subdistrict['Sub-distname'],
                districtValue: district.value,
                stateValue: district.stateValue,
                details: subdistrict.details,
              })) || [],
          );

          const villageOptions = values.selectedSubDistricts.flatMap(
            subdistrict =>
              subdistrict.details?.map(village => ({
                label: village.VillageName,
                value: village.VillageName,
                subDistrictValue: subdistrict.value,
                districtValue: subdistrict.districtValue,
                stateValue: subdistrict.stateValue,
              })) || [],
          );

          return (
            <View style={styles.formContainer}>
              <FormField name="anchalName" label="Anchal Name">
                <Input
                  autoCapitalize="words"
                  placeholder="Enter Anchal Name"
                  value={values.anchalName}
                  onChangeText={text => setFieldValue('anchalName', text)}
                  maxLength={50}
                  style={styles.input}
                />
              </FormField>

              <SelectField
                name="selectedZone"
                label="Zone"
                options={zoneOptions}
                value={values.selectedZone}
                onChange={selected => {
                  const selectedZone = zoneOptions.find(
                    zone => zone.value === selected[0],
                  );
                  setFieldValue('selectedZone', selectedZone);
                  setFieldValue('selectedStates', []);
                  setFieldValue('selectedDistricts', []);
                  setFieldValue('selectedSubDistricts', []);
                  setFieldValue('selectedVillages', []);
                }}
                onBlur={() => setFieldTouched('selectedZone', true)}
                isMulti={false}
              />

              <SelectField
                name="selectedStates"
                label="States"
                options={stateOptions}
                value={values.selectedStates}
                onChange={selected => {
                  const selectedStates = stateOptions.filter(state =>
                    selected.includes(state.value),
                  );
                  setFieldValue('selectedStates', selectedStates);
                  setFieldValue('selectedDistricts', []);
                  setFieldValue('selectedSubDistricts', []);
                  setFieldValue('selectedVillages', []);
                }}
                onBlur={() => setFieldTouched('selectedStates', true)}
                isMulti={true}
                isDisabled={!values.selectedZone}
              />

              <SelectField
                name="selectedDistricts"
                label="Districts"
                options={districtOptions}
                value={values.selectedDistricts}
                onChange={selected => {
                  const selectedDistricts = districtOptions.filter(district =>
                    selected.includes(district.value),
                  );
                  setFieldValue('selectedDistricts', selectedDistricts);
                  setFieldValue('selectedSubDistricts', []);
                  setFieldValue('selectedVillages', []);
                }}
                onBlur={() => setFieldTouched('selectedDistricts', true)}
                isMulti={true}
                isDisabled={values.selectedStates.length === 0}
              />

              <SelectField
                name="selectedSubDistricts"
                label="Sub-Districts"
                options={subDistrictOptions}
                value={values.selectedSubDistricts}
                onChange={selected => {
                  const selectedSubDistricts = subDistrictOptions.filter(
                    subDistrict => selected.includes(subDistrict.value),
                  );
                  setFieldValue('selectedSubDistricts', selectedSubDistricts);
                  setFieldValue('selectedVillages', []);
                }}
                onBlur={() => setFieldTouched('selectedSubDistricts', true)}
                isMulti={true}
                isDisabled={values.selectedDistricts.length === 0}
              />

              <SelectField
                name="selectedVillages"
                label="Villages"
                options={villageOptions}
                value={values.selectedVillages}
                onChange={selected => {
                  const selectedVillages = villageOptions.filter(village =>
                    selected.includes(village.value),
                  );
                  setFieldValue('selectedVillages', selectedVillages);
                }}
                onBlur={() => setFieldTouched('selectedVillages', true)}
                isMulti={true}
                isDisabled={values.selectedSubDistricts.length === 0}
              />

              <GradientButton
                disabled={loading || !isValid}
                title={loading ? 'Updating...' : 'Update'}
                onPress={handleSubmit}
                style={styles.buttonContainer}
              />
            </View>
          );
        }}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingBottom: 100,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  labelText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  selectFieldContainer: {
    marginVertical: 12,
  },
  multiSelectWrapper: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownSubsection: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  searchInput: {
    color: '#111827',
  },
  loadingText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default UpdateAnchalAreaAllocation;
